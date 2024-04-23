// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

//TODO:add product function works correctly

import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "../test";
import { StoreContext } from "@/context/StoreContext";
import Products from "@/app/products/page";
import { dummyProducts } from "@/context/dummyData";

describe("Product component consumes context state correctly", () => {
  const customRender = (component, providerProps) => {
    return render(
      <StoreContext.Provider value={providerProps}>
        {component}
      </StoreContext.Provider>,
    );
  };
  beforeEach(() => {
    const dummyValues = {
      products: dummyProducts,
    };

    customRender(<Products />, dummyValues);
  });

  it("Product list component consumes the store context properly.", async () => {
    const camelSticker = screen.getByTestId(`product-Dubai Camel Sticker`);
    expect(camelSticker).toBeInTheDocument();
    expect(camelSticker).toHaveTextContent("Dubai Camel Sticker");

    const WAGMI = screen.getByTestId(`product-WAGMI Sticker`);
    expect(WAGMI).toBeInTheDocument();
    expect(WAGMI).toHaveTextContent("WAGMI Sticker");

    const RektSticker = screen.getByTestId(`product-Rekt Sticker`);
    expect(RektSticker).toBeInTheDocument();
    expect(RektSticker).toHaveTextContent("Rekt Sticker");
  });
  it("Renders the correct number of products", async () => {
    expect(screen.getAllByTestId(`product-title`)).toHaveLength(5);
  });
});
