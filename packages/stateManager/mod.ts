import { EventEmitter } from "events";
import { Address } from "@ethereumjs/util";
import { bytesToHex, hexToBytes, PublicClient, fromBytes } from "viem";

import {
  type Listing,
  type IRelayClient,
  type Tag,
  type KeyCard,
  type ShippingDetails,
  type Order,
  type ShopCurrencies,
  type ShopManifest,
  type CreateShopManifest,
  type UpdateShopManifest,
  type ShopObjectTypes,
  type IError,
  type OrdersByStatus,
  ListingViewState,
  OrderState,
  type OrderPriceModifier,
  type ChoosePayment,
  SeqNo,
} from "./types.ts";
import * as abi from "@massmarket/contracts";
import schema from "@massmarket/schema";
import {
  SequencedEventWithRecoveredSigner,
  type EventId,
  eventIdEqual,
} from "@massmarket/client";
import {
  priceToUint256,
  objectId,
  addressToUint256,
  addressesToUint256,
  assert,
  assertField,
} from "@massmarket/utils";

// This is an interface that is used to retrieve and store objects from a persistant layer
export type Store<T extends ShopObjectTypes> = {
  put(key: string | `0x${string}` | OrderState, value: T): Promise<void>;
  get(key: string | `0x${string}` | OrderState): Promise<T>;
  iterator(): AsyncIterable<[string | `0x${string}` | OrderState, T]>;
};

// Given an requestId which is the returned value of the network event
// This returns a promise that resolves once the event has been emitted as js event
function eventListenAndResolve<T = ShopObjectTypes>(
  waitingForId: EventId,
  em: EventEmitter,
  eventName: string,
): Promise<T> {
  return new Promise((resolve, _) => {
    function onUpdate(update: T, updatedId: EventId) {
      if (eventIdEqual(waitingForId, updatedId)) {
        resolve(update);
        em.removeListener(eventName, onUpdate);
      }
    }
    em.on(eventName, onUpdate);
  });
}
async function storeOrdersByStatus(
  orderId: `0x${string}`,
  store: Store<Order | OrdersByStatus>,
  status: OrderState,
) {
  let orders: OrdersByStatus = [];

  try {
    orders = (await store.get(status)) as OrdersByStatus;
    orders.push(orderId);
  } catch (error) {
    const e = error as IError;
    if (e.notFound) {
      orders.push(orderId);
    } else {
      throw new Error(e.code);
    }
  }
  await store.put(status, orders);
}
abstract class PublicObjectManager<
  T extends ShopObjectTypes,
> extends EventEmitter {
  constructor(
    protected store: Store<T>,
    protected client: IRelayClient,
  ) {
    super();
  }

  abstract _processEvent(
    event: SequencedEventWithRecoveredSigner,
  ): Promise<void>;
  abstract get(key?: string | `0x${string}`): Promise<T>;
  get iterator() {
    return this.store.iterator.bind(this.store);
  }
}

//We should always make sure the network call is successful before updating the store with store.put
class ListingManager extends PublicObjectManager<Listing> {
  constructor(store: Store<Listing>, client: IRelayClient) {
    super(store, client);
  }
  // Process all events for listings.
  // Convert bytes to hex and save l object to listings store.
  async _processEvent(
    seqEvt: SequencedEventWithRecoveredSigner,
  ): Promise<void> {
    const event = seqEvt.event;
    if (event.listing) {
      const cl = event.listing;
      assertField(cl.id, "listing.id");
      assertField(cl.price, "listing.price");
      assert(cl.metadata, `listing.metadata ${bytesToHex(cl.id.raw)}`);
      assert(cl.metadata.title, "listing.metadata.title");
      assert(cl.metadata.description, "listing.metadata.description");
      assert((cl.metadata.images ?? []).length > 0, "listing.metadata.images");
      assert(cl.viewState, "listing.viewState");
      const id = bytesToHex(cl.id.raw);
      const l = {
        id,
        price: fromBytes(cl.price.raw, "bigint").toString(),
        metadata: {
          title: cl.metadata.title,
          description: cl.metadata.description,
          images: cl.metadata.images ?? [],
        },
        tags: [],
        quantity: 0,
        viewState: cl.viewState,
      };
      await this.store.put(id, l);
      this.emit("create", l, seqEvt.id());
      return;
    } else if (event.updateListing) {
      const ul = event.updateListing;
      assertField(ul.id, "updateListing.id");
      const id = bytesToHex(ul.id.raw);
      const l = await this.store.get(id);
      if (ul.metadata) {
        assert(ul.metadata, "updateListing.metadata");
        assert(ul.metadata.title, "updateListing.metadata.title");
        assert(ul.metadata.description, "updateListing.metadata.description");
        assert(ul.metadata.images, "updateListing.metadata.images");
        assert(
          (ul.metadata.images ?? []).length > 0,
          "updateListing.metadata.images",
        );
        l.metadata = {
          title: ul.metadata.title,
          description: ul.metadata.description,
          images: ul.metadata.images,
        };
      }
      if (ul.price) {
        assertField(ul.price, "updateListing.price");
        l.price = fromBytes(ul.price.raw, "bigint").toString();
      }
      if (ul.viewState) {
        // assert is valid value for viewState
        if (!Object.values(ListingViewState).includes(ul.viewState)) {
          throw new Error("Invalid viewState");
        }
        l.viewState = ul.viewState;
      }
      await this.store.put(id, l);
      this.emit("update", l, seqEvt.id());
      return;
    } else if (event.changeInventory) {
      const cs = event.changeInventory;
      assertField(cs.id, "changeInventory.id");
      assert(cs.diff, "changeInventory.diff");
      const lId = bytesToHex(cs.id.raw);
      const l = await this.store.get(lId);
      l.quantity = l.quantity + cs.diff;
      await this.store.put(lId, l);
      this.emit("changeInventory", lId, seqEvt.id());
      return;
    } else if (event.updateTag) {
      // Add or remove tagId to l
      const ut = event.updateTag;
      assertField(ut.id, "updateTag.id");
      const tagId = bytesToHex(ut.id.raw);
      if (ut.addListingIds) {
        const lIds = ut.addListingIds;
        await Promise.all(
          lIds.map(async (lId) => {
            assertField(lId, "updateTag.addListingIds");
            const iid = bytesToHex(lId.raw);
            const l = await this.store.get(iid);
            l.tags.push(tagId);
            this.emit("addListingId", iid, seqEvt.id());
            return await this.store.put(iid, l);
          }),
        );
      }
      if (ut.removeListingIds) {
        const lIds = ut.removeListingIds;
        await Promise.all(
          lIds.map(async (lId) => {
            assertField(lId, "updateTag.removeListingIds");
            const iid = bytesToHex(lId.raw);
            const l = await this.store.get(iid);
            // remove `tagId` from l.tags array
            l.tags = [...l.tags.filter((id: `0x${string}`) => id !== tagId)];
            this.emit("removeListingId", tagId, seqEvt.id());
            await this.store.put(iid, l);
          }),
        );
      }
    }
  }

