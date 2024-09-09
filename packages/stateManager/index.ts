import { EventEmitter } from "events";
import schema from "@massmarket/schema";
import { bytesToHex, hexToBytes, fromBytes } from "viem";
import { priceToUint256 } from "@massmarket/utils";
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
} from "./types";

// This is an interface that is used to retrieve and store objects from a persistant layer
export type Store<T extends ShopObjectTypes> = {
  put(key: string | BigInt | OrderState, value: T): Promise<void>;
  get(key: string | BigInt | OrderState): Promise<T>;
  iterator(): AsyncIterable<[BigInt | string, T]>;
};

// Given an eventId which is the returned value of the network event
// This returns a promise that resolves once the event has been emitted as js event
function eventListenAndResolve<T = ShopObjectTypes>(
  eventId: BigInt,
  em: EventEmitter,
  eventName: string,
): Promise<T> {
  return new Promise((resolve, _) => {
    function onUpdate(update: T, eId: BigInt) {
      if (eId === eventId) {
        resolve(update);
        em.removeListener(eventName, onUpdate);
      }
    }
    em.on(eventName, onUpdate);
  });
}
async function storeOrdersByStatus(
  orderId: BigInt,
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
  abstract get(key?: string | BigInt): Promise<T>;
  get iterator() {
    return this.store.iterator.bind(this.store);
  }
}

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
      const { id } = cl;
      const item = {
        id,
        basePrice: fromBytes(cl.basePrice.raw, "bigint").toString(),
        baseInfo: cl.baseInfo,
        tags: [],
        quantity: 0,
        viewState: cl.viewState,
      };
      await this.store.put(id, item);
      this.emit("create", item, cl.eventId);
      return;
    } else if (event.updateListing) {
      const ui = event.updateListing;
      const { id } = ui;
      const item = await this.store.get(id);
      if (ui.baseInfo) {
        item.baseInfo = ui.baseInfo;
      }
      if (ui.basePrice) {
        item.basePrice = fromBytes(ui.basePrice.raw, "bigint").toString();
      }
      if (ui.viewState) {
        item.viewState = ui.viewState;
      }
      await this.store.put(id, item);
      this.emit("update", item, ui.eventId);
      return;
    } else if (event.changeInventory) {
      const cs = event.changeInventory;
      const itemId = cs.id;
      const item = await this.store.get(itemId);
      item.quantity = item.quantity + cs.diff;
      await this.store.put(itemId, item);
      this.emit("changeInventory", itemId, cs.eventId);
      return;
    } else if (event.updateTag) {
      // Add or remove tagId to item
      const ut = event.updateTag;
      const tagId = ut.id;

      if (ut.addListingIds) {
        const itemIds = ut.addListingIds;
        await Promise.all(
          itemIds.map(async (itemId: BigInt) => {
            const item = await this.store.get(itemId);
            item.tags.push(tagId);
            this.emit("addListingIds", itemId, ut.eventId);
            return await this.store.put(itemId, item);
          }),
        );
        return;
      } else if (ut.removeListingIds) {
        const itemIds = ut.removeListingIds;
        await Promise.all(
          itemIds.map(async (itemId: BigInt) => {
            const item = await this.store.get(itemId);
            // remove `tagId` from item.tags array
            item.tags = [...item.tags.filter((id: BigInt) => id !== tagId)];
            this.emit("removeListingIds", tagId, ut.eventId);
            await this.store.put(itemId, item);
          }),
        );
        return;
      }
    }
  }

  async create(item: Partial<Item>) {
    const eventId = await this.client.listing({
      basePrice: { raw: priceToUint256(item.basePrice!) },
      baseInfo: item.baseInfo,
      viewState: item.viewState,
    });
    // resolves after the `listing` =event has been fired in _processEvent, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Item>(eventId, this, "create");
  }
  //update argument passed here will only contain the fields to update.
  async update(update: Partial<Item>) {
    //ui object to be passed to the network with converted network data types.
    //we are declaring the update object as type schema.IUpdateItem since we are changing values from hex to bytes and is no longer a interface Item
    const ui: schema.IUpdateItem = {
      itemId: update.id,
    };
    if (update.basePrice) {
      ui.basePrice = { raw: priceToUint256(update.basePrice) };
    }
    if (update.baseInfo) {
      ui.baseInfo = update.baseInfo;
    }
    if (update.viewState) {
      ui.viewState = update.viewState;
    }
    const eventId = await this.client.updateListing(ui);
    // resolves after the `updateListing` event has been fired, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Item>(eventId, this, "update");
  }

  async addItemToTag(tagId: BigInt, itemId: BigInt) {
    const eventId = await this.client.updateTag({
      id: tagId,
      addListingIds: [itemId],
    });
    return eventListenAndResolve<Item>(eventId, this, "addItemId");
  }

  async removeItemFromTag(tagId: BigInt, itemId: BigInt) {
    const eventId = await this.client.updateTag({
      id: tagId,
      removeListingIds: [itemId],
    });
    return eventListenAndResolve<Item>(eventId, this, "removeItemId");
  }

  async changeInventory(itemIds: BigInt[], diffs: number[]) {
    const eventId = await this.client.changeInventory({
      itemIds: itemIds.map((id) => id),
      diffs,
    });
    return eventListenAndResolve<Item>(eventId, this, "changeInventory");
  }
  get(key: BigInt) {
    return this.store.get(key);
  }
}

