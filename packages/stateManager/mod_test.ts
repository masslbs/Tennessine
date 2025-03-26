import { assertEquals } from "@std/assert";
import { assertInstanceOf } from "@std/assert/instance-of";

import { MemStore } from "@massmarket/store/mem";
import {
  createTestBlockchainClient,
  createTestRelayClient,
} from "@massmarket/client/test";
import { ClientWriteError } from "@massmarket/client";
import {
  type codec,
  extractEntriesFromHAMT,
  fetchAndDecode,
} from "@massmarket/utils";

import StateManager from "./mod.ts";

// we create the blockchain client outside of the tests since viem has a ws leak
const blockchainClient = createTestBlockchainClient();
const relayClient = await createTestRelayClient(blockchainClient);

Deno.test("Database Testings", async (t) => {
  const store = new MemStore();
  const db = new StateManager({
    store,
    objectId: relayClient.shopId,
  });

  // connect to the relay
  const { resolve, promise } = Promise.withResolvers();
  db.events.on((manifestPatch) => {
    resolve(manifestPatch);
  }, ["Manifest"]);

  // TODO: these steps are sharing this connection betcasue disconnect and addConnection again doesn't work rn
  const connection = await db.addConnection(relayClient);

  // wait for manifest to be received
  await promise;

  await t.step(
    "Make sure stateManager throws an error when a patch is rejected",
    async () => {
      let called = false;
      try {
        await db.set(["Trash"], "Bad Value");
      } catch (e) {
        assertInstanceOf(e, ClientWriteError);
        called = true;
      }
      assertEquals(called, true);
    },
  );

  await t.step("add a relay and set a key and retrieve it", async () => {
    const testAddr = Uint8Array.from([
      0xf0,
      0xf1,
      0xf2,
      0x03,
      0x04,
      0x05,
      0xf6,
      0xf7,
      0xf8,
      0x09,
      0x0a,
      0x0b,
      0xfc,
      0xfd,
      0xfe,
      0x0f,
      0x01,
      0x02,
      0xf3,
      0xf4,
    ]);

    const testCurrency = new Map<string, codec.CodecValue>([
      ["Address", testAddr],
      ["ChainID", 1337],
    ]);
    await db.set(
      ["Manifest", "PricingCurrency"],
      testCurrency,
    );
    const value = await db.get(["Manifest", "PricingCurrency"]);
    assertEquals(
      value,
      new Map<string, codec.CodecValue>([
        ["Address", testAddr],
        ["ChainID", 1337],
      ]),
    );
  });

  await t.step(
    "Make sure stateManager throws an error when a patch is rejected",
    async () => {
      const badValue = "Truth gains more even by the errors";
      const p = new Promise<void>((resolve) => {
        connection.ours.catch((error) => {
          assertInstanceOf(error, ClientWriteError);
          assertEquals(error.patchSet.Patches[0].get("Value"), badValue);
          resolve();
        });
        db.set(
          ["Manifest", "PricingCurrency"],
          badValue,
        );
      });
      await p;
    },
  );

  await relayClient.disconnect();
});

Deno.test("Load vector states", async (t) => {
  await t.step("Set Manifest, Listings, and Orders", async () => {
    //Manifest
    const manifestVector = await fetchAndDecode("ManifestOkay");
    const manifests = manifestVector.get("Snapshots")?.map((snapshot) => {
      return snapshot!.get("After")!.get("Value")!.get("Manifest");
    }) || [];
    const db = new StateManager({
      store: new MemStore(),
      objectId: manifests[0]!.get("ShopID") as bigint,
    });
    // Need to initialize the listings map
    await db.set(["Listings"], new Map());
    await db.set(["Orders"], new Map());
    await db.set(["Manifest"], manifests[0]!);

    const result = await db.get(["Manifest"]);
    assertEquals(result, manifests[0]);
    //Listing
    const ListingsVector = await fetchAndDecode("ListingOkay");
    const listings = ListingsVector?.get("Snapshots")?.map((snapshot) => {
      const hamtNode = snapshot?.get("After")?.get("Value")?.get(
        "Listings",
      );
      return extractEntriesFromHAMT(hamtNode);
    }) || [];
    for (const listingMap of listings) {
      for (const [id, listing] of listingMap.entries()) {
        await db.set(["Listings", id], listing as codec.CodecValue);
        const result = await db.get(["Listings", id]);
        assertEquals(result, listing);
      }
    }

    //Order
    const OrderVector = await fetchAndDecode("OrderOkay");
    const orders = OrderVector?.get("Snapshots")?.map((snapshot) => {
      const hamtNode = snapshot?.get("After")?.get("Value")?.get("Orders");
      return extractEntriesFromHAMT(hamtNode);
    }) || [];

    for (const orderMap of orders) {
      for (const [id, order] of orderMap.entries()) {
        await db.set(["Orders", id], order as codec.CodecValue);
        const result = await db.get(["Orders", id]);
        assertEquals(result, order);
      }
    }
  });
});