  async create(l: Partial<Listing>, decimals?: number) {
    const eventId = await this.client.listing({
      id: { raw: objectId() },
      price: { raw: priceToUint256(l.price!, decimals) },
      metadata: l.metadata,
      viewState: l.viewState,
    });
    // resolves after the `listing` event has been fired in _processEvent, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Listing>(eventId, this, "create");
  }

  //update argument passed here will only contain the fields to update.
  async update(update: Partial<Listing>, decimals?: number) {
    //ui object to be passed to the network with converted network data types.
    //we are declaring the update object as type schema.IUpdateListing since we are changing values from hex to bytes and is no longer a interface l
    const ui: schema.IUpdateListing = {
      id: { raw: hexToBytes(update.id!) },
    };
    if (update.price) {
      ui.price = { raw: priceToUint256(update.price, decimals) };
    }
    if (update.metadata) {
      ui.metadata = update.metadata;
    }
    if (update.viewState !== undefined) {
      assert(
        Object.values(ListingViewState).includes(update.viewState),
        `update.viewState ${update.viewState} must be a valid ListingViewState`,
      );
      ui.viewState = update.viewState;
    }
    const requestId = await this.client.updateListing(ui);
    // resolves after the `updateListing` event has been fired, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Listing>(requestId, this, "update");
  }

  async addListingToTag(tagId: `0x${string}`, lId: `0x${string}`) {
    const requestId = await this.client.updateTag({
      id: { raw: hexToBytes(tagId) },
      addListingIds: [{ raw: hexToBytes(lId) }],
    });
    return eventListenAndResolve<Listing>(requestId, this, "addListingId");
  }

  async removeListingFromTag(tagId: `0x${string}`, lId: `0x${string}`) {
    const requestId = await this.client.updateTag({
      id: { raw: hexToBytes(tagId) },
      removeListingIds: [{ raw: hexToBytes(lId) }],
    });
    return eventListenAndResolve<Listing>(requestId, this, "removeListingId");
  }

  async changeInventory(lId: `0x${string}`, diff: number) {
    const requestId = await this.client.changeInventory({
      id: { raw: hexToBytes(lId) },
      diff,
    });
    return eventListenAndResolve<Listing>(requestId, this, "changeInventory");
  }
  get(key: `0x${string}`) {
    return this.store.get(key);
  }
}

