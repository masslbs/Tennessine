// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

// TODO: consume store context for transactions
// test each order item

import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "../test";
import Transaction from "@/app/transactions/page";

describe("Product component consumes context state correctly", () => {
  //   const customRender = (component, providerProps) => {
  //     return render(
  //       <StoreContext.Provider value={providerProps}>
  //         {component}
  //       </StoreContext.Provider>
  //     );
  //   };
  //   beforeEach(() => {
  //     const dummyValues = {
  //       products: dummyProducts,
  //     };

  //     customRender(<Products />, dummyValues);
  //   });

  it("Transaction render", async () => {
    render(<Transaction />);
    expect(screen.getAllByTestId("transaction-block")).toHaveLength(8);
  });
});
