import { EventEmitter } from "events";
import { RelayClient } from "@massmarket/client";
import schema from "@massmarket/schema";
import { bytesToHex, hexToBytes } from "viem";
import { bufferToJSON, stringifyToBuffer } from "@massmarket/utils";

/**
 * Define the Store Objects that are reified from the event stream
 */

interface Item {
  id: `0x${string}`;
  price: string;
  metadata: {
    title: string;
    description: string;
    image: string;
  };
  tags: `0x${string}`[];
  quantity: number;
}

interface Tag {
  id: `0x${string}`;
  name: string;
}

type KeyCard = `0x${string}`;
enum Status {
  Failed = "FAILED",
  Pending = "PENDING",
  Complete = "COMPLETE",
}
interface ShippingDetails {
  name: string;
  address1: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}
interface Order {
  id: `0x${string}`;
  items: { [key: `0x${string}`]: number };
  status: Status;
  shippingDetails?: ShippingDetails;
  txHash?: string;
  orderFinalized?:
    | {
        orderHash: string;
        currencyAddr: string;
        totalInCrypto: string;
        ttl: string;
        payeeAddr: string;
        shopSignature: string;
        total: string;
      }
    | false;
}
interface ShopCurrencies {
  tokenAddr: `0x${string}`;
  chainId: number;
}
//This interface is used to type a manifest obj for create, and these fields are required.
interface CreateShopManifest {
  name: string;
  description: string;
}
//This type is used to store and retrieve the manifest from db. All the fields are required in this case.
//Since update fn can take in any number these properties we use Partial<ShopManifest> to type manifest update objects.
type ShopManifest = CreateShopManifest & {
  tokenId: `0x${string}`;
  setBaseCurrency: ShopCurrencies | null;
  addAcceptedCurrencies: ShopCurrencies[];
  addPayee: {
    addr: `0x${string}`;
    callAsContract: boolean;
    chainId: number;
    name: string;
  } | null;
  publishedTagId: `0x${string}`;
  profilePictureUrl: string;
};
type ShopObjectTypes = Item | Tag | KeyCard | Order | ShopManifest;

// This is an interface that is used to retrieve and store objects from a persistant layer
type Store<T extends ShopObjectTypes> = {
  put(key: string, value: T): Promise<void>;
  get(key: string): Promise<T>;
  iterator(): AsyncIterable<[string, T]>;
};

// Given an eventId wich refers to a network event; this returns a promise that resolve once that event
// has been emitted as js event
function eventListenAndResolve<T = ShopObjectTypes>(
  eventId: Uint8Array,
  em: EventEmitter,
  eventName: string,
): Promise<T> {
  return new Promise((resolve, _) => {
    function onUpdate(update: T, eId: Uint8Array) {
      if (bytesToHex(eId) === bytesToHex(eventId)) {
        resolve(update);
        em.removeListener(eventName, onUpdate);
      }
    }
    em.on(eventName, onUpdate);
  });
}

abstract class PublicObjectManager<
  T extends ShopObjectTypes,
