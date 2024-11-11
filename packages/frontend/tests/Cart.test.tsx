import React from "react";
import { beforeAll, describe, expect, test } from "vitest";
import { act, screen, waitFor } from "@testing-library/react";

import { MockClientStateManager } from "@massmarket/stateManager/tests/mockClient";
import { Order } from "@/types";
import Cart from "@/app/cart/Cart";
import { getMockClient, MerchantsRender } from "./test-utils";

describe("Cart component", async () => {
  let client: MockClientStateManager;
  let order: Order;
  beforeAll(async () => {
    client = await getMockClient();
    order = await client!.stateManager!.orders.create();
  });
  test("Renders cart items", async () => {
    MerchantsRender(<Cart />, client);
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
      const { id } = await client!.stateManager!.items.create({
        price: "12.00",
        metadata: testProducts[0],
      });
      const { id: id2 } = await client!.stateManager!.items.create({
        price: "5.00",
        metadata: testProducts[1],
      });

      await client!.stateManager!.items.changeInventory(id, 100);
      await client!.stateManager!.items.changeInventory(id2, 100);

      await client!.stateManager!.orders.addsItems(order.id, id, 5);
      await client!.stateManager!.orders.addsItems(order.id, id2, 1);
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