class ShopManifestManager extends PublicObjectManager<ShopManifest | SeqNo> {
  constructor(store: Store<ShopManifest | SeqNo>, client: IRelayClient) {
    super(store, client);
  }
  //Process all manifest events. Convert bytes to hex, wait for database update, then emit event name
  async _processEvent(seqEvt: SequencedEventWithRecoveredSigner) {
    const event = seqEvt.event;
    if (event.manifest) {
      const sm = event.manifest;
      assertField(sm.tokenId, "manifest.tokenId");
      const manifest: ShopManifest = {
        tokenId: bytesToHex(sm.tokenId.raw),
        acceptedCurrencies: [],
        payees: [],
        shippingRegions: [],
      };
      if (sm.acceptedCurrencies) {
        manifest.acceptedCurrencies = sm.acceptedCurrencies.map(
          (a: schema.IShopCurrency) => {
            assertField(a.address, "manifest.acceptedCurrencies.address");
            return {
              address: bytesToHex(a.address.raw),
              chainId: Number(a.chainId),
            };
          },
        );
      }
      if (sm.pricingCurrency) {
        assertField(
          sm.pricingCurrency.address,
          "manifest.pricingCurrency.address",
        );
        manifest.pricingCurrency = {
          chainId: Number(sm.pricingCurrency.chainId),
          address: bytesToHex(sm.pricingCurrency.address.raw),
        };
      }
      if (sm.payees) {
        manifest.payees = sm.payees.map((p: schema.IPayee) => {
          assert(p.callAsContract, "manifest.payees.callAsContract");
          assert(p.name, "manifest.payees.name");
          assertField(p.address, "manifest.payees.address");
          // TODO: sadly can't use ...p because of the weak type inference
          return {
            name: p.name,
            callAsContract: p.callAsContract,
            chainId: Number(p.chainId),
            address: bytesToHex(p.address.raw),
          };
        });
      }
      if (sm.shippingRegions) {
        manifest.shippingRegions = sm.shippingRegions.map(
          (sr: schema.IShippingRegion) => {
            assert(
              sr.orderPriceModifiers,
              "manifest.shippingRegions.orderPriceModifiers",
            );
            assert(sr.name, "manifest.shippingRegions.name");
            assert(sr.country, "manifest.shippingRegions.country");
            assert(sr.postalCode, "manifest.shippingRegions.postalCode");
            assert(sr.city, "manifest.shippingRegions.city");
            return {
              name: sr.name,
              country: sr.country,
              postalCode: sr.postalCode,
              city: sr.city,
              orderPriceModifiers: sr.orderPriceModifiers.map(
                (pm: schema.IOrderPriceModifier) => {
                  assert(
                    pm.title,
                    "manifest.shippingRegions.orderPriceModifiers.title",
                  );
                  const m: OrderPriceModifier = {
                    title: pm.title,
                  };
                  if (pm.percentage) {
                    assertField(
                      pm.percentage,
                      "manifest.shippingRegions.orderPriceModifiers.percentage",
                    );
                    m.percentage = bytesToHex(pm.percentage.raw);
                  }
                  if (pm.absolute) {
                    assertField(
                      pm.absolute.diff,
                      "manifest.shippingRegions.orderPriceModifiers.absolute.diff",
                    );
                    assert(
                      pm.absolute.plusSign,
                      "manifest.shippingRegions.orderPriceModifiers.absolute.plusSign",
                    );
                    m.absolute = {
                      plusSign: pm.absolute.plusSign,
                      diff: bytesToHex(pm.absolute.diff.raw),
                    };
                  }
                  return m;
                },
              ),
            };
          },
        );
      }

      await this.store.put("shopManifest", manifest);
      this.emit("create", manifest, seqEvt.id());
      return;
    } else if (event.updateManifest) {
      const um = event.updateManifest;
      const manifest = (await this.store.get("shopManifest")) as ShopManifest;
      if (um.setPricingCurrency) {
        assertField(
          um.setPricingCurrency.address,
          "manifest.setPricingCurrency.address",
        );
        manifest.pricingCurrency = {
          chainId: Number(um.setPricingCurrency.chainId),
          address: bytesToHex(um.setPricingCurrency.address.raw),
        };
      }
      if (um.addAcceptedCurrencies) {
        const currencies = [...manifest.acceptedCurrencies];
        um.addAcceptedCurrencies.forEach((a: schema.IShopCurrency) => {
          assertField(a.address, "manifest.addAcceptedCurrencies.address");
          currencies.push({
            address: bytesToHex(a.address.raw),
            chainId: Number(a.chainId),
          });
        });
        manifest.acceptedCurrencies = currencies;
      }
      if (um.removeAcceptedCurrencies) {
        let filtered = [...manifest.acceptedCurrencies!];
        for (const rm of um.removeAcceptedCurrencies) {
          filtered = manifest.acceptedCurrencies!.filter((cur, idx) => {
            assertField(
              rm.address,
              `manifest.removeAcceptedCurrencies[${idx}].address`,
            );
            return (
              cur.address !== bytesToHex(rm.address.raw) ||
              cur.chainId !== Number(rm.chainId)
            );
          });
        }

        manifest.acceptedCurrencies = filtered;
      }
      if (um.addPayee) {
        assert(um.addPayee.callAsContract, "manifest.addPayee.callAsContract");
        assert(um.addPayee.name, "manifest.addPayee.name");
        assertField(um.addPayee.address, "manifest.addPayee.address");
        manifest.payees.push({
          name: um.addPayee.name,
          callAsContract: um.addPayee.callAsContract,
          chainId: Number(um.addPayee.chainId),
          address: bytesToHex(um.addPayee.address.raw),
        });
      }
      if (um.removePayee) {
        const ur = um.removePayee;
        assertField(ur.address, "manifest.removePayee.address");
        assert(ur.chainId, "manifest.removePayee.chainId");
        const wantAddr = bytesToHex(ur.address!.raw!);
        manifest.payees = manifest.payees.filter((p) => {
          // TODO: this doesn't complain about ur.chainId being Long sometimes!
          const isEqual =
            p.address.toLowerCase() === wantAddr.toLowerCase() &&
            p.chainId === Number(ur.chainId);
          return !isEqual;
        });
      }
      if (um.addShippingRegions) {
        um.addShippingRegions.forEach((sr: schema.IShippingRegion) => {
          assert(
            sr.orderPriceModifiers,
            "manifest.addShippingRegions.orderPriceModifiers",
          );
          assert(sr.name, "manifest.addShippingRegions.name");
          assert(sr.country, "manifest.addShippingRegions.country");
          assert(sr.postalCode, "manifest.addShippingRegions.postalCode");
          assert(sr.city, "manifest.addShippingRegions.city");
          manifest.shippingRegions.push({
            name: sr.name,
            country: sr.country,
            postalCode: sr.postalCode,
            city: sr.city,
            orderPriceModifiers: sr.orderPriceModifiers.map(
              (pm: schema.IOrderPriceModifier) => {
                assert(
                  pm.title,
                  "manifest.addShippingRegions.orderPriceModifiers.title",
                );
                const m: OrderPriceModifier = {
                  title: pm.title,
                };
                if (pm.percentage) {
                  assertField(
                    pm.percentage,
                    "manifest.addShippingRegions.orderPriceModifiers.percentage",
                  );
                  m.percentage = bytesToHex(pm.percentage.raw);
                }
                if (pm.absolute) {
                  assertField(
                    pm.absolute.diff,
                    "manifest.addShippingRegions.orderPriceModifiers.absolute.diff",
                  );
                  assert(
                    pm.absolute.plusSign,
                    "manifest.addShippingRegions.orderPriceModifiers.absolute.plusSign",
                  );
                  m.absolute = {
                    plusSign: pm.absolute.plusSign,
                    diff: bytesToHex(pm.absolute.diff.raw),
                  };
                }
                return m;
              },
            ),
          });
        });
      }
      await this.store.put("shopManifest", manifest);
      this.emit("update", manifest, seqEvt.id());
      return;
    }
  }

