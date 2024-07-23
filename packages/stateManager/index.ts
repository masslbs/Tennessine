import { EventEmitter } from "events";
import { RelayClient } from "@massmarket/client";
import schema from "@massmarket/schema";
import { bytesToHex, hexToBytes } from "viem";
import { bufferToJSON } from "@massmarket/utils";
interface Item {
  id: `0x${string}`;
  price: string;
  metadata: {
    name: string;
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

interface KeyCards {
  publicKey: `0x${string}`;
}
enum Status {
  Failed = "FAILED",
  Pending = "PENDING",
  Complete = "COMPLETE",
}
interface Order {
  id: `0x${string}`;
  items: { [key: `0x${string}`]: number };
  status: Status;
  txHash?: string;
  orderFinalized:
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
interface IShopManifest {
  name: string;
  description: string;
}
interface UpdateShopManifest extends Partial<IShopManifest> {
  setBaseCurrency?: {
    tokenAddr: `0x${string}`;
    chainId: number;
  };
  addAcceptedCurrency?: {
    tokenAddr: `0x${string}`;
    chainId: number;
  };
  addPayee?: {
    addr: `0x${string}`;
    callAsContract: boolean;
    chainId: number;
    name: string;
  };
  publishedTagId?: `0x${string}`;
  profilePictureUrl?: string;
}

type ShopObjectTypes =
  | Item
  | Tag
  | KeyCards
  | Order
  | (IShopManifest & UpdateShopManifest);

// This is an interface that is used to retrieve and store objects from a persistant layer
type Store<T extends ShopObjectTypes> = {
  put(key: string, value: T): Promise<void>;
  get(key: string): Promise<T>;
  iterator: {
    (options?: any): Iterator<string, ShopObjectTypes>;
  };
};

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
  abstract get(key: string): Promise<T>;
  get iterator() {
    return this.store.iterator;
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
      return this.store.put(id, item);
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
    } else if (event.changeStock) {
      const cs = event.changeStock;
      if (cs.itemIds) {
        cs.itemIds.forEach(async (id: Uint8Array, i: number) => {
          const itemId = bytesToHex(id);
          const item = await this.store.get(itemId);
          const diff = cs.diffs ? cs.diffs[i] : 0;
          item.quantity = item.quantity + diff;
          return this.store.put(itemId, item);
        });
      }
    } else if (event.updateTag) {
      // Add or remove tagId to item
      const ut = event.updateTag;
      const tagId = bytesToHex(ut.tagId);

      if (ut.addItemId) {
        const itemId = bytesToHex(ut.addItemId);
        const item = await this.store.get(itemId);
        item.tags.push(tagId);
        return this.store.put(itemId, item);
      }
      if (ut.removeItemId) {
        const itemId = bytesToHex(ut.removeItemId);
        const item = await this.store.get(itemId);
        // remove `tagId` from item.tags array
        item.tags = [...item.tags.filter((id: `0x${string}`) => id !== tagId)];
        return this.store.put(itemId, item);
      }
    }
  }

  async create(item: Item) {
    const id = bytesToHex(
      await this.client.createItem({
        price: item.price,
        metadata: new TextEncoder().encode(JSON.stringify(item.metadata)),
      }),
    );
    return this.store.put(id, item);
  }
  //update argument passed here will only contain the fields to update.
  async update(update: Partial<Item>) {
    //ui object to be passed to the network with converted network data types
    const ui: schema.IUpdateItem = {
      itemId: hexToBytes(update.id!),
    };
    if (update.price) {
      ui.price = update.price;
    }
    if (update.metadata) {
      ui.metadata = new TextEncoder().encode(JSON.stringify(update.metadata));
    }
    const p1 = this.client.updateItem(ui);
    const p2 = async () => {
      //Get the full item, update the new fields, and save to listings store
      const item = await this.store.get(update.id!);
      if (update.price) {
        item.price = update.price;
      }
      if (update.metadata) {
        item.metadata = update.metadata;
      }
      if (update.quantity) {
        const diff = update.quantity - item.quantity;
        await this.client.changeStock({
          itemIds: [hexToBytes(update.id!)],
          diffs: [diff],
        });
        item.quantity = update.quantity;
      }
      return item;
    };

    const [_, item] = await Promise.all([p1, p2()]);
    return this.store.put(update.id!, item);
  }

  get(key: `0x${string}`) {
    return this.store.get(key);
  }
}

class ShopManifest extends PublicObjectManager<
  IShopManifest & UpdateShopManifest
> {
  constructor(
    store: Store<IShopManifest & UpdateShopManifest>,
    client: RelayClient,
  ) {
    super(store, client);
  }
  //Process all manifest events. Convert bytes to hex and save to shop store
  async _processEvent(event: schema.ShopEvents): Promise<void> {
    if (event.shopManifest) {
      const sm = event.shopManifest;
      const manifest = {
        name: sm.name,
        profilePictureUrl: sm.profilePictureUrl,
        publishedTagId: bytesToHex(sm.publishedTagId),
        description: sm.description,
      };
      return this.store.put("shopManifest", manifest);
    } else if (event.updateShopManifest) {
      const um = event.updateShopManifest;
      const manifest = await this.store.get("shopManifest");
      if (um.name) {
        manifest.name = um.name;
      }
      if (um.profilePictureUrl) {
        manifest.profilePictureUrl = um.profilePictureUrl;
      }
      if (um.publishedTagId) {
        manifest.publishedTagId = bytesToHex(um.publishedTagId);
      }
      if (um.setBaseCurrency) {
        manifest.setBaseCurrency = {
          tokenAddr: bytesToHex(um.setBaseCurrency.tokenAddr),
          chainId: um.chainId,
        };
      }
      if (um.addAcceptedCurrency) {
        manifest.addAcceptedCurrency = {
          tokenAddr: bytesToHex(um.addAcceptedCurrency.tokenAddr),
          chainId: um.chainId,
        };
      }
      return this.store.put("shopManifest", manifest);
    }
  }
  async create(manifest: IShopManifest, shopId: `0x${string}`) {
    //FIXME publishedTagId & profilePictureUrl are currently a required fields for ShopManifest
    const sm = {
      ...manifest,
      publishedTagId: new Uint8Array(32),
      profilePictureUrl: "https://http.cat/images/200.jpg",
    };
    await this.client.shopManifest(sm, shopId);
    return this.store.put("shopManifest", manifest);
  }

  async update(um: UpdateShopManifest) {
    const manifest = await this.store.get("shopManifest");

    if (um.name) {
      manifest.name = um.name;
    }
    if (um.profilePictureUrl) {
      manifest.profilePictureUrl = um.profilePictureUrl;
    }
    if (um.publishedTagId) {
      manifest.publishedTagId = um.publishedTagId;
    }
    if (um.setBaseCurrency) {
      manifest.setBaseCurrency = {
        tokenAddr: um.setBaseCurrency.tokenAddr,
        chainId: um.setBaseCurrency.chainId,
      };
    }
    if (um.addAcceptedCurrency) {
      manifest.addAcceptedCurrency = {
        tokenAddr: um.addAcceptedCurrency.tokenAddr,
        chainId: um.addAcceptedCurrency.chainId,
      };
    }
    //Convert tokenAddr and publishedTagId to bytes before sending to client.
    const update: schema.IUpdateShopManifest = { ...manifest };
    for (const [key, value] of Object.entries(update)) {
      if (key === "addAcceptedCurrency" || key === "setBaseCurrency") {
        update[key] = {
          ...update[key],
          tokenAddr: hexToBytes(update[key].tokenAddr),
        };
      } else if (key === "publishedTagId") {
        update[key] = hexToBytes(update.publishedTagId);
      }
    }
    await this.client.updateShopManifest(update);
    return this.store.put("shopManifest", manifest);
  }

  get(key: string) {
    return this.store.get(key);
  }
}
class OrderManager extends PublicObjectManager<Order> {
  constructor(store: Store<Order>, client: RelayClient) {
    super(store, client);
  }
  //Process all Order events. Convert bytes to hex and save to order store
  async _processEvent(event: schema.ShopEvents): Promise<void> {
    if (event.updateOrder) {
      const uo: schema.IUpdateOrder = event.updateOrder;
      const orderId = bytesToHex(uo.orderId);

      if (uo.changeItems) {
        const ci = uo.changeItems;
        const itemId = bytesToHex(ci.itemId);
        const order = await this.store.get(orderId);
        const quantity = ci.quantity;
        if (quantity === 0) {
          delete order.items[itemId];
        } else {
          order.items[itemId] = quantity;
        }
        return this.store.put(orderId, order);
      }
      if (uo.itemsFinalized) {
        const eventId = bytesToHex(uo.eventId);
        const order = await this.store.get(eventId);
        //Converting all Uint8Array values to hex
        const fo = {
          orderHash: bytesToHex(uo.itemsFinalized.orderHash),
          currencyAddr: bytesToHex(uo.itemsFinalized.currencyAddr),
          totalInCrypto: bytesToHex(uo.itemsFinalized.totalInCrypto),
          ttl: uo.itemsFinalized.ttl,
          payeeAddr: bytesToHex(uo.itemsFinalized.payeeAddr),
          shopSignature: bytesToHex(uo.itemsFinalized.shopSignature),
          total: uo.itemsFinalized.total,
        };
        order.orderFinalized = fo;
        return this.store.put(eventId, order);
      }
      if (uo.orderCanceled) {
        const order = await this.store.get(orderId);
        order.status = Status.Failed;
        return this.store.put(orderId, order);
      }
    } else if (event.changeStock) {
      const cs = event.changeStock;
      if (cs.orderId.byteLength && cs.txHash) {
        const orderId = bytesToHex(cs.orderId);
        const order = await this.store.get(orderId);
        order.status = Status.Complete;
        order.txHash = bytesToHex(cs.txHash);
        return this.store.put(orderId, order);
      }
    }
  }

