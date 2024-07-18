import { EventEmitter } from "events";
import { RelayClient } from "@massmarket/client";
import schema from "@massmarket/schema";
import { bytesToHex, hexToBytes } from "viem";

interface Item {
  id?: `0x${string}`;
  price: string;
  metadata: {
    name: string;
    description: string;
    image: string;
  };
}

interface Tag {
  id?: `0x${string}`;
  name: string;
  listings: `0x${string}`[];
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
  id?: `0x${string}`;
  items: { [key: `0x${string}`]: number };
  status: Status;
  txHash?: string;
  orderFinalized:
    | {
        orderHash: Uint8Array;
        currencyAddr: Uint8Array;
        totalInCrypto: Uint8Array;
        ttl: string;
        payeeAddr: Uint8Array;
        shopSignature: Uint8Array;
        total: string;
      }
    | false;
}

type ShopDetail = string;

type ShopObjectTypes = Item | Tag | KeyCards | Order | ShopDetail;

// This is an interface that is used to retrieve and store objects from a persistant layer
type Store<T extends ShopObjectTypes> = {
  put(key: string, value: T): Promise<void>;
  get(key: string): Promise<T>;
  delete(key: string): Promise<void>;
  iterator(): {
    all(): T[];
  };
  batch(
    arg: {
      type: "put";
      key: string;
      value: T;
    }[],
  ): Promise<void>;
};

abstract class PublicObjectManager<
  T extends ShopObjectTypes,
> extends EventEmitter {
  constructor(
    protected db: Store<T>,
    protected client: RelayClient,
  ) {
    super();
  }
  abstract _processEvent(event: schema.ShopEvents): Promise<boolean>;
  abstract get(key: string): Promise<T>;
  abstract getAll(): T[];
}

class ListingManager extends PublicObjectManager<Item> {
  constructor(db: Store<Item>, client: RelayClient) {
    super(db, client);
  }
  // Process the events; if the event modifies one the shops items this updates the store and emits an event
  // returns a bool to indicate whether the event was processed or not
  async _processEvent(event: schema.ShopEvents): Promise<boolean> {
    if (event.createItem) {
      const ci = event.createItem;
      const metadata = JSON.parse(new TextDecoder().decode(ci.metadata));
      const id = bytesToHex(ci.eventId);
      const item = {
        price: ci.price,
        metadata,
      };
      await this.db.put(id, item);
      return true;
    } else if (event.updateItem) {
      const ui = event.updateItem;
      const id = bytesToHex(ui.itemId);
      const item = await this.db.get(id);
      if (ui.metadata) {
        item.metadata = JSON.parse(new TextDecoder().decode(ui.metadata));
      }
      if (ui.price) {
        item.price = ui.price;
      }
      await this.db.put(id, item);
      return true;
    } else if (event.changeStock) {
      const cs = event.changeStock;
      if (cs.itemIds) {
        cs.itemIds.map(async (id: Uint8Array) => {
          const itemId = bytesToHex(id);
          const item = await this.db.get(itemId);
          await this.db.put(itemId, item);
        });
      }
      //can't return true here yet because changeStock event has to go through orderStore as well.
    }
    return false;
  }

  async create(item: Item) {
    const id = bytesToHex(
      await this.client.createItem({
        price: item.price,
        metadata: new TextEncoder().encode(JSON.stringify(item.metadata)),
      }),
    );
    await this.db.put(id, item);
  }

  async update(
    itemId: `0x${string}`,
    price?: string,
    metadata?: { name: string; description: string; image: string },
  ) {
    const item = await this.db.get(itemId);
    if (price) {
      item.price = price;
      await this.client.updateItem({ itemId: hexToBytes(itemId), price });
    }
    if (metadata) {
      item.metadata = metadata;
      await this.client.updateItem({
        itemId: hexToBytes(itemId),
        metadata: new TextEncoder().encode(JSON.stringify(metadata)),
      });
    }

    await this.db.put(itemId, item);
  }

  getAll() {
    return this.db.iterator().all();
  }

  get(key: `0x${string}`) {
    return this.db.get(key);
  }
}

class ShopDetailsManager extends PublicObjectManager<ShopDetail> {
  constructor(db: Store<ShopDetail>, client: RelayClient) {
    super(db, client);
  }