  async create(manifest: CreateShopManifest, shopId: `0x${string}`) {
    const m: schema.Manifest = schema.Manifest.create({});
    assert(manifest.pricingCurrency, "manifest.pricingCurrency is required");
    m.pricingCurrency = addressToUint256(
      manifest.pricingCurrency as ShopCurrencies,
    );

    assert(manifest.pricingCurrency, "manifest.pricingCurrency is required");
    m.pricingCurrency = addressToUint256(
      manifest.pricingCurrency as ShopCurrencies,
    );

    assert(
      manifest.acceptedCurrencies,
      "manifest.acceptedCurrencies is required",
    );
    m.acceptedCurrencies = addressesToUint256(manifest.acceptedCurrencies);

    assert(manifest.payees, "manifest.payees is required");
    m.payees = addressesToUint256(manifest.payees);

    assert(manifest.shippingRegions, "manifest.shippingRegions is required");
    m.shippingRegions = manifest.shippingRegions.map((sr) => {
      assert(sr.name, "shippingRegion.name is required");
      assert(sr.country, "shippingRegion.country is required");
      assert(sr.postalCode, "shippingRegion.postalCode is required");
      assert(sr.city, "shippingRegion.city is required");
      assert(
        sr.orderPriceModifiers,
        "shippingRegion.orderPriceModifiers is required",
      );
      return {
        ...sr,
        orderPriceModifiers: sr.orderPriceModifiers.map(
          (pm: OrderPriceModifier) => {
            assert(pm.title, "orderPriceModifier.title is required");
            const priceMod: schema.IOrderPriceModifier = {
              title: pm.title,
            };
            if (pm.percentage) {
              assert(
                pm.percentage,
                "orderPriceModifier.percentage is required",
              );
              priceMod.percentage = { raw: hexToBytes(pm.percentage) };
            } else if (pm.absolute) {
              assert(pm.absolute, "orderPriceModifier.absolute is required");
              assert(
                pm.absolute.plusSign !== undefined,
                "orderPriceModifier.absolute.plusSign is required",
              );
              assert(
                pm.absolute.diff,
                "orderPriceModifier.absolute.diff is required",
              );
              priceMod.absolute = {
                ...pm.absolute,
                diff: { raw: hexToBytes(pm.absolute.diff) },
              };
            } else {
              throw new Error(
                "Either percentage or absolute must be provided for orderPriceModifier",
              );
            }
            return priceMod;
          },
        ),
      };
    });
    const eventId = await this.client.shopManifest(m, shopId);
    // resolves after the `createShopManifest` event has been fired above in _processEvent, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<ShopManifest>(eventId, this, "create");
  }

