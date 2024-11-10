import { getMockClient, MerchantsRender } from "./test-utils.tsx";
import React from "react";
import { beforeAll, describe, test } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { formatUnits } from "viem";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";

import { formatUnitsFromString } from "@massmarket/utils";
import AddProductView from "../src/app/products/edit/page.tsx";

describe("Add New Product", () => {
  const decimals = 18;

  test("Create new product", async () => {
    const client = await getMockClient();
    MerchantsRender(<AddProductView />, client);
    const user = userEvent.setup();
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    mockRouter.default.push("?itemId=new");
    const titleInput = screen.getByTestId("title");
    const descInput = screen.getByTestId("description");
    const priceInput = screen.getByTestId("price");
    const unitInput = screen.getByTestId("units");
    const uploadInput = screen.getByTestId("file-upload");

    await user.upload(uploadInput, file);
    await user.type(titleInput, "Brand New Item");
    await user.type(descInput, "Description...");
    await user.type(priceInput, "4.00");
    await user.type(unitInput, "5");

    client.stateManager.eventStreamProcessing();
    const listingCreatedPromise = new Promise((resolve) => {
      client!.stateManager!.listings.on("create", (id) => {
        resolve(id);
      });
    });

    await user.click(screen.getByRole("button", { name: "create product" }));
    await listingCreatedPromise;
    let count = 0;

    for await (
      const [id, item] of client!.stateManager!.listings.iterator()
    ) {
      count++;
      expect(item.metadata.title).toEqual("Brand New Item");
      expect(formatUnitsFromString(item.price, decimals)).toEqual("4");
      expect(item.metadata.description).toEqual("Description...");
      // expect(item.quantity).toEqual(5);
    }
    expect(count).toEqual(1);
  });
  // test("Edit product", async () => {
  //   const { id } = await client!.stateManager!.listings.create({
  //     price: "12.00",
  //     metadata: {
  //       title: "Test Item 1",
  //       description: "Test description 1",
  //       images: ["https://http.cat/images/201.jpg"],
  //     },
  //   });
  //   mockRouter.default.push(`?itemId=${id}`);
  //   MerchantsRender(<AddProductView />, client);
  //   //Test stored fields are correctly populated.
  //   await waitFor(async () => {
  //     const title = screen.getByDisplayValue("Test Item 1");
  //     const description = screen.getByDisplayValue("Test description 1");
  //     const price = screen.getByDisplayValue("12");
  //     expect(price).toBeTruthy();
  //     expect(description).toBeTruthy();
  //     expect(title).toBeTruthy();
  //   });
  //   //Test updating product via UI
  //   await act(async () => {
  //     const titleInput = screen.getByTestId("title");
  //     const descInput = screen.getByTestId("description");
  //     const priceInput = screen.getByTestId("price");
  //     const unitInput = screen.getByTestId("units");
  //     fireEvent.change(priceInput, {
  //       target: { value: "54.00" },
  //     });
  //     fireEvent.change(titleInput, {
  //       target: { value: "Updated Store Name" },
  //     });
  //     fireEvent.change(descInput, {
  //       target: { value: "Updated description" },
  //     });
  //     user.clear(unitInput);
  //     fireEvent.change(unitInput, {
  //       target: { value: 10 },
  //     });
  //     await user.click(screen.getByRole("button", { name: /update/i }));
  //   });
  //   await waitFor(async () => {
  //     const item = await client!.stateManager!.items.get(id);
  //     expect(item.quantity).toEqual(10);
  //     expect(item.metadata.title).toEqual("Updated Store Name");
  //     expect(item.metadata.description).toEqual("Updated description");
  //     expect(formatUnits(BigInt(item.price), decimals)).toEqual("54");
  //   });
  // });
});
