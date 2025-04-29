import { expect } from "@std/expect";
import {
  createTestClient,
  createWalletClient,
  hexToBigInt,
  hexToBytes,
  http,
  publicActions,
  walletActions,
} from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { foundry } from "viem/chains";
import { mintShop, relayRegGetOwnerOf } from "@massmarket/contracts";

import { discoverRelay, type Patch, RelayClient } from "./mod.ts";

const relayURL = Deno.env.get("RELAY_ENDPOINT") || "http://localhost:4444/v4";

// helper function
async function writeAndReadPatch(
  patch: Patch,
  writer: WritableStreamDefaultWriter,
  reader: ReadableStreamDefaultReader,
): Promise<void> {
  await writer.write([patch]);
  const p = await reader.read();
  expect(p.value.patches).toEqual([patch]);
}

const testOpts = {
  name: "Relay Client: Unit Tests",
  sanitizeResources: false,
  sanitizeOps: false,
};

Deno.test(
  {
    ...testOpts,
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

      await t.step("should discover relay", async () => {
        const relayEndpoint = await discoverRelay(relayURL);
        expect(relayEndpoint).toBeDefined();
      });

      // create a relay client
      const relayEndpoint = await discoverRelay(relayURL);
      const pk = generatePrivateKey();
      const kc = privateKeyToAccount(pk);
      const keycardWallet = createWalletClient({
        account: kc,
        chain: foundry,
        transport: http(),
      });
      const relayClient = new RelayClient({
        relayEndpoint,
        walletClient: keycardWallet,
        keycard: kc,
        shopId,
      });

      await t.step("should create relay client and connect", async () => {
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

      const s = relayClient.createSubscriptionStream([], 0);
      const reader = s.getReader();
      const ws = relayClient.createWriteStream();
      const writer = ws.getWriter();

      await t.step("should create and update a manifest", async () => {
        const [m, relayAddr] = await Promise.all([
          reader.read(),
          relayRegGetOwnerOf(blockchainClient, [
            hexToBigInt(relayEndpoint.tokenId),
          ]),
        ]);

        // test that the initial manifest created is signed by the relay
        expect(m.value!.signer).toBe(relayAddr);
        // write the ShippingRegions
        await writeAndReadPatch(
          {
            Op: "add",
            Path: ["Manifest", "ShippingRegions", "germany"],
            Value: new Map([
              ["City", ""],
              ["Country", "DE"],
              ["PostalCode", ""],
              ["PriceModifiers", null],
            ]),
          },
          writer,
          reader,
        );

        await writeAndReadPatch(
          {
            Op: "add",
            Path: [
              "Manifest",
              "AcceptedCurrencies",
              1,
              hexToBytes("0x0000000000000000000000000000000000000000"),
            ],
            Value: new Map(),
          },
          writer,
          reader,
        );

        await writeAndReadPatch(
          {
            Op: "add",
            Path: [
              "Manifest",
              "Payees",
              1,
              hexToBytes("0x000000000000000000000000000000000000002e"),
            ],
            Value: new Map(),
          },
          writer,
          reader,
        );

        await Promise.all([
          reader.cancel(),
          writer.close(),
        ]);
      });

      const file = new File(["foo"], "foo.txt", {
        type: "text/plain",
      });
      const expectedIPFSPath =
        "/ipfs/QmcJw6x4bQr7oFnVnF6i8SLcJvhXjaxWvj54FYXmZ4Ct6p";
      const formData = new FormData();
      formData.append("file", file);

      await t.step("blob upload", async () => {
        const result = await relayClient.uploadBlob(formData);
        expect(result.ipfs_path).toBe(expectedIPFSPath);
      });

      await relayClient.disconnect();

      await t.step(
        "should check that the client connects and authenticates by itself",
        async () => {
          const result = await relayClient.uploadBlob(formData);
          expect(result.ipfs_path).toBe(expectedIPFSPath);
        },
      );
    },
  },
);