  async update(um: UpdateShopManifest) {
    const update: schema.IUpdateManifest = {};
    //Convert address to bytes before sending to client.
    //We have to explicitly declare the update object as type schema.IUpdateShopManifest since we are changing hex to bytes and is no longer a type ShopManifest
    if (um.addPayee) {
      update.addPayee = addressToUint256(um.addPayee);
    }
    if (um.removePayee) {
      update.removePayee = addressToUint256(um.removePayee);
    }
    if (um.setPricingCurrency) {
      update.setPricingCurrency = addressToUint256(um.setPricingCurrency);
    }
    if (um.addAcceptedCurrencies) {
      update.addAcceptedCurrencies = addressesToUint256(
        um.addAcceptedCurrencies,
      );
    }
    if (um.removeAcceptedCurrencies) {
      update.removeAcceptedCurrencies = addressesToUint256(
        um.removeAcceptedCurrencies,
      );
    }
    if (um.addShippingRegions) {
      update.addShippingRegions = um.addShippingRegions.map((sr) => ({
        ...sr,
        orderPriceModifiers: sr.orderPriceModifiers.map((pm) => ({
          ...pm,
          absolute: pm.absolute
            ? {
                ...pm.absolute,
                diff: { raw: hexToBytes(pm.absolute.diff) },
              }
            : undefined,
          percentage: pm.percentage
            ? { raw: hexToBytes(pm.percentage) }
            : undefined,
        })),
      }));
    }

    // resolves after the `update` event has been fired above in _processEvent, which happens after the relay accepts the update and has written to the database.
    const requestId = await this.client.updateShopManifest(update);
    return eventListenAndResolve<ShopManifest>(requestId, this, "update");
  }

  get(): Promise<ShopManifest> {
    return this.store.get("shopManifest") as Promise<ShopManifest>;
  }
  async addSeqNo(no: number) {
    return this.store.put("seqNo", no);
  }

  async getSeqNo() {
    let no = 0;
    try {
      no = (await this.store.get("seqNo")) as number;
    } catch (error) {
      const e = error as IError;
      if (!e.notFound) {
        throw new Error(e.code);
      }
    }
    return no;
  }
}

