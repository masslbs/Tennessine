import { EventEmitter } from "events";
import schema from "@massmarket/schema";
import { bytesToHex, hexToBytes, PublicClient, fromBytes } from "viem";
import { priceToUint256, addressToUint256, objectId } from "@massmarket/utils";
import {
  IRelayClient,
  Item,
  Tag,
  KeyCard,
  ShippingDetails,
  Order,
  ShopCurrencies,
  ShopManifest,
  CreateShopManifest,
  UpdateShopManifest,
  ShopObjectTypes,
  IError,
  OrdersByStatus,
  ListingViewState,
  Payee,
  OrderState,
  ShippingRegion,
  OrderPriceModifier,
  ChoosePayment,
  SeqNo,
} from "./types";
import { Address } from "@ethereumjs/util";
import * as abi from "@massmarket/contracts";

// This is an interface that is used to retrieve and store objects from a persistant layer
export type Store<T extends ShopObjectTypes> = {
  put(key: string | `0x${string}` | OrderState, value: T): Promise<void>;
  get(key: string | `0x${string}` | OrderState): Promise<T>;
  iterator(): AsyncIterable<[string | `0x${string}` | OrderState, T]>;
};

// Given an eventId which is the returned value of the network event
// This returns a promise that resolves once the event has been emitted as js event
function eventListenAndResolve<T = ShopObjectTypes>(
  eventId: number,
  em: EventEmitter,
  eventName: string,
): Promise<T> {
  return new Promise((resolve, _) => {
    function onUpdate(update: T, eId: number) {
      if (eId === eventId) {
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
  abstract _processEvent(event: schema.ShopEvents): Promise<void>;
  abstract get(key?: string | `0x${string}`): Promise<T>;
  get iterator() {
    return this.store.iterator.bind(this.store);
  }
}
class SeqNoEmitter extends EventEmitter {}

//We should always make sure the network call is successful before updating the store with store.put
class ListingManager extends PublicObjectManager<Item> {
  constructor(store: Store<Item>, client: IRelayClient) {
    super(store, client);
  }
  // Process all events for listings.
  // Convert bytes to hex and save item object to listings store.
  async _processEvent(event: schema.ShopEvents): Promise<void> {
    if (event.listing) {
      const cl = event.listing;
      const id = bytesToHex(cl.id.raw);
      const item = {
        id: id,
        price: fromBytes(cl.price.raw, "bigint").toString(),
        metadata: cl.metadata,
        tags: [],
        quantity: 0,
        viewState: cl.viewState,
      };
      await this.store.put(id, item);
      this.emit("create", item, event.requestId);
      return;
    } else if (event.updateListing) {
      const ul = event.updateListing;
      const id = bytesToHex(ul.id.raw);
      const item = await this.store.get(id);
      if (ul.metadata) {
        item.metadata = ul.metadata;
      }
      if (ul.price) {
        item.price = fromBytes(ul.price.raw, "bigint").toString();
      }
      if (Object.values(ListingViewState).includes(ul.viewState)) {
        item.viewState = ul.viewState;
      }
      await this.store.put(id, item);
      this.emit("update", item, event.requestId);
      return;
    } else if (event.changeInventory) {
      const cs = event.changeInventory;
      const itemId = bytesToHex(cs.id.raw);
      const item = await this.store.get(itemId);
      item.quantity = item.quantity + cs.diff;
      await this.store.put(itemId, item);
      this.emit("changeInventory", itemId, event.requestId);
      return;
    } else if (event.updateTag) {
      // Add or remove tagId to item
      const ut = event.updateTag;
      const tagId = bytesToHex(ut.id.raw);
      if (ut.addListingIds) {
        const itemIds = ut.addListingIds;
        await Promise.all(
          itemIds.map(async (itemId: { raw: Uint8Array }) => {
            const iid = bytesToHex(itemId.raw);
            const item = await this.store.get(iid);
            item.tags.push(tagId);
            this.emit("addItemId", iid, event.requestId);
            return await this.store.put(iid, item);
          }),
        );
        return;
      } else if (ut.removeListingIds) {
        const itemIds = ut.removeListingIds;
        await Promise.all(
          itemIds.map(async (itemId: { raw: Uint8Array }) => {
            const iid = bytesToHex(itemId.raw);
            const item = await this.store.get(iid);
            // remove `tagId` from item.tags array
            item.tags = [
              ...item.tags.filter((id: `0x${string}`) => id !== tagId),
            ];
            this.emit("removeItemId", tagId, event.requestId);
            await this.store.put(iid, item);
          }),
        );
        return;
      }
    }
  }

  async create(item: Partial<Item>, decimals?: number) {
    const eventId = await this.client.listing({
      id: { raw: objectId() },
      price: { raw: priceToUint256(item.price!, decimals) },
      metadata: item.metadata,
      viewState: item.viewState,
    });
    // resolves after the `listing` event has been fired in _processEvent, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Item>(eventId, this, "create");
  }
  //update argument passed here will only contain the fields to update.
  async update(update: Partial<Item>, decimals?: number) {
    //ui object to be passed to the network with converted network data types.
    //we are declaring the update object as type schema.IUpdateItem since we are changing values from hex to bytes and is no longer a interface Item
    const ui: schema.IUpdateItem = {
      id: { raw: hexToBytes(update.id!) },
    };
    if (update.price) {
      ui.price = { raw: priceToUint256(update.price, decimals) };
    }
    if (update.metadata) {
      ui.metadata = update.metadata;
    }
    if (Object.values(ListingViewState).includes(update.viewState!)) {
      ui.viewState = update.viewState;
    }
    const eventId = await this.client.updateListing(ui);
    // resolves after the `updateListing` event has been fired, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Item>(eventId, this, "update");
  }

  async addItemToTag(tagId: `0x${string}`, itemId: `0x${string}`) {
    const eventId = await this.client.updateTag({
      id: { raw: hexToBytes(tagId) },
      addListingIds: [{ raw: hexToBytes(itemId) }],
    });
    return eventListenAndResolve<Item>(eventId, this, "addItemId");
  }

  async removeItemFromTag(tagId: `0x${string}`, itemId: `0x${string}`) {
    const eventId = await this.client.updateTag({
      id: { raw: hexToBytes(tagId) },
      removeListingIds: [{ raw: hexToBytes(itemId) }],
    });
    return eventListenAndResolve<Item>(eventId, this, "removeItemId");
  }

  async changeInventory(itemId: `0x${string}`, diff: number) {
    const eventId = await this.client.changeInventory({
      id: { raw: hexToBytes(itemId) },
      diff,
    });
    return eventListenAndResolve<Item>(eventId, this, "changeInventory");
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
  async _processEvent(event: schema.ShopEvents) {
    if (event.manifest) {
      const sm = event.manifest;
      const manifest: ShopManifest = {
        tokenId: bytesToHex(sm.tokenId.raw),
        acceptedCurrencies: [],
        pricingCurrency: {
          address: null,
          chainId: null,
        },
        payees: [],
        shippingRegions: [],
      };
      if (sm.acceptedCurrencies) {
        manifest.acceptedCurrencies = sm.acceptedCurrencies.map(
          (a: schema.IShopCurrency) => {
            return {
              address: bytesToHex(a.address.raw),
              chainId: Number(a.chainId),
            };
          },
        );
      }
      if (sm.pricingCurrency) {
        manifest.pricingCurrency = {
          chainId: Number(sm.pricingCurrency.chainId),
          address: bytesToHex(sm.pricingCurrency.address.raw),
        };
      }
      if (sm.payees) {
        manifest.payees = sm.payees.map((p: schema.IPayee) => {
          return {
            ...p,
            chainId: Number(p.chainId),
            address: bytesToHex(p.address.raw),
          };
        });
      }
      if (sm.shippingRegions) {
        manifest.shippingRegions = sm.shippingRegions.map(
          (sr: schema.IShippingRegion) => {
            return {
              ...sr,
              orderPriceModifiers: sr.orderPriceModifiers.map(
                (pm: schema.IOrderPriceModifier) => {
                  const m: OrderPriceModifier = {
                    title: pm.title,
                  };
                  if (pm.percentage) {
                    m.percentage = bytesToHex(pm.percentage.raw);
                  }
                  if (pm.absolute) {
                    m.absolute = {
                      ...pm.absolute,
                      diff: bytesToHex(pm.absolute?.diff.raw),
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
      this.emit("create", manifest, event.requestId);
      return;
    } else if (event.updateManifest) {
      const um = event.updateManifest;
      const manifest = (await this.store.get("shopManifest")) as ShopManifest;
      if (um.setPricingCurrency) {
        manifest.pricingCurrency = {
          chainId: Number(um.setPricingCurrency.chainId),
          address: bytesToHex(um.setPricingCurrency.address.raw),
        };
      }
      if (um.addAcceptedCurrencies) {
        const currencies = [...manifest.acceptedCurrencies];
        um.addAcceptedCurrencies.forEach((a: schema.IShopCurrency) => {
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
          filtered = manifest.acceptedCurrencies!.filter(
            (cur) =>
              cur.address !== bytesToHex(rm.address.raw) ||
              cur.chainId !== rm.chainId,
          );
        }

        manifest.acceptedCurrencies = filtered;
      }
      if (um.addPayee) {
        manifest.payees.push({
          ...um.addPayee,
          chainId: Number(um.addPayee.chainId),
          address: bytesToHex(um.addPayee.address.raw),
        });
      }
      if (um.removePayee) {
        manifest.payees = manifest.payees.filter(
          (p) => p.address !== bytesToHex(um.removePayee.address.raw),
        );
      }
      if (um.addShippingRegions) {
        um.addShippingRegions.forEach((sr: schema.IShippingRegion) => {
          manifest.shippingRegions.push({
            ...sr,
            orderPriceModifiers: sr.orderPriceModifiers.map(
              (pm: schema.IOrderPriceModifier) => {
                const m: OrderPriceModifier = {
                  title: pm.title,
                };
                if (pm.percentage) {
                  m.percentage = bytesToHex(pm.percentage.raw);
                }
                if (pm.absolute) {
                  m.absolute = {
                    ...pm.absolute,
                    diff: bytesToHex(pm.absolute?.diff.raw),
                  };
                }
                return m;
              },
            ),
          });
        });
      }
      await this.store.put("shopManifest", manifest);
      this.emit("update", manifest, event.requestId);

      return;
    }
  }

  async create(manifest: CreateShopManifest, shopId: `0x${string}`) {
    const m: schema.IShopManifest = manifest;
    if (manifest.pricingCurrency) {
      m.pricingCurrency = addressToUint256(
        manifest.pricingCurrency as ShopCurrencies,
      );
    }
    if (manifest.acceptedCurrencies) {
      m.acceptedCurrencies = addressToUint256(manifest.acceptedCurrencies);
    }
    if (manifest.payees) {
      m.payees = addressToUint256(manifest.payees);
    }
    if (manifest.shippingRegions) {
      m.shippingRegions = manifest.shippingRegions.map((sr) => {
        return {
          ...sr,
          orderPriceModifiers: sr.orderPriceModifiers.map(
            (pm: OrderPriceModifier) => {
              const priceMod: schema.IOrderPriceModifier = {
                title: pm.title,
              };
              if (pm.percentage) {
                priceMod.percentage = { raw: hexToBytes(pm.percentage) };
              }
              if (pm.absolute) {
                priceMod.absolute = {
                  ...pm.absolute,
                  diff: { raw: hexToBytes(pm.absolute.diff) },
                };
              }
              return priceMod;
            },
          ),
        };
      });
    }

    const eventId = await this.client.shopManifest(m, shopId);
    // resolves after the `createShopManifest` event has been fired above in _processEvent, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<ShopManifest>(eventId, this, "create");
  }

  async update(um: UpdateShopManifest) {
    //Convert address to bytes before sending to client.
    //We have to explicitly declare the update object as type schema.IUpdateShopManifest since we are changing hex to bytes and is no longer a type ShopManifest
    const updateShopManifest: schema.IUpdateShopManifest = um;
    for (const [key, _] of Object.entries(updateShopManifest)) {
      const keys = [
        "addAcceptedCurrencies",
        "removeAcceptedCurrencies",
        "setPricingCurrency",
        "addPayee",
        "removePayee",
      ];
      if (keys.includes(key)) {
        updateShopManifest[key] = addressToUint256(updateShopManifest[key]);
      }
    }
    // resolves after the `updateShopManifest` event has been fired above in _processEvent, which happens after the relay accepts the update and has written to the database.
    const eventId = await this.client.updateShopManifest(updateShopManifest);
    return eventListenAndResolve<ShopManifest>(eventId, this, "update");
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
  async _processEvent(event: schema.ShopEvents): Promise<void> {
    if (event.createOrder) {
      const co = event.createOrder;
      const id = bytesToHex(co.id.raw);
      const o = {
        id: id,
        items: {},
        status: OrderState.STATE_OPEN,
      };
      await this.store.put(id, o);
      await storeOrdersByStatus(id, this.store, OrderState.STATE_OPEN);
      this.emit("create", o, event.requestId);
      return;
    } else if (event.updateOrder) {
      const uo: schema.IUpdateOrder = event.updateOrder;
      const id = bytesToHex(uo.id.raw);
      const order = (await this.store.get(id)) as Order;
      if (uo.changeItems) {
        const ci = uo.changeItems;
        if (ci.adds) {
          ci.adds.map((orderItem: schema.IOrderedItem) => {
            const listingId = bytesToHex(orderItem.listingId.raw);
            //Check if item is already selected. If it is, add quantity to already selected quantity.
            if (order.items[listingId]) {
              order.items[listingId] =
                orderItem.quantity + order.items[listingId];
            } else {
              order.items[listingId] = orderItem.quantity;
            }
          });
        }
        if (ci.removes) {
          ci.removes.map((orderItem: schema.IOrderedItem) => {
            const listingId = bytesToHex(orderItem.listingId.raw);
            order.items[listingId] =
              order.items[listingId] - orderItem.quantity;
          });
        }
        await this.store.put(id, order);
        this.emit("changeItems", order, event.requestId);
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
        this.emit("orderCanceled", order, event.requestId);
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
        this.emit("invoiceAddress", order, event.requestId);
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
        this.emit("shippingAddress", order, event.requestId);
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
        this.emit("commitItems", order, event.requestId);
        return;
      } else if (uo.choosePayment) {
        const { chainId, address } = uo.choosePayment.currency;
        const { payee } = uo.choosePayment;
        const choosePayment = {
          currency: {
            chainId: Number(chainId),
            address: bytesToHex(address.raw),
          },
          payee: {
            name: payee.name,
            address: bytesToHex(payee.address.raw),
            chainId: Number(payee.chainId),
          },
        };
        order.choosePayment = choosePayment;
        await this.store.put(id, order);

        this.emit("choosePayment", order, event.requestId);
      } else if (uo.setPaymentDetails) {
        const pd = uo.setPaymentDetails;
        const paymentDetails = {
          paymentId: bytesToHex(pd.paymentId.raw),
          total: fromBytes(pd.total.raw, "bigint").toString(),
          shopSignature: bytesToHex(pd.shopSignature.raw),
          ttl: pd.ttl,
        };
        order.paymentDetails = paymentDetails;
        await this.store.put(id, order);
        this.emit("paymentDetails", order, event.requestId);
      } else if (uo.addPaymentTx) {
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
        this.emit("addPaymentTx", order);
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
    const eventId = await this.client.createOrder({ id: { raw: objectId() } });
    // resolves after the `createOrder` event has been fired in processEvent, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Order>(eventId, this, "create");
  }

  async addsItems(
    orderId: `0x${string}`,
    itemId: `0x${string}`,
    quantity: number,
  ) {
    const eventId = await this.client.updateOrder({
      id: { raw: hexToBytes(orderId) },
      changeItems: {
        adds: [{ listingId: { raw: hexToBytes(itemId) }, quantity }],
      },
    });
    // resolves after the `changeItems` event has been fired, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Order>(eventId, this, "changeItems");
  }
  async removesItems(
    orderId: `0x${string}`,
    items: { listingId: `0x${string}`; quantity: number }[],
  ) {
    const eventId = await this.client.updateOrder({
      id: { raw: hexToBytes(orderId) },
      changeItems: {
        removes: items.map((i) => {
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

  async _processEvent(event: schema.ShopEvents): Promise<void> {
    if (event.tag) {
      const ct = event.tag;
      const id = bytesToHex(ct.id.raw);
      const tag = {
        id: id,
        name: ct.name,
      };
      await this.store.put(id, tag);
      this.emit("create", tag, event.requestId);
      return;
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

  async _processEvent(event: schema.ShopEvents): Promise<void> {
    if (event.account) {
      const a = event.account;
      let publicKeys: `0x${string}`[] = [];
      const addressFromPubKey = Address.fromPublicKey(
        a.enrollKeycard.keycardPubkey.raw,
      ).toString() as `0x${string}`;
      try {
        publicKeys = await this.store.get("cardPublicKey");
        if (!publicKeys.includes(addressFromPubKey)) {
          publicKeys.push(addressFromPubKey);
        }
      } catch (error) {
        const e = error as IError;
        if (e.notFound) {
          publicKeys.push(addressFromPubKey);
        } else {
          throw new Error(e.code);
        }
      }
      await this.store.put("cardPublicKey", publicKeys);
      this.emit("newKeyCard", addressFromPubKey);
      return;
    }
  }

  get() {
    return this.store.get("cardPublicKey");
  }
  async verify(address: `0x${string}`) {
    const keys = await this.store.get("cardPublicKey");
    if (keys.includes(address)) {
      return;
    } else throw new Error(`Unverified Event: verifying address ${address}`);
  }
  async addAddress(key: `0x${string}`) {
    const k = key.toLowerCase() as `0x${string}`;
    let publicKeys: `0x${string}`[] = [];
    try {
      publicKeys = await this.store.get("cardPublicKey");
      publicKeys.push(k);
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
  readonly items;
  readonly tags;
  readonly manifest;
  readonly orders;
  readonly keycards;
  readonly shopId;
  readonly publicClient;
  eventStreamProcessing;
  constructor(
    public client: IRelayClient,
    listingStore: Store<Item>,
    tagStore: Store<Tag>,
    shopManifestStore: Store<ShopManifest | SeqNo>,
    orderStore: Store<Order | OrdersByStatus>,
    keycardStore: Store<KeyCard>,
    shopId: `0x${string}`,
    publicClient: PublicClient,
  ) {
    this.items = new ListingManager(listingStore, client);
    this.tags = new TagManager(tagStore, client);
    this.manifest = new ShopManifestManager(shopManifestStore, client);
    this.orders = new OrderManager(orderStore, client);
    this.keycards = new KeyCardManager(keycardStore, client);
    this.shopId = shopId;
    this.publicClient = publicClient;

    this.eventStreamProcessing = this.#start();
    this.eventStreamProcessing.catch((err) => {
      console.log("Error something bad happened in the stream", err);
    });
  }

  async #start() {
    const storeObjects = [
      this.items,
      this.tags,
      this.manifest,
      this.orders,
      this.keycards,
    ];
    const stream = this.client.createEventStream();

    //When we inititally create a shop, we are saving the relay tokenId => shopId.
    //Here, we are retrieving all the relay addresses associated with the shopId and saving them to keycards store.
    //Since some shopEvents are signed by a relay, we need to include these addresses when verifying the event signer.
    const count = (await this.publicClient.readContract({
      address: abi.addresses.ShopReg as `0x${string}`,
      abi: abi.ShopReg,
      functionName: "getRelayCount",
      args: [this.shopId],
    })) as number;
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
        await this.keycards.addAddress(ownerAdd);
      }
    }
    //Each event will go through all the storeObjects and update the relevant stores.
    for await (const event of stream) {
      if (event.event.seqNo) {
        await this.manifest.addSeqNo(event.event.seqNo);
      }
      //fromPublicKey in KeyCard manager returns the address from public key as all lowercase.
      await this.keycards.verify(event.signer.toLowerCase());
      for (const storeObject of storeObjects) {
        await storeObject._processEvent(event.event);
      }
    }
  }
}
