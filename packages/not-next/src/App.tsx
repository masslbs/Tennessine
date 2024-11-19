// import "./App.css"
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import "@rainbow-me/rainbowkit/styles.css";
import { config } from "./wagmi.ts";
const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConnectButton />
          <div data-testid="hello">
            hello!
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
