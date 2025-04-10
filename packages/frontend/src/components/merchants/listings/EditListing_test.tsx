import "../../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect } from "@std/expect";
import { parseEther } from "viem";
import { Listing } from "@massmarket/schema";
import { random256BigInt } from "@massmarket/utils";
import { CodecKey, CodecValue } from "@massmarket/utils/codec";

import EditListing from "./EditListing.tsx";
import { createRouterWrapper } from "../../../testutils/mod.tsx";
import { ListingViewState } from "../../../types.ts";

Deno.test("Edit Listing", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const shopId = random256BigInt();

  const { wrapper, stateManager, relayClient } = await createRouterWrapper({
    shopId,
    path: "/?itemId=new",
    createShop: true,
    enrollMerchant: true,
  });

  let listingID = 0; // to be established by first test step

  const user = userEvent.setup();
  await t.step("Create new listing", async () => {
    const { unmount } = render(<EditListing />, { wrapper });
    screen.getByTestId("edit-listing-screen");
    await act(async () => {
      const titleInput = screen.getByTestId("title");
      await user.type(titleInput, "product 1");
      const descInput = screen.getByTestId("description");
      await user.type(descInput, "product 1 description");
      const priceInput = screen.getByTestId("price");
      await user.type(priceInput, "555");
      const stockInput = screen.getByTestId("stock");
      await user.type(stockInput, "123");

      // Simulate file upload
      const file = new File(["test image content"], "test.jpg", {
        type: "image/jpeg",
      });
      const fileInput = screen.getByTestId("file-upload");
      await user.upload(fileInput, file);
    });

    await act(async () => {
      // check we got listing images on screen
      const listingImages = await screen.findByTestId("listing-images");
      expect(listingImages.children.length).toEqual(1);
      // Verify the image was uploaded
      const uploadedImage = await screen.findByTestId(
        "uploaded-product-image",
      );
      expect(uploadedImage).toBeDefined();
    });

    // if we do this before the image is uploaded, it will fail
    // for some reason the reader.onload fires after this,
    // resulting in a data race, overwriting the images with old state.
    await act(async () => {
      // Check checkbox to mark listing as published
      const publishCheckbox = screen.getByRole("checkbox", {
        name: /Publish product/i,
      });
      await user.click(publishCheckbox);
    });

    await act(async () => {
      // Click on publish button
      const publishButton = screen.getByRole("button", {
        name: /Create product/i,
      });
      // const publishButton = await screen.findByTestId("save-button")
      await user.click(publishButton);
    });

    // Check the db to see that listing was created
    let allListings: Map<string, unknown> = new Map();
    let listingCount = 0;
    await waitFor(async () => {
      const gotListings = await stateManager.get(["Listings"]);
      expect(gotListings).toBeInstanceOf(Map<string, unknown>);
      allListings = gotListings as Map<string, unknown>;
      expect(allListings.size).toEqual(1);
      const allInventory = await stateManager.get(["Inventory"]) as Map<
        number,
        unknown
      >;
      expect(allInventory.size).toEqual(1);
    }, { timeout: 15000 });

    for (const [id, listingData] of allListings.entries()) {
      listingCount++;
      expect(typeof id).toBe("number");
      listingID = Number(id);
      const l = Listing.fromCBOR(listingData);
      expect(l.Metadata.Title).toBe("product 1");
      expect(l.Metadata.Description).toBe("product 1 description");
      expect(l.Price).toEqual(parseEther("555"));

      const inventory = await stateManager.get(["Inventory", listingID]);
      expect(inventory).toBe(123);
      expect(l.Metadata.Images?.length).toEqual(1);
      expect(l.ViewState).toBe(
        ListingViewState.Published,
      );
    }

    expect(listingCount).toBe(1);
    unmount();
  });
  expect(listingID).toBeGreaterThan(0);

  await t.step("Edit existing listing", async () => {
    await stateManager.set(["Inventory", listingID], 123);
    const { wrapper } = await createRouterWrapper({
      shopId,
      path: `/?itemId=${listingID}`,
      stateManager,
      relayClient,
    });

    const { unmount } = render(<EditListing />, {
      wrapper,
    });
    screen.getByTestId("edit-listing-screen");

    await waitFor(() => {
      const priceInput = screen.getByTestId("price") as HTMLInputElement;
      expect(priceInput.value).toBe("555");
      const titleInput = screen.getByTestId("title") as HTMLInputElement;
      expect(titleInput.value).toBe("product 1");
      const descInput = screen.getByTestId("description") as HTMLInputElement;
      expect(descInput.value).toBe("product 1 description");
      const quantityInput = screen.getByTestId("stock") as HTMLInputElement;
      expect(quantityInput.value).toBe("123");
      const publishCheckbox = screen.getByRole("checkbox", {
        name: /Publish product/i,
      }) as HTMLInputElement;
      expect(publishCheckbox.checked).toBeTruthy();
    });

    // Update the inputs
    await act(async () => {
      const stockInput = screen.getByTestId("stock");
      await user.clear(stockInput);
      await user.type(stockInput, "321");
      const titleInput = screen.getByTestId("title");
      await user.clear(titleInput);
      await user.type(titleInput, "Updated title");
      const descInput = screen.getByTestId("description");
      await user.clear(descInput);
      await user.type(descInput, "Updated description");
    });

    await act(async () => {
      const publishButton = screen.getByRole("button", {
        name: /Update product/i,
      });
      await user.click(publishButton);
    });

    // the end of act does not mean the update is back from the relay yet, so we need to waitFor
    await waitFor(async () => {
      const updatedListing = Listing.fromCBOR(
        await stateManager.get(["Listings", listingID]) as Map<
          CodecKey,
          CodecValue
        >,
      );
      expect(updatedListing.Metadata.Title).toBe("Updated title");
      expect(updatedListing.Metadata.Description).toBe("Updated description");
      const updateInv = await stateManager.get(["Inventory", listingID]);

      expect(updateInv).toBe(321);
    });
    unmount();
  });

  cleanup();
});