> extends EventEmitter {
  constructor(
    protected store: Store<T>,
    protected client: RelayClient,
  ) {
    super();
  }
  abstract _processEvent(event: schema.ShopEvents): Promise<void>;
  abstract get(key?: string): Promise<T>;
  get iterator() {
    return this.store.iterator.bind(this.store);
  }
}
//We should always make sure the network call is successful before updating the store with store.put
class ListingManager extends PublicObjectManager<Item> {
  constructor(store: Store<Item>, client: RelayClient) {
    super(store, client);
  }
  // Process all events for listings.
  // Convert bytes to hex and save item object to listings store.
  async _processEvent(event: schema.ShopEvents): Promise<void> {
    if (event.createItem) {
      const ci = event.createItem;
      const id = bytesToHex(ci.eventId);
      const item = {
        id,
        price: ci.price,
        metadata: bufferToJSON(ci.metadata),
        tags: [],
        quantity: 0,
      };
      await this.store.put(id, item);
      this.emit("create", item, ci.eventId);
      return;
    } else if (event.updateItem) {
      const ui = event.updateItem;
      const id = bytesToHex(ui.itemId);
      const item = await this.store.get(id);
      if (ui.metadata) {
        item.metadata = bufferToJSON(ui.metadata);
      }
      if (ui.price) {
        item.price = ui.price;
      }
      await this.store.put(id, item);
      this.emit("update", item, ui.eventId);
      return;
    } else if (event.changeStock) {
      const cs = event.changeStock;
      if (cs.itemIds) {
        await Promise.all(
          cs.itemIds.map(async (id: Uint8Array, i: number) => {
            const itemId = bytesToHex(id);
            const item = await this.store.get(itemId);
            const diff = cs.diffs ? cs.diffs[i] : 0;
            item.quantity = item.quantity + diff;
            return this.store.put(itemId, item);
          }),
        );
        this.emit("changeStock", cs, cs.eventId);
        return;
      }
    } else if (event.updateTag) {
      // Add or remove tagId to item
      const ut = event.updateTag;
      const tagId = bytesToHex(ut.tagId);

      if (ut.addItemId) {
        const itemId = bytesToHex(ut.addItemId);
        const item = await this.store.get(itemId);
        item.tags.push(tagId);
        await this.store.put(itemId, item);
        this.emit("addItemId", item, ut.eventId);
        return;
      }
      if (ut.removeItemId) {
        const itemId = bytesToHex(ut.removeItemId);
        const item = await this.store.get(itemId);
        // remove `tagId` from item.tags array
        item.tags = [...item.tags.filter((id: `0x${string}`) => id !== tagId)];
        await this.store.put(itemId, item);
        this.emit("removeItemId", item, ut.eventId);
        return;
      }
    }
  }

  async create(item: Partial<Item>) {
    const eventId = await this.client.createItem({
      price: item.price,
      metadata: stringifyToBuffer(item.metadata),
    });
    // resolves after the `createItem` event has been fired in _processEvent, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Item>(eventId, this, "create");
  }
  //update argument passed here will only contain the fields to update.
  async update(update: Partial<Item>) {
    //ui object to be passed to the network with converted network data types.
    //we are declaring the update object as type schema.IUpdateItem since we are changing values from hex to bytes and is no longer a interface Item
    const ui: schema.IUpdateItem = {
      itemId: hexToBytes(update.id!),
    };
    if (update.price) {
      ui.price = update.price;
    }
    if (update.metadata) {
      ui.metadata = stringifyToBuffer(update.metadata);
    }
    const eventId = await this.client.updateItem(ui);
    // resolves after the `updateItem` event has been fired, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Item>(eventId, this, "update");
  }

  async changeStock(itemIds: `0x${string}`[], diffs: number[]) {
    const eventId = await this.client.changeStock({
      itemIds: itemIds.map((id) => hexToBytes(id)),
      diffs,
    });
    return eventListenAndResolve<Item>(eventId, this, "changeStock");
  }
  get(key: `0x${string}`) {
    return this.store.get(key);
  }
}