class OrderManager extends PublicObjectManager<Order | OrdersByStatus> {
  constructor(store: Store<Order | OrdersByStatus>, client: IRelayClient) {
    super(store, client);
  }
  //Process all Order events. Convert bytes to hex, waits for database update, then emits event
  async _processEvent(
    seqEvt: SequencedEventWithRecoveredSigner,
  ): Promise<void> {
    const event = seqEvt.event;
    if (event.createOrder) {
      // console.log("createOrder");
      const co = event.createOrder;
      // console.log(co);
      assertField(co.id, "createOrder.id");
      const id = bytesToHex(co.id.raw);
      const o = {
        id: id,
        items: {},
        status: OrderState.STATE_OPEN,
      };
      await this.store.put(id, o);
      await storeOrdersByStatus(id, this.store, OrderState.STATE_OPEN);
      this.emit("create", o, seqEvt.id());
      return;
    } else if (event.updateOrder) {
      // console.log("updateOrder");
      const uo = event.updateOrder;
      // console.log(uo);
      assertField(uo.id, "updateOrder.id");
      const id = bytesToHex(uo.id.raw);
      const order = (await this.store.get(id)) as Order;
      if (uo.changeItems) {
        const ci = uo.changeItems;
        if (ci.adds) {
          ci.adds.map((orderl: schema.IOrderedItem) => {
            assertField(
              orderl.listingId,
              "updateOrder.changeItems.adds.listingId",
            );
            assert(orderl.quantity, "updateOrder.changeItems.adds.quantity");
            const listingId = bytesToHex(orderl.listingId.raw);
            //Check if l is already selected. If it is, add quantity to already selected quantity.
            const currentQuantity = order.items[listingId] ?? 0;
            if (currentQuantity) {
              order.items[listingId] = (orderl.quantity ?? 0) + currentQuantity;
            } else {
              order.items[listingId] = orderl.quantity ?? 0;
            }
          });
        }
        if (ci.removes) {
          ci.removes.map((orderl: schema.IOrderedItem) => {
            assertField(
              orderl.listingId,
              "updateOrder.changeItems.removes.listingId",
            );
            const listingId = bytesToHex(orderl.listingId.raw);
            const currentQuantity = order.items[listingId] ?? 0;
            if (currentQuantity) {
              order.items[listingId] = currentQuantity - (orderl.quantity ?? 0);
            }
          });
        }
        await this.store.put(id, order);
        this.emit("changeItems", order, seqEvt.id());
        return;
      } else if (uo.cancel) {
        const currentState = order.status;
        order.status = OrderState.STATE_CANCELED;
        //Save status as cancelled
        await this.store.put(id, order);
        await storeOrdersByStatus(id, this.store, OrderState.STATE_CANCELED);
        //remove the orderId from state of orders before this event.
        let orders = (await this.store.get(currentState)) as OrdersByStatus;
        orders = orders.filter((oId) => oId !== id);
        await this.store.put(currentState, orders);
        this.emit("orderCanceled", order, seqEvt.id());
        return;
      } else if (uo.setInvoiceAddress) {
        const update = uo.setInvoiceAddress;
        const sd = order.invoiceAddress
          ? order.invoiceAddress
          : {
              name: "",
              address1: "",
              city: "",
              postalCode: "",
              country: "",
              phoneNumber: "",
              emailAddress: "",
            };
        if (update.name) {
          sd.name = update.name;
        }
        if (update.address1) {
          sd.address1 = update.address1;
        }
        if (update.city) {
          sd.city = update.city;
        }
        if (update.postalCode) {
          sd.postalCode = update.postalCode;
        }
        if (update.country) {
          sd.country = update.country;
        }
        if (update.phoneNumber) {
          sd.phoneNumber = update.phoneNumber;
        }
        if (update.emailAddress) {
          sd.emailAddress = update.emailAddress;
        }
        order.invoiceAddress = sd;
        await this.store.put(id, order);
        this.emit("invoiceAddress", order, seqEvt.id());
        return;
      } else if (uo.setShippingAddress) {
        const update = uo.setShippingAddress;
        // shippingDetails may be null. If null, create an initial shipping details object to update.
        const sd = order.shippingDetails
          ? order.shippingDetails
          : {
              name: "",
              address1: "",
              city: "",
              postalCode: "",
              country: "",
              phoneNumber: "",
              emailAddress: "",
            };
        if (update.name) {
          sd.name = update.name;
        }
        if (update.address1) {
          sd.address1 = update.address1;
        }
        if (update.city) {
          sd.city = update.city;
        }
        if (update.postalCode) {
          sd.postalCode = update.postalCode;
        }
        if (update.country) {
          sd.country = update.country;
        }
        if (update.phoneNumber) {
          sd.phoneNumber = update.phoneNumber;
        }
        if (update.emailAddress) {
          sd.emailAddress = update.emailAddress;
        }
        order.shippingDetails = sd;
        await this.store.put(id, order);
        this.emit("shippingAddress", order, seqEvt.id());
        return;
      } else if (uo.commitItems) {
        const currentState = order.status;
        order.status = OrderState.STATE_COMMITED;
        await this.store.put(id, order);
        await storeOrdersByStatus(id, this.store, OrderState.STATE_COMMITED);
        //remove the orderId from state of orders before this event.
        let orders = (await this.store.get(currentState)) as OrdersByStatus;
        orders = orders.filter((oId) => oId !== id);
        await this.store.put(currentState, orders);
        this.emit("commitItems", order, seqEvt.id());
        return;
      } else if (uo.choosePayment) {
        const cp = uo.choosePayment;
        assert(
          cp.currency?.chainId,
          "updateOrder.choosePayment.currency.chainId",
        );
        assertField(
          cp.currency?.address,
          "updateOrder.choosePayment.currency.address",
        );
        assert(cp.payee, "updateOrder.choosePayment.payee");
        assert(cp.payee.name, "updateOrder.choosePayment.payee.name");
        assert(cp.payee.chainId, "updateOrder.choosePayment.payee.chainId");
        assertField(
          cp.payee.address,
          "updateOrder.choosePayment.payee.address",
        );
        const { chainId, address } = cp.currency;
        const choosePayment = {
          currency: {
            chainId: Number(chainId),
            address: bytesToHex(address.raw),
          },
          payee: {
            name: cp.payee.name,
            address: bytesToHex(cp.payee.address.raw),
            chainId: Number(cp.payee.chainId),
          },
        };
        order.choosePayment = choosePayment;
        await this.store.put(id, order);

        this.emit("choosePayment", order, seqEvt.id());
      } else if (uo.setPaymentDetails) {
        const pd = uo.setPaymentDetails;
        assertField(pd.paymentId, "updateOrder.setPaymentDetails.paymentId");
        assertField(pd.total, "updateOrder.setPaymentDetails.total");
        assertField(
          pd.shopSignature,
          "updateOrder.setPaymentDetails.shopSignature",
        );
        assert(pd.ttl, "updateOrder.setPaymentDetails.ttl");
        const paymentDetails = {
          paymentId: bytesToHex(pd.paymentId.raw),
          total: fromBytes(pd.total.raw, "bigint").toString(),
          shopSignature: bytesToHex(pd.shopSignature.raw),
          ttl: pd.ttl,
        };
        order.paymentDetails = paymentDetails;
        await this.store.put(id, order);
        this.emit("paymentDetails", order, seqEvt.id());
      } else if (uo.addPaymentTx) {
        assertField(
          uo.addPaymentTx.blockHash,
          "updateOrder.addPaymentTx.blockHash",
        );
        const currentState = order.status;
        order.status = OrderState.STATE_PAYMENT_TX;
        if (uo.addPaymentTx.blockHash) {
          order.blockHash = bytesToHex(uo.addPaymentTx.blockHash.raw);
        }
        if (uo.addPaymentTx.txHash) {
          order.txHash = bytesToHex(uo.addPaymentTx.txHash.raw);
        }
        await this.store.put(id, order);
        await storeOrdersByStatus(id, this.store, OrderState.STATE_PAYMENT_TX);
        //remove the orderId from state of orders before this event.
        let orders = (await this.store.get(currentState)) as OrdersByStatus;
        orders = orders.filter((oId) => oId !== id);
        await this.store.put(currentState, orders);
        this.emit("addPaymentTx", order, seqEvt.id());
        return;
      }
    }
  }

