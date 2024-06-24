import { EventEmitter } from "events";
import { RelayClient } from "@massmarket/client";
import schema from "@massmarket/schema";

interface Item {
  name: string;
  price: number;
  tags: string[];
}

interface Tag {
  name: string;
  items: Item[];
}

interface KeyCards {
  publicKey: `0x${string}`;
}

type StoreObjectTypes = Item | Tag | KeyCards;

// This is a an interface that is used to retrieve and store objects from a persistant layer
type Store<T extends StoreObjectTypes> = {
  put(key: string, value: T): Promise<void>;
  get(key: string): Promise<T>;
};

abstract class PublicObjectManager<
  T extends StoreObjectTypes,
> extends EventEmitter {
  constructor(protected db: Store<T>) {
    super();
  }
  abstract _processEvent(event: schema.ShopEvents): Promise<boolean>;
}

class ItemManager extends PublicObjectManager<Item> {
  constructor(db: Store<Item>) {
    super(db);
  }
  // Process the events; if the event modifies one the shops items this updates the store and emits an event
  // returns a bool to indicate whether the event was processed or not
  async _processEvent(event: schema.ShopEvents): Promise<boolean> {
    if (typeof event === schema.ShopEvents.UpdateItem) {
      // load the item from the store
      const item = await this.db.get(event.eventId);
      Object.assign(item, event);
      await this.db.put(event.eventId, item);
      this.emit("update", item);
      return true;
    } else {
      return false;
    }
  }
}

// This class creates the state of a store from an event stream
// It also handles the states persistence, retrieval and updates
export class StateManager {
  readonly items;
  // readonly tags;
  // readonly keycards;
  constructor(
    public client: RelayClient,
    itemStore: Store<Item>,
  ) {
    this.items = new ItemManager(itemStore);
    this.#start();
  }

  async #start() {
    const storeObjects = [this.items];
    const stream = this.client.createEventStream();
    for await (const event of stream) {
      for (const storeObject of storeObjects) {
        if (await storeObject._processEvent(event)) {
          break;
        }
      }
    }
  }
}
