import React from "react";
import { describe, test, expect, beforeEach } from "vitest";
import { waitFor, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { randomAddress, zeroAddress } from "@massmarket/utils";
import { merchantsWrapper, getStateManager } from "./test-utils";
import ProductDetail from "@/app/products/productDetail/page";
import mockRouter from "next-router-mock";
import { ListingViewState, OrderState } from "@/types";

describe("Product Detail Component", async () => {
  const user = userEvent.setup();
  let itemId: `0x${string}`;
  const sm = await getStateManager();

  beforeEach(async () => {
    const order = await sm.orders.create();

    await sm.manifest.create(
      {
        payees: [
          {
            address: randomAddress(),
            callAsContract: false,
            chainId: 1,
            name: "default",
          },
        ],
        pricingCurrency: {
          chainId: 1,
          address: zeroAddress,
        },
      },
      randomAddress(),
    );

    const { id } = await sm.items.create({
      price: "12.00",
      metadata: {
        title: "Meow meow",
        description: "description...meow",
        images: ["https://http.cat/images/201.jpg"],
      },
    });
    itemId = id;
    await sm.items.changeInventory(id, 5);

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
      expect(price.textContent).toEqual("12");
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
    const openOrder = await sm.orders.getStatus(OrderState.STATE_OPEN);
    const orderDetails = await sm.orders.get(openOrder[0]);
    expect(orderDetails.items[itemId]).toEqual(2);

    //addsItems
    await act(async () => {
      const qtyInput = screen.getByTestId("purchaseQty");
      user.clear(qtyInput);
      fireEvent.change(qtyInput, {
        target: { value: "3" },
      });
    });
    await waitFor(async () => {
      await user.click(await screen.findByTestId("updateQty"));
      const o = await sm.orders.getStatus(Status.Pending);
      const d = await sm.orders.get(o[0]);
      expect(d.items[itemId]).toEqual(3);
    });
    const o = await sm.orders.getStatus(OrderState.STATE_OPEN);
    const d = await sm.orders.get(o[0]);
    expect(d.items[itemId]).toEqual(3);

    //removesItems
    await act(async () => {
      const qtyInput = screen.getByTestId("purchaseQty");
      user.clear(qtyInput);
      fireEvent.change(qtyInput, {
        target: { value: "1" },
      });
      await user.click(await screen.findByTestId("updateQty"));
    });
    const ro = await sm.orders.getStatus(OrderState.STATE_OPEN);
    const b = await sm.orders.get(ro[0]);
    expect(b.items[itemId]).toEqual(1);

    // Testing event listener for change stock
    await sm.items.changeInventory(itemId, 400);

    await waitFor(async () => {
      // Testing event listener for change stock
      await sm.items.changeStock([itemId], [400]);
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
    });

    await waitFor(async () => {
      const res = await sm.items.get(itemId);
      expect(res.viewState).toEqual(
        ListingViewState.LISTING_VIEW_STATE_DELETED,
      );
    });
  });
});
