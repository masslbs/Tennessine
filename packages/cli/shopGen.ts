import { numberToHex } from "viem";
import { faker } from "@faker-js/faker";
import {
  createTestBlockchainClient,
  createTestRelayClient,
} from "@massmarket/client/test";
import { MemStore } from "@massmarket/store/mem";
import { Listing, ListingMetadata } from "@massmarket/schema";
import StateManager from "@massmarket/stateManager";

const blockchainClient = createTestBlockchainClient();
const relayClient = await createTestRelayClient(blockchainClient);

console.log("creating shop", numberToHex(relayClient.shopId));

const root = new Map(Object.entries({
  Tags: new Map(),
  Orders: new Map(),
  Accounts: new Map(),
  Inventory: new Map(),
  Listings: new Map(),
  Manifest: new Map(),
  SchemeVersion: 1,
}));

const store = new MemStore();
const sm = new StateManager({
  store,
  id: relayClient.shopId,
  defaultState: root,
});

await sm.open();

sm.addConnection(relayClient);

const writes = [];
for (let i = 1; i < 100; i++) {
  writes.push(
    sm.set(
      ["Listings", i],
      new Listing(
        i,
        faker.number.bigInt(),
        new ListingMetadata(
          faker.commerce.productName(),
          faker.commerce.productDescription(),
          [faker.image.urlPicsumPhotos()],
        ),
        1,
      ),
    ),
  );
}

await Promise.all(writes);

sm.close();
