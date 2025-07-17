import { renderHook, waitFor } from "@testing-library/react";
import { expect } from "@std/expect";

import { allManifests } from "@massmarket/schema/testFixtures";
import { ChainAddress } from "@massmarket/schema";
import { abi } from "@massmarket/contracts";

import { usePricingCurrency } from "./usePricingCurrency.ts";
import {
  createTestRelayClient,
  createTestStateManager,
  createWrapper,
  denoTestOptions,
  testWrapper,
} from "./_createWrapper.tsx";
import { hexToBytes } from "viem";

Deno.test(
  "usePricingCurrency hook",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    const relayClient = await createTestRelayClient(shopId);
    const stateManager = await createTestStateManager(shopId);

    await t.step("Set pricing currency on shop manifest", async () => {
      await relayClient.connect();
      await relayClient.authenticate();
      stateManager.addConnection(relayClient);
      allManifests[0]!.set("ShopID", shopId);
      await stateManager.set(["Manifest"], allManifests[0]!);
      const chainCurrency = new ChainAddress(
        31337,
        hexToBytes(abi.eddiesAddress),
      );
      await stateManager.set(
        ["Manifest", "PricingCurrency"],
        chainCurrency,
      );
    });

    await t.step(
      "Hook returns the correct pricing currency symbol and decimal",
      async () => {
        const { result, unmount } = renderHook(
          () => usePricingCurrency(),
          { wrapper: createWrapper(shopId) },
        );
        await waitFor(() => {
          expect(result.current.pricingCurrency?.decimals).toBe(2);
          expect(result.current.pricingCurrency?.symbol).toBe("EDD");
        });
        unmount();
      },
    );
  }),
);