  get(key: `0x${string}`) {
    return this.store.get(key) as Promise<Order>;
  }

  async getStatus(key: OrderState): Promise<OrdersByStatus> {
    try {
      return this.store.get(key) as Promise<OrdersByStatus>;
    } catch (error) {
      const e = error as IError;
      if (e.notFound) {
        return [];
      } else {
        throw new Error(e.code);
      }
    }
  }

  async create() {
    const eventId = await this.client.createOrder({
      id: { raw: objectId() },
    });
    // resolves after the `createOrder` event has been fired in processEvent, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Order>(eventId, this, "create");
  }

  async addItems(
    orderId: `0x${string}`,
    lId: `0x${string}`,
    quantity: number,
  ) {
    const eventId = await this.client.updateOrder({
      id: { raw: hexToBytes(orderId) },
      changeItems: {
        adds: [{ listingId: { raw: hexToBytes(lId) }, quantity }],
      },
    });
    // resolves after the `changeItems` event has been fired, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Order>(eventId, this, "changeItems");
  }
  async removeItems(
    orderId: `0x${string}`,
    ls: { listingId: `0x${string}`; quantity: number }[],
  ) {
    const eventId = await this.client.updateOrder({
      id: { raw: hexToBytes(orderId) },
      changeItems: {
        removes: ls.map((i) => {
          return {
            listingId: { raw: hexToBytes(i.listingId) },
            quantity: i.quantity,
          };
        }),
      },
    });
    // resolves after the `changeItems` event has been fired, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Order>(eventId, this, "changeItems");
  }
  async updateShippingDetails(
    orderId: `0x${string}`,
    update: Partial<ShippingDetails>,
  ) {
    const eventId = await this.client.updateOrder({
      id: { raw: hexToBytes(orderId) },
      setShippingAddress: update,
    });
    return eventListenAndResolve<Order>(eventId, this, "shippingAddress");
  }
  async updateInvoiceAddress(
    orderId: `0x${string}`,
    update: Partial<ShippingDetails>,
  ) {
    const eventId = await this.client.updateOrder({
      id: { raw: hexToBytes(orderId) },
      setInvoiceAddress: update,
    });
    return eventListenAndResolve<Order>(eventId, this, "invoiceAddress");
  }

  async cancel(orderId: `0x${string}`, timestamp: number = 0) {
    const eventId = await this.client.updateOrder({
      id: { raw: hexToBytes(orderId) },
      cancel: {},
    });
    return eventListenAndResolve<Order>(eventId, this, "orderCanceled");
  }
  async choosePayment(orderId: `0x${string}`, payment: ChoosePayment) {
    const eventId = await this.client.updateOrder({
      id: { raw: hexToBytes(orderId) },
      choosePayment: {
        currency: addressToUint256(payment.currency),
        payee: addressToUint256(payment.payee),
      },
    });
    return eventListenAndResolve<Order>(eventId, this, "choosePayment");
  }
  async commit(orderId: `0x${string}`) {
    const eventId = await this.client.updateOrder({
      id: { raw: hexToBytes(orderId) },
      commitItems: {},
    });
    return eventListenAndResolve<Order>(eventId, this, "commitItems");
  }
}
class TagManager extends PublicObjectManager<Tag> {
  constructor(store: Store<Tag>, client: IRelayClient) {
    super(store, client);
  }

  async _processEvent(
    seqEvt: SequencedEventWithRecoveredSigner,
  ): Promise<void> {
    const event = seqEvt.event;
    if (event.tag) {
      const ct = event.tag;
      assert(ct.name, "tag.name");
      assertField(ct.id, "tag.id");
      const id = bytesToHex(ct.id.raw);
      const tag = {
        id: id,
        name: ct.name,
      };
      await this.store.put(id, tag);
      this.emit("create", tag, seqEvt.id());
      return;
    }
    if (event.updateTag) {
      const ut = event.updateTag;
      assertField(ut.id, "updateTag.id");
      const id = bytesToHex(ut.id.raw);
      const tag = await this.store.get(id);
      if (ut.rename) {
        tag.name = ut.rename;
      }
      await this.store.put(id, tag);
      this.emit("update", tag, seqEvt.id());
    }
  }
  async create(name: string) {
    const eventId = await this.client.tag({
      id: { raw: objectId() },
      name,
    });
    // resolves after the `tag` event has been fired, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Tag>(eventId, this, "create");
  }

  get(key: `0x${string}`) {
    return this.store.get(key);
  }
}

