import React, { StrictMode } from "react";
import { assertEquals } from "jsr:@std/assert";
import { cleanup, renderHook } from "@testing-library/react-hooks";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";
import { usePublicClient } from "./usePublicClient.js";

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
      const { result } = renderHook(() => usePublicClient(sepolia.id), {
        wrapper,
      });
      assertEquals(result.current.shopPublicClient!.chain!.id, sepolia.id);
    },
  );
  await t.step("should use mainnet chain when no chainId is provided", () => {
    const { result, unmount } = renderHook(() => usePublicClient(), {
      wrapper,
    });
    assertEquals(result.current.shopPublicClient!.chain!.id, 1);
    unmount();
  });
  cleanup();
  await GlobalRegistrator.unregister();
});
