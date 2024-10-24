import React from "react";
import { describe, test, expect } from "vitest";
import { waitFor, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { merchantsWrapper, getStateManager } from "./test-utils";
import ProductDetail from "@/app/products/productDetail/page";
import mockRouter from "next-router-mock";
import { OrderId, OrderState, ItemId } from "@/types";

describe("Product Detail Component", async () => {
  const user = userEvent.setup();
  const sm = await getStateManager();

  let itemId: ItemId;
  let orderId: OrderId;

  test("Product Detail renders product data ", async () => {
    await act(async () => {
      const order = await sm.orders.create();
      const { id } = await sm.items.create({
        price: "12.00",
        metadata: {
          title: "Meow meow",
          description: "description...meow",
          images: ["https://http.cat/images/201.jpg"],
        },
      });
      itemId = id;
      orderId = order.id;
      mockRouter.push(`?itemId=${itemId}`);
      await sm.items.changeInventory(itemId, 5);
    });

    await waitFor(async () => {
      merchantsWrapper(<ProductDetail />, sm, orderId);
    });

    await waitFor(async () => {
      const title = await screen.findByTestId("title");
      const price = await screen.findByTestId("price");
      const desc = await screen.findByTestId("description");
      expect(title.textContent).toEqual("Meow meow");
      expect(price.textContent).toEqual("12.00");
      expect(desc.textContent).toEqual("description...meow");
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

    await waitFor(
      async () => {
        await user.click(await screen.findByTestId("updateQty"));
        const o = await sm.orders.getStatus(OrderState.STATE_OPEN);
        const d = await sm.orders.get(o[0]);
        expect(d.items[itemId]).toEqual(3);
      },
      { timeout: 20000 },
    );

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
  });
});
