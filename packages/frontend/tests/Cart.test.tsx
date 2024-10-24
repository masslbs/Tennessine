import React from "react";
import { describe, test, expect, beforeEach } from "vitest";
import { waitFor, screen, act } from "@testing-library/react";
import { merchantsWrapper, getStateManager } from "./test-utils";
import Cart from "@/app/cart/Cart";

describe("Cart component", async () => {
  beforeEach(async () => {});
  const sm = await getStateManager();
  const order = await sm.orders.create();
  test("Renders cart items", async () => {
    merchantsWrapper(<Cart />, sm, order.id);
    const testProducts = [
      {
        title: "Cart testing Product I",
        description: "Test description I",
        images: ["https://http.cat/images/201.jpg"],
      },
      {
        title: "Cart testing Product II",
        description: "Test description II",
        images: ["https://http.cat/images/201.jpg"],
      },
    ];
    await act(async () => {
      const { id } = await sm.items.create({
        price: "12.00",
        metadata: testProducts[0],
      });
      const { id: id2 } = await sm.items.create({
        price: "5.00",
        metadata: testProducts[1],
      });

      await sm.items.changeInventory(id, 100);
      await sm.items.changeInventory(id2, 100);

      await sm.orders.addsItems(order.id, id, 5);
      await sm.orders.addsItems(order.id, id2, 1);
    });

    await waitFor(async () => {
      const titles = await screen.findAllByTestId("title");
      const prices = await screen.findAllByTestId("price");
      const symbol = await screen.findAllByTestId("symbol");

      expect(titles.length).toEqual(2);
      titles.forEach((item, index) => {
        expect(item.textContent).toEqual(testProducts[index].title);
      });
      expect(prices[0].textContent).toEqual("60");
      expect(prices[1].textContent).toEqual("5");
      // Since we set our pricing currency as ETH, this checks that getTokenInformation fn is correct.
      expect(symbol[0].textContent).toEqual("ETH");
    });
  });
});