class ShopManifestManager extends PublicObjectManager<ShopManifest> {
  constructor(store: Store<ShopManifest>, client: RelayClient) {
    super(store, client);
  }
  //Process all manifest events. Convert bytes to hex, wait for database update, then emit event name
  async _processEvent(event: schema.ShopEvents) {
    if (event.shopManifest) {
      const sm = event.shopManifest;
      const manifest = {
        tokenId: bytesToHex(sm.shopTokenId),
        name: sm.name,
        profilePictureUrl: sm.profilePictureUrl,
        publishedTagId: bytesToHex(sm.publishedTagId),
        description: sm.description,
        addAcceptedCurrencies: [],
        setBaseCurrency: null,
        addPayee: null,
      };
      await this.store.put("shopManifest", manifest);
      this.emit("create", manifest, sm.eventId);
      return;
    } else if (event.updateShopManifest) {
      const um = event.updateShopManifest;
      const manifest = await this.store.get("shopManifest");

      if (um.name) {
        manifest.name = um.name;
      }
      if (um.description) {
        manifest.description = um.description;
      }
      if (um.profilePictureUrl) {
        manifest.profilePictureUrl = um.profilePictureUrl;
      }
      if (um.publishedTagId) {
        manifest.publishedTagId = bytesToHex(um.publishedTagId);
      }
      if (um.setBaseCurrency) {
        manifest.setBaseCurrency = {
          chainId: Number(um.setBaseCurrency.chainId),
          tokenAddr: bytesToHex(um.setBaseCurrency.tokenAddr),
        };
      }
      if (um.addAcceptedCurrencies) {
        const currencies = [...manifest.addAcceptedCurrencies];
        um.addAcceptedCurrencies.forEach((a: schema.IShopCurrency) => {
          currencies.push({
            tokenAddr: bytesToHex(a.tokenAddr),
            chainId: Number(a.chainId),
          });
        });
        manifest.addAcceptedCurrencies = currencies;
      }
      if (um.removeAcceptedCurrencies) {
        let filtered = [...manifest.addAcceptedCurrencies!];
        for (const rm of um.removeAcceptedCurrencies) {
          filtered = manifest.addAcceptedCurrencies!.filter(
            (cur) => cur.tokenAddr !== bytesToHex(rm.tokenAddr),
          );
        }
        manifest.addAcceptedCurrencies = filtered;
      }
      await this.store.put("shopManifest", manifest);
      this.emit("update", manifest, um.eventId);

      return;
    }
  }
  async create(manifest: CreateShopManifest, shopId: `0x${string}`) {
    //FIXME publishedTagId & profilePictureUrl are currently a required fields for ShopManifest
    const eventId = await this.client.shopManifest(
      {
        ...manifest,
        publishedTagId: new Uint8Array(32),
        profilePictureUrl: "https://http.cat/images/200.jpg",
      },
      shopId,
    );
    // resolves after the `createShopManifest` event has been fired above in _processEvent, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<ShopManifest>(eventId, this, "create");
  }

