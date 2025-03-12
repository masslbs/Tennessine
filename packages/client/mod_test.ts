import { expect } from "@std/expect";
import {
  createTestClient,
  hexToBigInt,
  hexToBytes,
  http,
  publicActions,
  walletActions,
} from "@wevm/viem";
import { generatePrivateKey, privateKeyToAccount } from "@wevm/viem/accounts";
import { foundry } from "@wevm/viem/chains";
import { mintShop, relayRegGetOwnerOf } from "@massmarket/blockchain";

import { discoverRelay, type IRelayEndpoint, RelayClient } from "./mod.ts";
import type { TPatch } from "@massmarket/schema/cbor";

const relayURL = Deno.env.get("RELAY_ENDPOINT") || "http://localhost:4444/v4";

// helper function
async function writeAndReadPatch(
  patch: TPatch,
  writer: WritableStreamDefaultWriter,
  reader: ReadableStreamDefaultReader,
): Promise<void> {
  await writer.write([patch]);
  const p = await reader.read();
  expect(p.value.patches).toEqual([patch]);
}

Deno.test(
  {
    name: "Relay Client: Unit Tests",
    sanitizeResources: false,
    sanitizeOps: false,
    async fn(t) {
      const blockchainClient = createTestClient({
        chain: foundry,
        mode: "anvil",
        transport: http(),
      }).extend(publicActions)
        .extend(walletActions);
      // get an account from anvil
      const [account] = await blockchainClient.requestAddresses();

      const shopId = BigInt(Math.floor(Math.random() * 1000000));

      await t.step("mintShop", async () => {
        const transactionHash = await mintShop(blockchainClient, account, [
          shopId,
          account,
        ]);
        // this is still causing a leak
        // https://github.com/wevm/viem/issues/2903
        const receipt = await blockchainClient.waitForTransactionReceipt({
          hash: transactionHash,
        });
        expect(receipt.status).toBe("success");
      });

      let relayEndpoint: IRelayEndpoint;
      await t.step("should discover relay", async () => {
        relayEndpoint = await discoverRelay(relayURL);
        expect(relayEndpoint).toBeDefined();
      });

      let relayClient: RelayClient;
      await t.step("should create relay client and connect", async () => {
        const pk = generatePrivateKey();
        const kc = privateKeyToAccount(pk);
        relayClient = new RelayClient({
          relayEndpoint,
          walletClient: blockchainClient,
          keycard: kc,
          isGuest: true,
          shopId,
        });
        expect(relayClient).toBeDefined();
        const event = await relayClient.connect();
        expect(event.type).toBe("open");
      });

      await t.step("enroll keycard", async () => {
        const r = await relayClient.enrollKeycard(
          blockchainClient,
          account,
          false,
        );
        expect(r.statusText).toBe("Created");
      });

      await t.step("should create a manifest", async () => {
        const s = relayClient.createSubscriptionStream("/", 0);
        const reader = s.getReader();
        const [m, relayAddr] = await Promise.all([
          reader.read(),
          relayRegGetOwnerOf(blockchainClient, [
            hexToBigInt(relayEndpoint.tokenId),
          ]),
        ]);
        expect(m.value!.signer).toBe(relayAddr);
        // write the ShippingRegions
        const ws = relayClient.createWriteStream();
        const writer = ws.getWriter();
        await writeAndReadPatch(
          {
            Op: "add" as const,
            Path: ["Manifest", "ShippingRegions", "default"],
            Value: {
              "Country": "DE",
              "PostalCode": "",
              "City": "",
              "PriceModifiers": null,
            },
          },
          writer,
          reader,
        );

        await writeAndReadPatch(
          {
            Op: "add" as const,
            Path: [
              "Manifest",
              "AcceptedCurrencies",
              1,
              hexToBytes("0x0000000000000000000000000000000000000000"),
            ],
            Value: {},
          },
          writer,
          reader,
        );

        await writeAndReadPatch(
          {
            Op: "add" as const,
            Path: [
              "Manifest",
              "Payees",
              1,
              hexToBytes("0x000000000000000000000000000000000000002e"),
            ],
            Value: {},
          },
          writer,
          reader,
        );

        await writer.close();

        // - orders
        // - listings
      });
    },
  },
);
