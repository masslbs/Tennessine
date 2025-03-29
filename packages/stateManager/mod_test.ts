import { assertEquals } from "@std/assert";
import { assertInstanceOf } from "@std/assert/instance-of";

import { MemStore } from "@massmarket/store/mem";
import {
  createTestBlockchainClient,
  createTestRelayClient,
} from "@massmarket/client/test";
import { ClientWriteError } from "@massmarket/client";
import type { codec } from "@massmarket/utils";

import StateManager from "./mod.ts";
import { assertRejects } from "@std/assert/rejects";

// we create the blockchain client outside of the tests since viem has a ws leak
const blockchainClient = createTestBlockchainClient();
const relayClient = await createTestRelayClient(blockchainClient);

const root = new Map(Object.entries({
  Tags: new Map(),
  Orders: new Map(),
  Accounts: new Map(),
  Inventory: new Map(),
  Listings: new Map(),
  Manifest: new Map(),
  SchemeVersion: 1,
}));

Deno.test("Database Testings", async (t) => {
  const store = new MemStore();
  const sm = new StateManager({
    store,
    id: relayClient.shopId,
    defaultState: root,
  });

  await sm.open();

  await t.step("add a relay and set a key and retrieve it", async () => {
    // connect to the relay
    const { resolve, promise } = Promise.withResolvers();
    sm.events.on((manifestPatch) => {
      resolve(manifestPatch);
    }, ["Manifest"]);

    sm.addConnection(relayClient);
    // wait for manifest to be received
    await promise;
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
    await sm.set(
      ["Manifest", "PricingCurrency"],
      testCurrency,
    );
    const value = await sm.get(["Manifest", "PricingCurrency"]);
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
      const result = await assertRejects(() => sm.set(["Trash"], "Bad Value"));
      assertInstanceOf(result, ClientWriteError);
    },
  );
  await t.step("Make sure we can do more then one bad write", async () => {
    const result = await assertRejects(() =>
      sm.set(["Trash"], "Another Bad Value")
    );
    assertInstanceOf(result, ClientWriteError);
  });

  await t.step("Make sure we can close the state manager", async () => {
    const nonce = relayClient.keyCardNonce;
    await sm.close();
    const nsm = new StateManager({
      store,
      id: relayClient.shopId,
    });
    await nsm.open();
    nsm.addConnection(relayClient);
    assertEquals(
      nonce,
      relayClient.keyCardNonce,
      "the new state manager should have loaded the nonce",
    );
    await nsm.close();
  });

  await relayClient.disconnect();
});