  async _processEvent(event: schema.ShopEvents): Promise<boolean> {
    if (event.shopManifest) {
      const sm = event.shopManifest;
      await this.db.batch([
        { type: "put", key: "name", value: sm.name },
        { type: "put", key: "profilePictureUrl", value: sm.profilePictureUrl },
        {
          type: "put",
          key: "publishedTagId",
          value: bytesToHex(sm.publishedTagId),
        },
      ]);
      return true;
    } else if (event.updateShopManifest) {
      const um = event.updateShopManifest;
      if (um.name) {
        await this.db.put(`name`, um.name);
      }
      if (um.profilePictureUrl) {
        await this.db.put(`profilePictureUrl`, um.profilePictureUrl);
      }
      if (um.publishedTagId) {
        await this.db.put(`publishedTagId`, bytesToHex(um.publishedTagId));
      }
      if (um.setBaseCurrency) {
        await this.db.put(
          `baseCurrencyAddr`,
          bytesToHex(um.setBaseCurrency.tokenAddr),
        );
      }
      if (um.addAcceptedCurrency) {
        await this.db.put(
          `addAcceptedCurrency`,
          bytesToHex(um.addAcceptedCurrency.tokenAddr),
        );
      }

      return true;
    }
    return false;
  }

  getAll() {
    return this.db.iterator().all();
  }

  get(
    key:
      | "name"
      | "profilePictureUrl"
      | "publishedTagId"
      | "baseCurrencyAddr"
      | "addAcceptedCurrency",
  ) {
    return this.db.get(key);
  }
}
class OrderManager extends PublicObjectManager<Order> {
  constructor(db: Store<Order>, client: RelayClient) {
    super(db, client);
  }

  async _processEvent(event: schema.ShopEvents): Promise<boolean> {
    if (event.updateOrder) {
      const uo = event.updateOrder;
      const orderId = bytesToHex(uo.orderId);

      if (uo.changeItems) {
        const ci = uo.changeItems;
        const itemId = bytesToHex(ci.itemId);
        const order = await this.db.get(orderId);
        const quantity = ci.quantity;
        if (quantity === 0) {
          await this.db.delete(orderId);
        } else {
          order.items[itemId] = quantity;
          await this.db.put(orderId, order);
        }
      }
      if (uo.itemsFinalized) {
        const eventId = bytesToHex(uo.eventId);
        const order = await this.db.get(eventId);
        order.orderFinalized = uo.itemsFinalized;
        await this.db.put(eventId, order);
      }
      return true;
    } else if (event.changeStock) {
      const cs = event.changeStock;
      if (cs.orderId.byteLength && cs.txHash) {
        const orderId = bytesToHex(cs.orderId);
        const order = await this.db.get(orderId);
        order.status = Status.Complete;
        order.txHash = bytesToHex(cs.txHash);
        await this.db.put(orderId, order);
        return true;
      }
      return false;
    }
    return false;
  }
  getAll() {
    return this.db.iterator().all();
  }

  get(key: `0x${string}`) {
    return this.db.get(key);
  }
}
class TagManager extends PublicObjectManager<Tag> {
  constructor(db: Store<Tag>, client: RelayClient) {
    super(db, client);
  }

  async _processEvent(event: schema.ShopEvents): Promise<boolean> {
    if (event.createTag) {
      const ct = event.createTag;
      await this.db.put(bytesToHex(ct.eventId), {
        name: ct.name,
        listings: [],
      });
      return true;
    } else if (event.updateTag) {
      const ut = event.updateTag;
      const tagId = bytesToHex(ut.tagId);

      if (ut.addItemId) {
        const itemId = bytesToHex(ut.addItemId);
        const tag = await this.db.get(tagId);
        tag.listings = [...tag.listings, itemId];
        await this.db.put(tagId, tag);
      }
      if (ut.removeItemId) {
        const itemId = bytesToHex(ut.removeItemId);
        const tag = await this.db.get(tagId);
        tag.listings = [
          ...tag.listings.filter((pId: `0x${string}`) => pId !== itemId),
        ];
        await this.db.put(tagId, tag);
      }
      return true;
    }
    return false;
  }
  async create(name: string) {
    const id = bytesToHex(await this.client.createTag({ name }));
    await this.db.put(id, { name, listings: [] });
  }

  getAll() {
    return this.db.iterator().all();
  }

  get(key: `0x${string}`) {
    return this.db.get(key);
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
    shopDetailStore: Store<ShopDetail>,
    orderStore: Store<Order>,
  ) {
    this.items = new ListingManager(listingStore, client);
    this.tags = new TagManager(tagStore, client);
    this.shopDetails = new ShopDetailsManager(shopDetailStore, client);
    this.orders = new OrderManager(orderStore, client);
    this.#start();
  }

  async #start() {
    const storeObjects = [this.items, this.tags, this.shopDetails, this.orders];
    const stream = this.client.createEventStream();
    for await (const event of stream) {
      for (const storeObject of storeObjects) {
        if (await storeObject._processEvent(event.event)) {
          break;
        }
      }
    }
  }
}
