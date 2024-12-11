import React, { StrictMode } from "react";
import { assertEquals } from "jsr:@std/assert";
import { cleanup, renderHook } from "@testing-library/react-hooks";
import { usePublicClient } from "./usePublicClient.ts";
import { createConfig, http } from "npm:wagmi";
import { mainnet, sepolia } from "npm:wagmi/chains";
import { WagmiProvider } from "wagmi";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http("https://mainnet.example.com"),
    [sepolia.id]: http("https://sepolia.example.com"),
  },
});
function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <WagmiProvider config={config}>{children}</WagmiProvider>
    </StrictMode>
  );
}

Deno.test("usePublicClient", async (t) => {
  GlobalRegistrator.register({});
  await t.step(
    "return publicClient with correct chain when passed chainId",
    () => {
      const { result } = renderHook(() => usePublicClient(1), {
        wrapper,
      });
      assertEquals(result.current.shopPublicClient?.chain.id, 1);
    },
  );
  await t.step(
    "should use environment chain when no chainId is provided",
    () => {
      Deno.env.set("NEXT_PUBLIC_CHAIN_NAME", "sepolia");

      const { result, unmount } = renderHook(() => usePublicClient(), {
        wrapper,
      });
      assertEquals(result.current.shopPublicClient?.chain.id, sepolia.id);
      unmount();
    },
  );
  cleanup();
  await GlobalRegistrator.unregister();
});
