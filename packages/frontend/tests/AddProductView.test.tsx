import React from "react";
import { beforeAll, describe, expect, test } from "vitest";
import { formatUnits } from "viem";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";

import { formatUnitsFromString } from "@massmarket/utils";
import { MockClientStateManager } from "@massmarket/stateManager/tests/mockClient";
import AddProductView from "@/app/products/edit/page";
import { getMockClient, MerchantsRender } from "./test-utils";

describe("Add New Product", async () => {
  let client: MockClientStateManager;
  beforeAll(async () => {
    client = await getMockClient();
    MerchantsRender(<AddProductView />, client);
  });
  const user = userEvent.setup();
  const decimals = 18;

  test("Create new product", async () => {
    mockRouter.push("?itemId=new");
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    await act(async () => {
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
    });

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "create product" }));
    });

    await waitFor(async () => {
      let count = 0;

      for await (const [id, item] of client!.stateManager!.items.iterator()) {
        count++;
        expect(item.metadata.title).toEqual("Brand New Item");
        expect(formatUnitsFromString(item.price, decimals)).toEqual("4");
        expect(item.metadata.description).toEqual("Description...");
        expect(item.quantity).toEqual(5);
      }
      expect(count).toEqual(1);
    });
  });
  test("Edit product", async () => {
    const { id } = await client!.stateManager!.items.create({
      price: "12.00",
      metadata: {
        title: "Test Item 1",
        description: "Test description 1",
        images: ["https://http.cat/images/201.jpg"],
      },
    });
    mockRouter.push(`?itemId=${id}`);
    MerchantsRender(<AddProductView />, client);
    //Test stored fields are correctly populated.
    await waitFor(async () => {
      const title = screen.getByDisplayValue("Test Item 1");
      const description = screen.getByDisplayValue("Test description 1");
      const price = screen.getByDisplayValue("12");
      expect(price).toBeTruthy();
      expect(description).toBeTruthy();
      expect(title).toBeTruthy();
    });
    //Test updating product via UI
    await act(async () => {
      const titleInput = screen.getByTestId("title");
      const descInput = screen.getByTestId("description");
      const priceInput = screen.getByTestId("price");
      const unitInput = screen.getByTestId("units");
      fireEvent.change(priceInput, {
        target: { value: "54.00" },
      });
      fireEvent.change(titleInput, {
        target: { value: "Updated Store Name" },
      });
      fireEvent.change(descInput, {
        target: { value: "Updated description" },
      });
      user.clear(unitInput);
      fireEvent.change(unitInput, {
        target: { value: 10 },
      });
      await user.click(screen.getByRole("button", { name: /update/i }));
    });
    await waitFor(async () => {
      const item = await client!.stateManager!.items.get(id);
      expect(item.quantity).toEqual(10);
      expect(item.metadata.title).toEqual("Updated Store Name");
      expect(item.metadata.description).toEqual("Updated description");
      expect(formatUnits(BigInt(item.price), decimals)).toEqual("54");
    });
  });
});
