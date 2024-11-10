import React from "react";
import { describe, expect, test } from "vitest";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getMockClient, MerchantsRender } from "./test-utils";
import ProductDetail from "@/app/products/productDetail/page";
import mockRouter from "next-router-mock";
import { ListingId, OrderState } from "@/types";

describe("Product Detail Component", async () => {
  const user = userEvent.setup();
  const client = await getMockClient();

  let itemId: ListingId;

  test("Product Detail renders product data ", async () => {
    await act(async () => {
      await client!.stateManager!.orders.create();
      const { id } = await client!.stateManager!.items.create({
        price: "12.00",
        metadata: {
          title: "Meow meow",
          description: "description...meow",
          images: ["https://http.cat/images/201.jpg"],
        },
      });
      itemId = id;
      mockRouter.push(`?itemId=${itemId}`);
      await client!.stateManager!.items.changeInventory(itemId, 5);
    });

    await waitFor(async () => {
      MerchantsRender(<ProductDetail />, client);
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
    const openOrder = await client!.stateManager!.orders.getStatus(
      OrderState.STATE_OPEN,
    );
    const orderDetails = await client!.stateManager!.orders.get(openOrder[0]);
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
        const o = await client!.stateManager!.orders.getStatus(
          OrderState.STATE_OPEN,
        );
        const d = await client!.stateManager!.orders.get(o[0]);
        expect(d.items[itemId]).toEqual(3);
      },
      { timeout: 20000 },
    );

    const o = await client!.stateManager!.orders.getStatus(
      OrderState.STATE_OPEN,
    );
    const d = await client!.stateManager!.orders.get(o[0]);
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
    const order = await client!.stateManager!.orders.getStatus(
      OrderState.STATE_OPEN,
    );
    const b = await client!.stateManager!.orders.get(order[0]);
    expect(b.items[itemId]).toEqual(1);
  });
});
