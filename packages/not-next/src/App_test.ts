import "./happyDomSetup.ts";
import { cleanup, render, screen } from "npm:@testing-library/react";
import { createConfig, http } from "npm:wagmi";
import { mainnet, sepolia } from "npm:wagmi/chains";

Deno.test("check that we can render the app", async () => {
  // we need to import App.tsx here since wagmi and rainbowkit setup timers
  const { default: App } = await import("../src/App.tsx");

  const config = createConfig({
    chains: [mainnet, sepolia],
    transports: {
      [mainnet.id]: http("https://mainnet.example.com"),
      [sepolia.id]: http("https://sepolia.example.com"),
    },
  });

  const { unmount } = render(App({ wagmiConfig: config }));

  // Just check that the element is rendered. This will throw if element is not found
  screen.getByTestId("homepage");

  unmount();
  cleanup();

  // Wait for any rainbowkit/wagmi timers/tasks to complete
  await new Promise((resolve) => setTimeout(resolve, 100));
});