class ShopManifestManager extends PublicObjectManager<ShopManifest> {
  constructor(store: Store<ShopManifest>, client: IRelayClient) {
    super(store, client);
  }
  //Process all manifest events. Convert bytes to hex, wait for database update, then emit event name
  async _processEvent(event: schema.ShopEvents) {
    if (event.manifest) {
      const sm = event.manifest;
      const manifest = {
        tokenId: sm.tokenId.raw,
        acceptedCurrencies: [],
        baseCurrency: {},
        payees: [],
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
      if (sm.baseCurrency) {
        manifest.baseCurrency = {
          chainId: Number(sm.baseCurrency.chainId),
          address: bytesToHex(sm.baseCurrency.address.raw),
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
      await this.store.put("shopManifest", manifest);
      this.emit("create", manifest, sm.eventId);
      return;
    } else if (event.updateManifest) {
      const um = event.updateManifest;
      const manifest = await this.store.get("shopManifest");
      if (um.setBaseCurrency) {
        manifest.baseCurrency = {
          chainId: Number(um.setBaseCurrency.chainId),
          address: bytesToHex(um.setBaseCurrency.address.raw),
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
            (cur) => cur.address !== bytesToHex(rm.address.raw),
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
      await this.store.put("shopManifest", manifest);
      this.emit("update", manifest, um.eventId);

      return;
    }
  }
  async create(manifest: CreateShopManifest, shopId: `0x${string}`) {
    const eventId = await this.client.shopManifest(manifest, shopId);
    // resolves after the `createShopManifest` event has been fired above in _processEvent, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<ShopManifest>(eventId, this, "create");
  }

  async update(um: Partial<ShopManifest> & UpdateShopManifest) {
    //Convert address to bytes before sending to client.
    //We have to explicitly declare the update object as type schema.IUpdateShopManifest since we are changing hex to bytes and is no longer a type ShopManifest
    const updateShopManifest: schema.IUpdateShopManifest = um;
    for (const [key, _] of Object.entries(updateShopManifest)) {
      if (
        key === "addAcceptedCurrencies" ||
        key === "removeAcceptedCurrencies"
      ) {
        updateShopManifest[key] = updateShopManifest[key].map(
          (a: ShopCurrencies) => {
            return {
              chainId: a.chainId,
              address: { raw: hexToBytes(a.address) },
            };
          },
        );
      } else if (key === "setBaseCurrency") {
        updateShopManifest[key] = {
          address: { raw: hexToBytes(updateShopManifest[key].address) },
          chainId: updateShopManifest[key].chainId,
        };
      } else if (key === "addPayee") {
        updateShopManifest[key].address = hexToBytes(
          updateShopManifest[key].address,
        );
      } else if (key === "removePayee") {
        updateShopManifest[key].address = hexToBytes(
          updateShopManifest[key].address,
        );
      }
    }
    // resolves after the `updateShopManifest` event has been fired above in _processEvent, which happens after the relay accepts the update and has written to the database.
    const eventId = await this.client.updateShopManifest(updateShopManifest);
    return eventListenAndResolve<ShopManifest>(eventId, this, "update");
  }

  get() {
    return this.store.get("shopManifest");
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
      const { id } = co;
      const o = {
        id,
        items: {},
        status: OrderState.STATE_OPEN,
      };
      await this.store.put(id, o);
      await storeOrdersByStatus(id, this.store, OrderState.STATE_OPEN);
      this.emit("create", o, co.eventId);
      return;
    } else if (event.updateOrder) {
      const uo: schema.IUpdateOrder = event.updateOrder;
      const { id } = uo;
      const order = (await this.store.get(id)) as Order;
      if (uo.changeItems) {
        const ci = uo.changeItems;
        if (ci.adds) {
          ci.adds.map((orderItem: schema.IOrderedItem) => {
            order.items[orderItem.listingId] = orderItem.quantity;
          });
        }
        if (ci.removes) {
          ci.removes.map((orderItem: schema.IOrderedItem) => {
            order.items[orderItem.listingId] = orderItem.quantity;
          });
        }
        await this.store.put(id, order);
        this.emit("changeItems", order, uo.eventId);
        return;
      } else if (uo.paymentDetails) {
        this.emit("paymentDetails", order, uo.eventId);
      } else if (uo.itemsFinalized) {
        //Converting all Uint8Array values to hex before saving to store.
        const fo = {
          orderHash: bytesToHex(uo.itemsFinalized.orderHash),
          currencyAddr: bytesToHex(uo.itemsFinalized.currencyAddr),
          totalInCrypto: bytesToHex(uo.itemsFinalized.totalInCrypto),
          ttl: uo.itemsFinalized.ttl,
          payeeAddr: bytesToHex(uo.itemsFinalized.payeeAddr),
          shopSignature: bytesToHex(uo.itemsFinalized.shopSignature),
          total: uo.itemsFinalized.total,
          eventId: uo.eventId,
        };
        order.orderFinalized = fo;
        await this.store.put(id, order);
        this.emit("itemsFinalized", order, uo.eventId);
        return;
      } else if (uo.canceled) {
        order.status = OrderState.STATE_CANCELED;
        await this.store.put(id, order);
        await storeOrdersByStatus(id, this.store, OrderState.STATE_CANCELED);
        this.emit("orderCanceled", order, uo.eventId);
        return;
      } else if (uo.invoiceAddress) {
        const update = uo.invoiceAddress;
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
        order.shippingDetails = sd;
        await this.store.put(id, order);
        this.emit("invoiceAddress", order, uo.eventId);
        return;
      } else if (uo.commit) {
        order.status = OrderState.STATE_COMMITED;
        await this.store.put(id, order);
        await storeOrdersByStatus(id, this.store, OrderState.STATE_COMMITED);
        this.emit("orderCommit", order, uo.eventId);
        return;
      } else if (uo.paid) {
        const currentState = order.status;
        order.status = OrderState.STATE_PAID;
        order.txHash = bytesToHex(uo.paid.txHash.raw);
        await this.store.put(id, order);
        await storeOrdersByStatus(id, this.store, OrderState.STATE_PAID);
        //remove the orderId from state of orders before this event.
        let orders = (await this.store.get(currentState)) as OrdersByStatus;
        orders = orders.filter((oId) => oId !== id);
        await this.store.put(OrderState.STATE_OPEN, orders);
        this.emit("orderPaid", order);
        return;
      }
    }
  }

  get(key: BigInt) {
    return this.store.get(key) as Promise<Order>;
  }

  async getStatus(key: OrderState): Promise<BigInt[]> {
    try {
      return (await this.store.get(key)) as BigInt[];
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
    const eventId = await this.client.createOrder();
    // resolves after the `createOrder` event has been fired in processEvent, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Order>(eventId, this, "create");
  }

  async changeItems(orderId: BigInt, itemId: BigInt, quantity: number) {
    const eventId = await this.client.updateOrder({
      id: orderId,
      changeItems: { itemId, quantity },
    });
    // resolves after the `changeItems` event has been fired, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Order>(eventId, this, "changeItems");
  }
  async updateShippingDetails(
    orderId: BigInt,
    update: Partial<ShippingDetails>,
  ) {
    const eventId = await this.client.updateOrder({
      orderId,
      updateShippingDetails: update,
    });
    return eventListenAndResolve<Order>(eventId, this, "updateShippingDetails");
  }

  async cancel(orderId: BigInt, timestamp: number) {
    const eventId = await this.client.updateOrder({
      orderId,
      orderCanceled: { timestamp },
    });
    return eventListenAndResolve<Order>(eventId, this, "orderCanceled");
  }

  async commit(
    orderId: BigInt,
    addr: `0x${string}`,
    chainId: number,
    payee: Payee,
  ) {
    //Currently, this is a network request only.
    //This will trigger an updateOrder event from the relay, with a itemsFinalized property.
    return this.client.commitOrder(
      {
        currency: {
          address: { raw: hexToBytes(addr) },
          chainId,
        },
        payee,
      },
      orderId,
    );
  }
}
class TagManager extends PublicObjectManager<Tag> {
  constructor(store: Store<Tag>, client: IRelayClient) {
    super(store, client);
  }

  async _processEvent(event: schema.ShopEvents): Promise<void> {
    if (event.tag) {
      const ct = event.tag;
      const { id } = ct;
      const tag = {
        id,
        name: ct.name,
      };
      await this.store.put(id, tag);
      this.emit("create", tag, ct.eventId);
      return;
    }
  }
  async create(name: string) {
    const eventId = await this.client.tag({ name });
    // resolves after the `tag` event has been fired, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Tag>(eventId, this, "create");
  }

  get(key: BigInt) {
    return this.store.get(key);
  }
}

class KeyCardManager extends PublicObjectManager<KeyCard> {
  constructor(store: Store<KeyCard>, client: IRelayClient) {
    super(store, client);
  }

  async _processEvent(event: schema.ShopEvents): Promise<void> {
    if (event.account) {
      //storing WA and KC pair
      const a = event.account;
      const userWalletAddr = bytesToHex(a.enrollKeycard.userWallet.raw);
      const cardPublicKey = bytesToHex(a.enrollKeycard.keycardPubkey.raw);
      await this.store.put(cardPublicKey, userWalletAddr);
      this.emit("newKeyCard", cardPublicKey);
      return;
    }
  }

  get(key: `0x${string}`) {
    return this.store.get(key);
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
  eventStreamProcessing;
  constructor(
    public client: IRelayClient,
    listingStore: Store<Item>,
    tagStore: Store<Tag>,
    shopManifestStore: Store<ShopManifest>,
    orderStore: Store<Order | OrdersByStatus>,
    keycardStore: Store<KeyCard>,
  ) {
    this.items = new ListingManager(listingStore, client);
    this.tags = new TagManager(tagStore, client);
    this.manifest = new ShopManifestManager(shopManifestStore, client);
    this.orders = new OrderManager(orderStore, client);
    this.keycards = new KeyCardManager(keycardStore, client);
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
    //Each event will go through all the storeObjects and update the relevant stores.
    for await (const event of stream) {
      for (const storeObject of storeObjects) {
        await storeObject._processEvent(event.event);
      }
    }
  }
}
