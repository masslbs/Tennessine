import "./happyDomSetup.ts";
import { assertEquals } from "jsr:@std/assert";
import { cleanup, render, screen } from "npm:@testing-library/react";
import { createConfig, http } from "npm:wagmi";
import { mainnet, sepolia } from "npm:wagmi/chains";
// import { Window } from "npm:happy-dom-without-node";

Deno.test("check that we can render the app", async () => {
  // we need to import App.tsx here since wagmi and rainbowkit setup timers
  const {
    default: App,
  } = await import("../src/App.tsx");

  const config = createConfig({
    chains: [mainnet, sepolia],
    transports: {
      [mainnet.id]: http("https://mainnet.example.com"),
      [sepolia.id]: http("https://sepolia.example.com"),
    },
  });
  const { unmount } = render(App({ wagmiConfig: config }));
  // await act(async () => {
  const hello = screen.getByTestId("hello");
  assertEquals(hello.textContent, "hello!");
  unmount();
  cleanup();
});
