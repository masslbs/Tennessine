// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
import ConnectWallet from "../src/app/components/login/ConnectWallet";
import { beforeEach, describe, expect, it } from "vitest";

import { UserEvent, act, render, screen, userEvent, waitFor } from "../test";

describe("Wagmi Provider", () => {
  let user: UserEvent;
  beforeEach(() => {
    user = userEvent.setup();
    render(<ConnectWallet close={() => {}} />);
  });

  it("Displays all three connectors set in wagmi config.", async () => {
    const metaMaskButton = screen.getByRole("button", {
      name: "MetaMask",
    });
    const coinbaseButton = screen.getByRole("button", {
      name: "Coinbase Wallet",
    });
    const walletConnectButton = screen.getByRole("button", {
      name: "WalletConnect",
    });

    expect(metaMaskButton).toBeInTheDocument();

    expect(coinbaseButton).toBeInTheDocument();

    expect(walletConnectButton).toBeInTheDocument();
  });

  it("On click, displays connector modal popup.", async () => {
    const coinbaseButton = screen.getByRole("button", {
      name: "Coinbase Wallet",
    });
    const walletConnectButton = screen.getByRole("button", {
      name: "WalletConnect",
    });
    act(() => {
      user.click(coinbaseButton);
    });

    await waitFor(() =>
      expect(screen.findByTestId("connect-content")).toBeDefined(),
    );

    act(() => {
      user.click(walletConnectButton);
    });
    await waitFor(() =>
      expect(screen.findByTestId("connect-content")).toBeDefined(),
    );
  });
});