  get(key: `0x${string}`) {
    return this.store.get(key);
  }

  async create() {
    return bytesToHex(await this.client.createOrder());
  }
  async update(
    orderId: `0x${string}`,
    itemId: `0x${string}`,
    quantity: number,
  ) {
    await this.client.updateOrder({
      orderId: hexToBytes(orderId),
      changeItems: { itemId: hexToBytes(itemId), quantity },
    });
  }
  async cancel(orderId: `0x${string}`, timestamp: number) {
    await this.client.updateOrder({
      orderI: hexToBytes(orderId),
      orderCanceled: { timestamp },
    });
  }
  async commit(
    orderId: `0x${string}`,
    addr: `0x${string}`,
    chainId: number,
    payeeName: string,
  ) {
    await this.client.commitOrder({
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
      return this.store.put(id, {
        id,
        name: ct.name,
      });
    }
  }
  async create(name: string) {
    const id = bytesToHex(await this.client.createTag({ name }));
    return this.store.put(id, { id, name });
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
  readonly shopDetails;
  readonly orders;

  constructor(
    public client: RelayClient,
    listingStore: Store<Item>,
    tagStore: Store<Tag>,
    shopDetailStore: Store<IShopManifest>,
    orderStore: Store<Order>,
  ) {
    this.items = new ListingManager(listingStore, client);
    this.tags = new TagManager(tagStore, client);
    this.shopDetails = new ShopManifest(shopDetailStore, client);
    this.orders = new OrderManager(orderStore, client);
    this.#start();
  }

  async #start() {
    const storeObjects = [this.items, this.tags, this.shopDetails, this.orders];
    const stream = this.client.createEventStream();
    //Each event will go through all the storeObjects and update the relevant stores.
    for await (const event of stream) {
      for (const storeObject of storeObjects) {
        await storeObject._processEvent(event.event);
      }
    }
  }
}
