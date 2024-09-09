import React from "react";
import { describe, expect, test, beforeAll } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import AddProductView from "@/app/products/edit/page";
import { randomAddress } from "@massmarket/utils";
import userEvent from "@testing-library/user-event";
import { getStateManager, merchantsWrapper } from "./test-utils";
import mockRouter from "next-router-mock";

describe("Add New Product", async () => {
  const sm = getStateManager();
  const user = userEvent.setup();
  const tag = await sm.tags.create("visible");
  const order = await sm.orders.create();

  beforeAll(async () => {
    await sm.manifest.create(
      {
        name: "Test Shop",
        description: "Testing shopManifest",
      },
      randomAddress(),
    );
  });

  test("Create new product", async () => {
    mockRouter.push("?itemId=new");
    merchantsWrapper(<AddProductView />, sm, order.id);
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    await waitFor(async () => {
      const titleInput = screen.getByTestId("title");
      const descInput = screen.getByTestId("description");
      const priceInput = screen.getByTestId("price");
      const unitInput = screen.getByTestId("units");
      const uploadInput = screen.getByTestId("file-upload");

      await user.upload(uploadInput, file);
      await user.type(titleInput, "Brand New Store Name");
      await user.type(descInput, "Description...");
      await user.type(priceInput, "4.00");
      await user.type(unitInput, "5");
      await user.click(await screen.findByTestId(`add-tag-btn`));
      const tagInput = await screen.findByTestId("tagInput");
      fireEvent.change(tagInput, {
        target: { value: ":new tag" },
      });
      fireEvent.submit(await screen.findByTestId("tagForm"));
      await user.click(screen.getByRole("button", { name: /publish/i }));
      //Test creating a new tag via UI
      const newTag = await screen.findByTestId("tagSection");
      expect(newTag.textContent).toEqual("new tag");
    });
    let count = 0;
    for await (const [id, item] of sm.items.iterator()) {
      count++;
      expect(item.baseInfo.title).toEqual("Brand New Store Name");
      expect(item.basePrice).toEqual("4.00");
      expect(item.baseInfo.description).toEqual("Description...");
      expect(item.quantity).toEqual(5);
    }
    expect(count).toEqual(1);
    let tagCount = 0;
    for await (const [id, tag] of sm.tags.iterator()) {
      if (tag.name === "visible" || tag.name === "new tag") tagCount++;
    }
    expect(tagCount).toEqual(2);
  });
  test("Edit product", async () => {
    const { id } = await sm.items.create({
      basePrice: "12.00",
      baseInfo: {
        title: "Test Item 1",
        description: "Test description 1",
        images: ["https://http.cat/images/201.jpg"],
      },
    });
    mockRouter.push(`?itemId=${id}`);

    await sm.items.addItemToTag(tag.id, id);

    merchantsWrapper(<AddProductView />, sm, order.id);
    //Test stored fields are correctly populated.
    await waitFor(async () => {
      const title = screen.getByDisplayValue("Test Item 1");
      const description = screen.getByDisplayValue("Test description 1");
      const price = screen.getByDisplayValue("12.00");
      expect(price).toBeTruthy;
      expect(description).toBeTruthy;
      expect(title).toBeTruthy;
    });
    //Test updating product via UI
    await waitFor(async () => {
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
        target: { value: 5 },
      });
      await user.click(screen.getByRole("button", { name: /update/i }));
    });

    const item = await sm.items.get(id);
    expect(item.quantity).toEqual(5);
    expect(item.baseInfo.title).toEqual("Updated Store Name");
    expect(item.baseInfo.description).toEqual("Updated description");
    expect(item.basePrice).toEqual("54.00");
    expect(item.tags[0]).toEqual(tag.id);
  });
});