  async update(um: Partial<ShopManifest>) {
    //Convert tokenAddr and publishedTagId to bytes before sending to client.
    //We have to explicitly declare the update object as type schema.IUpdateShopManifest since we are changing hex to bytes and is no longer a type ShopManifest
    const updateShopManifest: schema.IUpdateShopManifest = um;
    for (const [key, _] of Object.entries(updateShopManifest)) {
      if (key === "addAcceptedCurrencies") {
        updateShopManifest[key] = updateShopManifest[key].map(
          (a: ShopCurrencies) => {
            return {
              chainId: a.chainId,
              tokenAddr: hexToBytes(a.tokenAddr),
            };
          },
        );
      } else if (key === "publishedTagId") {
        updateShopManifest[key] = hexToBytes(updateShopManifest.publishedTagId);
      } else if (key === "setBaseCurrency") {
        updateShopManifest[key] = {
          tokenAddr: hexToBytes(updateShopManifest[key].tokenAddr),
          chainId: updateShopManifest[key].chainId,
        };
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
class OrderManager extends PublicObjectManager<Order> {
  constructor(store: Store<Order>, client: RelayClient) {
    super(store, client);
  }
  //Process all Order events. Convert bytes to hex, waits for database update, then emits event
  async _processEvent(event: schema.ShopEvents): Promise<void> {
    if (event.createOrder) {
      const co = event.createOrder;
      const id = bytesToHex(co.eventId!);
      const o = {
        id,
        items: {},
        status: Status.Pending,
      };
      await this.store.put(id, o);
      this.emit("create", o, co.eventId);
      return;
    } else if (event.updateOrder) {
      const uo: schema.IUpdateOrder = event.updateOrder;
      const orderId = bytesToHex(uo.orderId);
      const order = await this.store.get(orderId);

      if (uo.changeItems) {
        const ci = uo.changeItems;
        const itemId = bytesToHex(ci.itemId);
        const quantity = ci.quantity;

        if (quantity === 0) {
          delete order.items[itemId];
        } else {
          order.items[itemId] = quantity;
        }
        await this.store.put(orderId, order);
        this.emit("changeItems", order, uo.eventId);
        return;
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
          eventId: bytesToHex(uo.eventId),
        };
        order.orderFinalized = fo;
        await this.store.put(orderId, order);
        this.emit("itemsFinalized", order, uo.eventId);
        return;
      } else if (uo.orderCanceled) {
        order.status = Status.Failed;
        await this.store.put(orderId, order);
        this.emit("orderCanceled", order, uo.eventId);
        return;
      } else if (uo.updateShippingDetails) {
        const update = uo.updateShippingDetails;
        // shippingDetails may be null. If null, create an initial shipping details object to update.
        const sd = order.shippingDetails
          ? order.shippingDetails
          : {
              name: null,
              address1: null,
              city: null,
              postalCode: null,
              country: null,
              phoneNumber: null,
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
        await this.store.put(orderId, order);
        this.emit("updateShippingDetails", order, uo.eventId);
        return;
      }
    } else if (event.changeStock) {
      const cs = event.changeStock;
      if (cs.txHash && cs.orderId.byteLength) {
        const orderId = bytesToHex(cs.orderId);
        const order = await this.store.get(orderId);
        order.status = Status.Complete;
        order.txHash = bytesToHex(cs.txHash);
        await this.store.put(orderId, order);
        this.emit("orderPaid", order);
        return;
      }
    }
  }

  get(key: `0x${string}`) {
    return this.store.get(key);
  }

  async create() {
    const eventId = await this.client.createOrder();
    // resolves after the `createOrder` event has been fired in processEvent, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Order>(eventId, this, "create");
  }

  async changeItems(
    orderId: `0x${string}`,
    itemId: `0x${string}`,
    quantity: number,
  ) {
    const eventId = await this.client.updateOrder({
      orderId: hexToBytes(orderId),
      changeItems: { itemId: hexToBytes(itemId), quantity },
    });
    // resolves after the `changeItems` event has been fired, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Order>(eventId, this, "changeItems");
  }
  async updateShippingDetails(
    orderId: `0x${string}`,
    update: Partial<ShippingDetails>,
  ) {
    const eventId = await this.client.updateOrder({
      orderId: hexToBytes(orderId),
      updateShippingDetails: update,
    });
    return eventListenAndResolve<Order>(eventId, this, "updateShippingDetails");
  }

  async cancel(orderId: `0x${string}`, timestamp: number) {
    const eventId = await this.client.updateOrder({
      orderId: hexToBytes(orderId),
      orderCanceled: { timestamp },
    });
    return eventListenAndResolve<Order>(eventId, this, "orderCanceled");
  }

  async commit(
    orderId: `0x${string}`,
    addr: `0x${string}`,
    chainId: number,
    payeeName: string,
  ) {
    return this.client.commitOrder({
      orderId: hexToBytes(orderId),
      currency: {
        tokenAddr: hexToBytes(addr),
        chainId,
      },
      payeeName,
    });
  }
}
class TagManager extends PublicObjectManager<Tag> {
  constructor(store: Store<Tag>, client: RelayClient) {
    super(store, client);
  }

  async _processEvent(event: schema.ShopEvents): Promise<void> {
    if (event.createTag) {
      const ct = event.createTag;
      const id = bytesToHex(ct.eventId);
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
    const eventId = await this.client.createTag({ name });
    // resolves after the `createTag` event has been fired, which happens after the relay accepts the update and has written to the database.
    return eventListenAndResolve<Tag>(eventId, this, "create");
  }

  get(key: `0x${string}`) {
    return this.store.get(key);
  }
}

class KeyCardManager extends PublicObjectManager<KeyCard> {
  constructor(store: Store<KeyCard>, client: RelayClient) {
    super(store, client);
  }

  async _processEvent(event: schema.ShopEvents): Promise<void> {
    if (event.newKeyCard) {
      //storing WA and KC pair
      const kc = event.newKeyCard;
      const userWalletAddr = bytesToHex(kc.userWalletAddr!);
      const cardPublicKey = bytesToHex(kc.cardPublicKey!);
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
    public client: RelayClient,
    listingStore: Store<Item>,
    tagStore: Store<Tag>,
    shopManifestStore: Store<ShopManifest>,
    orderStore: Store<Order>,
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
