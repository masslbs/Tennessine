import React from "react";
import { describe, test, expect, beforeEach } from "vitest";
import { waitFor, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { randomAddress, zeroAddress } from "@massmarket/utils";
import { merchantsWrapper, getStateManager } from "./test-utils";
import ProductDetail from "@/app/products/productDetail/page";
import mockRouter from "next-router-mock";
import { Status } from "@/types";

const sm = getStateManager();

describe("Product Detail Component", async () => {
  const user = userEvent.setup();
  let itemId: `0x${string}`;
  let removeTagId: `0x${string}`;
  beforeEach(async () => {
    const order = await sm.orders.create();

    await sm.manifest.create(
      {
        name: "New Shop",
        description: "New shopManifest",
      },
      randomAddress(),
    );

    const randomTokenAddr = randomAddress();
    await sm.manifest.update({
      addAcceptedCurrencies: [
        {
          chainId: 10,
          tokenAddr: zeroAddress,
        },
        {
          chainId: 2,
          tokenAddr: randomTokenAddr,
        },
      ],
      setBaseCurrency: {
        chainId: 1,
        tokenAddr: zeroAddress,
      },
    });
    const { id } = await sm.items.create({
      price: "12.00",
      metadata: {
        title: "Meow meow",
        description: "description...meow",
        image: "https://http.cat/images/201.jpg",
      },
    });
    itemId = id;
    await sm.items.changeStock([id], [5]);
    const rm = await sm.tags.create("remove");
    removeTagId = rm.id;
    mockRouter.push(`?itemId=${id}`);
    merchantsWrapper(<ProductDetail />, sm, order.id);
  });

  test("Product Detail renders product data ", async () => {
    await waitFor(async () => {
      const title = screen.getByTestId("title");
      const price = screen.getByTestId("price");
      const desc = screen.getByTestId("description");
      const quantity = screen.getByTestId("available");

      expect(title.textContent).toEqual("Meow meow");
      expect(price.textContent).toEqual("12.00");
      expect(desc.textContent).toEqual("description...meow");
      expect(quantity.textContent).toEqual("5");
    });

    await act(async () => {
      const qtyInput = screen.getByTestId("purchaseQty");
      fireEvent.change(qtyInput, {
        target: { value: "2" },
      });
      await user.click(screen.getByTestId("addToCart"));
    });
    // Check that the item (2qty) we added to cart above is saved in stateManager
    const openOrder = await sm.orders.getStatus(Status.Pending);
    const orderDetails = await sm.orders.get(openOrder[0]);
    expect(orderDetails.items[itemId]).toEqual(2);

    // Update purchase quantity
    await act(async () => {
      const qtyInput = screen.getByTestId("purchaseQty");
      user.clear(qtyInput);
      fireEvent.change(qtyInput, {
        target: { value: "3" },
      });
      await user.click(await screen.findByTestId("updateQty"));
    });

    const o = await sm.orders.getStatus(Status.Pending);
    const d = await sm.orders.get(o[0]);
    expect(d.items[itemId]).toEqual(3);

    // Testing event listener for change stock
    await sm.items.changeStock([itemId], [400]);

    await waitFor(async () => {
      const available = screen.getByTestId("available");
      expect(available.textContent).toEqual("405");
    });

    // Test deleting an item
    await act(async () => {
      const deleteButton = screen.getByRole("button", { name: /Delete Item/i });
      await user.click(deleteButton);
    });

    await act(async () => {
      const confirmButton = await screen.findByRole("button", {
        name: /Im sure/i,
      });
      await user.click(confirmButton);
      const res = await sm.items.get(itemId);
      // Check that given item.tags includes the removeTagId
      expect(res.tags[0]).toEqual(removeTagId);
    });
  });
});
