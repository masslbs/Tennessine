import "../happyDomSetup.ts";
import { render, screen, waitFor } from "@testing-library/react";
import { useAccount, useWalletClient } from "wagmi";
import { expect } from "jsr:@std/expect";
import { connect } from "npm:wagmi/actions";
import { hardhat } from "wagmi/chains";
import { config, createRouterWrapper } from "../utils/test.tsx";

const TestComponent = () => {
  const { status } = useAccount();
  const { data: wallet } = useWalletClient();
  return (
    <div>
      <p>{status}</p>
      <p>{wallet?.chain?.id}</p>
    </div>
  );
};

Deno.test("Test wallet client is configured correctly for test environment", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const { wrapper } = await createRouterWrapper();
  render(<TestComponent />, { wrapper });
  await connect(config, { connector: config.connectors[0] });

  await waitFor(() => {
    expect(screen.getByText("connected")).toBeTruthy();
  });
  await waitFor(() => {
    expect(screen.getByText(hardhat.id)).toBeTruthy();
  });
});
