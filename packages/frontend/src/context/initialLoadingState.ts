import { Status, ShopManifest, Order, Item, Tag } from "@/types";
import { EventEmitter } from "events";

const id = "0x" as `0x${string}`;
const loadingManifest = {
  name: "",
  description: "",
  setBaseCurrency: null,
  acceptedCurrencies: [],
  profilePictureUrl: "",
  payee: [],
  publishedTagId: null,
  tokenId: null,
};
const loadingOrders = {
  id,
  items: {},
  status: Status.Pending,
};
const loadingItem = {
  id,
  basePrice: "",
  baseInfo: {
    title: "",
    description: "",
    image: "",
  },
  tags: [],
  quantity: 0,
};
const loadingTag = {
  id,
  name: "",
};

export class LoadingStateManager {
  readonly items;
  readonly tags;
  readonly manifest;
  readonly orders;
  constructor() {
    this.items = new LoadingManager<Item>(loadingItem);
    this.tags = new LoadingManager<Tag>(loadingTag);
    this.manifest = new LoadingManager<ShopManifest>(loadingManifest);
    this.orders = new LoadingManager<Order>(loadingOrders);
  }
}
class AsyncIterableExample<T> {
  private loadingState;

  constructor(loadingState: T) {
    this.loadingState = loadingState;
  }

  [Symbol.asyncIterator]() {
    const v = this.loadingState;
    return {
      async next() {
        // Simulate asyncIterator
        return { value: [id, v], done: true } as IteratorResult<[string, T]>;
      },
    };
  }
}

class LoadingManager<T> extends EventEmitter {
  private loadingState;

  constructor(loadingState: T) {
    super();
    this.loadingState = loadingState;
  }
  async get(key?: string): Promise<T> {
    console.log({ key });
    return this.loadingState;
  }
  iterator(): AsyncIterable<[string, T]> {
    return new AsyncIterableExample<T>(this.loadingState);
  }
  async cancel() {}
  async commit() {}
  async create(): Promise<T> {
    return this.loadingState;
  }
  async update() {}
  async changeItems() {}
  async addItemToTag() {}
  async removeItemFromTag() {}
  async changeInventory() {}
  async getStatus() {}
  async updateShippingDetails() {}
}