class KeyCardManager extends PublicObjectManager<KeyCard> {
  constructor(store: Store<KeyCard>, client: IRelayClient) {
    super(store, client);
  }

  async _processEvent(
    seqEvt: SequencedEventWithRecoveredSigner,
  ): Promise<void> {
    const event = seqEvt.event;
    if (event.account) {
      const a = event.account;
      assertField(
        a.enrollKeycard?.keycardPubkey,
        "account.enrollKeycard.keycardPubkey",
      );
      const addressFromPubKey = Address.fromPublicKey(
        a.enrollKeycard.keycardPubkey.raw,
      ).toString() as `0x${string}`;
      await this.addAddress(addressFromPubKey);
      this.emit("newKeyCard", addressFromPubKey, seqEvt.id());
      return;
    }
  }

  get() {
    return this.store.get("cardPublicKey");
  }

  async verify(address: `0x${string}`) {
    let keys: `0x${string}`[];
    try {
      keys = await this.store.get("cardPublicKey");
    } catch (error) {
      const e = error as IError;
      if (e.notFound) {
        keys = [];
      } else {
        throw new Error(e.code);
      }
    }
    if (keys.includes(address.toLowerCase() as `0x${string}`)) {
      return;
    }
    throw new Error(`Unverified Event: signed by unknown address ${address}`);
  }

  async addAddress(key: `0x${string}`) {
    const k = key.toLowerCase() as `0x${string}`;
    let publicKeys: `0x${string}`[] = [];
    try {
      publicKeys = await this.store.get("cardPublicKey");
      if (!publicKeys.includes(k)) {
        publicKeys.push(k);
      }
    } catch (error) {
      const e = error as IError;
      if (e.notFound) {
        publicKeys.push(k);
      } else {
        throw new Error(e.code);
      }
    }
    return this.store.put("cardPublicKey", publicKeys);
  }
}
// This class creates the state of a store from an event stream
// It also handles the states persistence, retrieval and updates

export class StateManager {
  readonly listings: ListingManager;
  readonly tags: TagManager;
  readonly manifest: ShopManifestManager;
  readonly orders: OrderManager;
  readonly keycards: KeyCardManager;
  readonly shopId;
  readonly publicClient: PublicClient;
  readonly seqNo: EventEmitter;
  readonly stream;
  readonly eventStreamProcessing: Promise<void>;
  constructor(
    public client: IRelayClient,
    listingStore: Store<Listing>,
    tagStore: Store<Tag>,
    shopManifestStore: Store<ShopManifest | SeqNo>,
    orderStore: Store<Order | OrdersByStatus>,
    keycardStore: Store<KeyCard>,
    shopId: `0x${string}`,
    publicClient: PublicClient,
  ) {
    this.listings = new ListingManager(listingStore, client);
    this.tags = new TagManager(tagStore, client);
    this.manifest = new ShopManifestManager(shopManifestStore, client);
    this.orders = new OrderManager(orderStore, client);
    this.keycards = new KeyCardManager(keycardStore, client);
    this.shopId = shopId;
    this.publicClient = publicClient;
    this.seqNo = new EventEmitter();
    this.stream = this.client.createEventStream();
    this.eventStreamProcessing = this.#start();
  }

  async #start() {
    const storeObjects = [
      this.listings,
      this.tags,
      this.manifest,
      this.orders,
      this.keycards,
    ];

    //Each event will go through all the storeObjects and update the relevant stores.
    let event: SequencedEventWithRecoveredSigner;
    for await (event of this.stream) {
      await this.manifest.addSeqNo(event.shopSeqNo);

      //fromPublicKey in KeyCard manager returns the address from public key as all lowercase.
      await this.keycards.verify(event.signer);
      for (const storeObject of storeObjects) {
        await storeObject._processEvent(event);
      }
    }
  }

  async addRelaysToKeycards() {
    //When we inititally create a shop, we are saving the relay tokenId => shopId.
    //Here, we are retrieving all the relay addresses associated with the shopId and saving them to keycards store.
    //Since some shopEvents are signed by a relay, we need to include these addresses when verifying the event signer.
    const count = (await this.publicClient.readContract({
      address: abi.addresses.ShopReg as `0x${string}`,
      abi: abi.ShopReg,
      functionName: "getRelayCount",
      args: [this.shopId],
    })) as number;
    console.warn("relay count:", count);
    if (count > 0) {
      const tokenIds = (await this.publicClient.readContract({
        address: abi.addresses.ShopReg as `0x${string}`,
        abi: abi.ShopReg,
        functionName: "getAllRelays",
        args: [this.shopId],
      })) as `0x${string}`[];
      for await (const tokenId of tokenIds) {
        const ownerAdd = (await this.publicClient!.readContract({
          address: abi.addresses.RelayReg as `0x${string}`,
          abi: abi.RelayReg,
          functionName: "ownerOf",
          args: [tokenId],
        })) as `0x${string}`;
        console.warn("adding relay:", ownerAdd);
        await this.keycards.addAddress(ownerAdd);
      }
    }
  }
}
