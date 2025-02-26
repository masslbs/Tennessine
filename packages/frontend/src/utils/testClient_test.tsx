import "../happyDomSetup.ts";
import { render, screen, waitFor } from "@testing-library/react";
import { useAccount, useEnsName, useWalletClient } from "wagmi";
import { expect } from "jsr:@std/expect";
import { hardhat } from "wagmi/chains";
import { createRouterWrapper } from "../utils/test.tsx";

const TestComponent = () => {
  const { status } = useAccount();
  const { data: wallet } = useWalletClient();
  const { data: ensName } = useEnsName({
    address: wallet?.account.address,
  });
  return (
    <div>
      <p>{status}</p>
      <p>{wallet?.chain?.id}</p>
      <p>{ensName}</p>
    </div>
  );
};

Deno.test("Test wallet client is configured correctly for test environment", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const { wrapper } = await createRouterWrapper();

  render(<TestComponent />, { wrapper });

  await waitFor(() => {
    expect(screen.getByText("connected")).toBeTruthy();
  });
  await waitFor(() => {
    expect(screen.getByText(hardhat.id)).toBeTruthy();
  });
});
