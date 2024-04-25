// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { ReactElement } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "../test";
import { MyContext } from "@/context/MyContext";
import MyWallet from "@/app/my-wallet/page";
import { formatEthAdd } from "@/app/utils";

describe("My wallet consumes context state correctly", () => {
  const customRender = (
    component: ReactElement,
    // @ts-expect-error FIXME
    providerProps
  ) => {
    return render(
      <MyContext.Provider value={providerProps}>{component}</MyContext.Provider>
    );
  };
  beforeEach(() => {
    const dummyValues = {
      walletAddress: "0xC3A04fCb63b95552cCc1456d807A1041CBD45C0B",
      balance: 1,
      avatar: "example",
    };

    customRender(<MyWallet />, dummyValues);
  });

  it("Correctly formatted wallet address is rendered", async () => {
    expect(screen.getByTestId("wallet-address")).toBeInTheDocument();
    expect(screen.getByTestId("wallet-address")).toHaveTextContent(
      formatEthAdd("0xC3A04fCb63b95552cCc1456d807A1041CBD45C0B")
    );
    expect(screen.getByTestId("wallet-address")).toHaveTextContent(
      formatEthAdd("0xC3A0...5C0B")
    );
  });
  it("Correct balance is rendered", async () => {
    expect(screen.getByTestId("balance")).toBeInTheDocument();
    expect(screen.getByTestId("balance")).toHaveTextContent("$1 USD");
  });
});
