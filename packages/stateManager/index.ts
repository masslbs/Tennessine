import { EventEmitter } from "events";
import schema from "@massmarket/schema";
import { bytesToHex, hexToBytes, PublicClient } from "viem";
import { bufferToJSON, stringifyToBuffer } from "@massmarket/utils";
import {
  IRelayClient,
  Item,
  Tag,
  KeyCard,
  ShippingDetails,
  Status,
  Order,
  ShopCurrencies,
  ShopManifest,
  CreateShopManifest,
  UpdateShopManifest,
  ShopObjectTypes,
  IError,
  OrdersByStatus,
} from "./types";
import { Address } from "@ethereumjs/util";
import * as abi from "@massmarket/contracts";

// This is an interface that is used to retrieve and store objects from a persistant layer
export type Store<T extends ShopObjectTypes> = {
  put(key: string, value: T): Promise<void>;
  get(key: string): Promise<T>;
  iterator(): AsyncIterable<[string, T]>;
};

// Given an eventId which is the returned value of the network event
// This returns a promise that resolves once the event has been emitted as js event
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
async function storeOrdersByStatus(
  orderId: `0x${string}`,
  store: Store<Order | OrdersByStatus>,
  status: Status,
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
  abstract get(key?: string): Promise<T>;
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
        this.emit(
          "changeStock",
          cs.itemIds.map((id: Uint8Array) => bytesToHex(id)),
          cs.eventId,
        );
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
      } else if (ut.removeItemId) {
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

  async addItemToTag(tagId: `0x${string}`, itemId: `0x${string}`) {
    const eventId = await this.client.updateTag({
      tagId: hexToBytes(tagId),
      addItemId: hexToBytes(itemId),
    });
    return eventListenAndResolve<Item>(eventId, this, "addItemId");
  }

  async removeItemFromTag(tagId: `0x${string}`, itemId: `0x${string}`) {
    const eventId = await this.client.updateTag({
      tagId: hexToBytes(tagId),
      removeItemId: hexToBytes(itemId),
    });
    return eventListenAndResolve<Item>(eventId, this, "removeItemId");
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
  constructor(store: Store<ShopManifest>, client: IRelayClient) {
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
        acceptedCurrencies: [],
        setBaseCurrency: null,
        payee: [],
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
        const currencies = [...manifest.acceptedCurrencies];
        um.addAcceptedCurrencies.forEach((a: schema.IShopCurrency) => {
          currencies.push({
            tokenAddr: bytesToHex(a.tokenAddr),
            chainId: Number(a.chainId),
          });
        });
        manifest.acceptedCurrencies = currencies;
      }
      if (um.removeAcceptedCurrencies) {
        let filtered = [...manifest.acceptedCurrencies!];
        for (const rm of um.removeAcceptedCurrencies) {
          filtered = manifest.acceptedCurrencies!.filter(
            (cur) => cur.tokenAddr !== bytesToHex(rm.tokenAddr),
          );
        }
        manifest.acceptedCurrencies = filtered;
      }
      if (um.addPayee) {
        manifest.payee.push({
          ...um.addPayee,
          addr: bytesToHex(um.addPayee.addr),
        });
      }
      if (um.removePayee) {
        manifest.payee = manifest.payee.filter(
          (p) => p.addr !== bytesToHex(um.removePayee.addr),
        );
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

  async update(um: Partial<ShopManifest> & UpdateShopManifest) {
    //Convert tokenAddr and publishedTagId to bytes before sending to client.
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
      } else if (key === "addPayee") {
        updateShopManifest[key].addr = hexToBytes(updateShopManifest[key].addr);
      } else if (key === "removePayee") {
        updateShopManifest[key].addr = hexToBytes(updateShopManifest[key].addr);
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
      const id = bytesToHex(co.eventId!);
      const o = {
        id,
        items: {},
        status: Status.Pending,
      };
      await this.store.put(id, o);
      await storeOrdersByStatus(id, this.store, Status.Pending);

      this.emit("create", o, co.eventId);
      return;
    } else if (event.updateOrder) {
      const uo: schema.IUpdateOrder = event.updateOrder;
      const orderId = bytesToHex(uo.orderId);
      const order = (await this.store.get(orderId)) as Order;

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
        await storeOrdersByStatus(orderId, this.store, Status.Failed);
        this.emit("orderCanceled", order, uo.eventId);
        return;
      } else if (uo.updateShippingDetails) {
        const update = uo.updateShippingDetails;
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
        await this.store.put(orderId, order);
        this.emit("updateShippingDetails", order, uo.eventId);
        return;
      }
    } else if (event.changeStock) {
      const cs = event.changeStock;
      if (cs.txHash && cs.orderId.byteLength) {
        const orderId = bytesToHex(cs.orderId);
        const order = (await this.store.get(orderId)) as Order;
        order.status = Status.Complete;
        order.txHash = bytesToHex(cs.txHash);
        await this.store.put(orderId, order);
        await storeOrdersByStatus(orderId, this.store, Status.Complete);
        //remove the orderId from pending orders since its status is now complete
        let orders = (await this.store.get(Status.Pending)) as OrdersByStatus;
        orders = orders.filter((id) => id !== orderId);
        await this.store.put(Status.Pending, orders);
        this.emit("orderPaid", order);
        return;
      }
    }
  }

  get(key: `0x${string}`) {
    return this.store.get(key) as Promise<Order>;
  }

  async getStatus(key: Status): Promise<`0x${string}`[]> {
    try {
      return (await this.store.get(key)) as `0x${string}`[];
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
    //Currently, this is a network request only.
    //This will trigger an updateOrder event from the relay, with a itemsFinalized property.
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
  constructor(store: Store<Tag>, client: IRelayClient) {
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
  constructor(store: Store<KeyCard>, client: IRelayClient) {
    super(store, client);
  }

  async _processEvent(event: schema.ShopEvents): Promise<void> {
    if (event.newKeyCard) {
      //storing WA and KC pair
      const kc = event.newKeyCard;
      const userWalletAddr = bytesToHex(kc.userWalletAddr!);
      //Returns hex encoding of address.
      const addressFromPubKey = Address.fromPublicKey(
        kc.cardPublicKey,
      ).toString();
      await this.store.put(addressFromPubKey, userWalletAddr);
      this.emit("newKeyCard", addressFromPubKey);
      return;
    }
  }

  get(key: `0x${string}`) {
    return this.store.get(key);
  }
  addAddress(key: `0x${string}`) {
    const k = key.toLowerCase();
    return this.store.put(k, key);
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
    shopManifestStore: Store<ShopManifest>,
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
      await this.keycards.get(event.signer.toLowerCase());
      for (const storeObject of storeObjects) {
        await storeObject._processEvent(event.event);
      }
    }
  }
}
