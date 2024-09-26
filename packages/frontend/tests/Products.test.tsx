import React from "react";
import { beforeAll, describe, expect, test } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import Products from "../src/app/products/page";
import { randomAddress, zeroAddress } from "@massmarket/utils";
import { merchantsWrapper, getStateManager } from "./test-utils";

describe("Products Component", async () => {
  const sm = await getStateManager();

  beforeAll(async () => {
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
  });
  const order = await sm.orders.create();

  test("All listings are displayed", async () => {
    for (let index = 0; index < 50; index++) {
      await sm.items.create({
        price: `${index + 1}.00`,
        metadata: {
          title: `Test Item ${index + 1}`,
          description: "Test description",
          images: ["https://http.cat/images/201.jpg"],
        },
      });
    }

    merchantsWrapper(<Products />, sm, order.id);

    await waitFor(async () => {
      const items = await screen.findAllByTestId("product-name");
      expect(items.length).toEqual(50);
    });

    // Testing component properly listens to future create events
    await sm.items.create({
      price: `9.00`,
      metadata: {
        title: "Another Item",
        description: "Test description",
        images: ["https://http.cat/images/201.jpg"],
      },
    });
    await waitFor(() => {
      const items = screen.getAllByTestId("product-container");
      expect(items.length).toEqual(51);
      const productMap = new Map();
      //Test all titles and prices are rendered correctly
      items.map((i) => {
        const title = within(i).getByTestId("product-name").textContent;
        const price = within(i).getByTestId("product-price").textContent;
        productMap.set(title, price);
      });

      for (let index = 0; index < 50; index++) {
        expect(Number(productMap.get(`Test Item ${index + 1}`))).toEqual(
          index + 1,
        );
      }
    });
  });
  test("Update Item - Updated title and price are rendered", async () => {
    //Testing Update Item event before render
    const { id } = await sm.items.create({
      price: "9.00",
      metadata: {
        title: "Test Item to update",
        description: "Test description 1",
        images: ["https://http.cat/images/201.jpg"],
      },
    });
    await sm.items.update({
      id,
      price: "1.00",
      metadata: {
        title: "Test Item - Updated",
        description: "Test description",
        images: ["https://http.cat/images/201.jpg"],
      },
    });
    merchantsWrapper(<Products />, sm, order.id);
    await waitFor(() => {
      const items = screen.getAllByTestId("product-container");
      expect(items.length).toEqual(52);
      const productMap = new Map();
      //Test that the new item title and price are updated
      items.map((i) => {
        const title = within(i).getByTestId("product-name").textContent;
        const price = within(i).getByTestId("product-price").textContent;
        productMap.set(title, price);
      });
      expect(Number(productMap.get("Test Item - Updated"))).toEqual(1);
    });
    //Test that the event listeners update the item
    await sm.items.update({
      id,
      price: "5.00",
      metadata: {
        title: "Updated!!",
        description: "Updated test description 1",
        images: ["https://http.cat/images/205.jpg"],
      },
    });

    await waitFor(async () => {
      const items = screen.getAllByTestId("product-container");
      expect(items.length).toEqual(52);
      const productMap = new Map();
      items.map((i) => {
        const title = within(i).getByTestId("product-name").textContent;
        const price = within(i).getByTestId("product-price").textContent;
        productMap.set(title, price);
      });
      expect(Number(productMap.get("Updated!!"))).toEqual(5);
    });
  });
});
