import "../../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect } from "@std/expect";
import { parseEther } from "viem";

import { Listing } from "@massmarket/schema";
import { CodecKey, CodecValue } from "@massmarket/utils/codec";
import { useKeycard } from "@massmarket/react-hooks";

import EditListing from "./EditListing.tsx";
import { ListingViewState } from "../../../types.ts";
import {
  createTestRelayClient,
  createTestStateManager,
  createWrapper,
  denoTestOptions,
  testWrapper,
} from "../../../testutils/_createWrapper.tsx";

Deno.test(
  "Edit Listing",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    let listingId: CodecKey;
    const user = userEvent.setup();

    const relayClient = await createTestRelayClient(shopId);
    const stateManager = await createTestStateManager(shopId);
    await relayClient.connect();
    await relayClient.authenticate();
    stateManager.addConnection(relayClient);

    await t.step("Create new listing", async () => {
      const wrapper = await createWrapper(shopId);
      const { unmount } = render(<MerchantTestComponent />, {
        wrapper,
      });
      await screen.findByTestId("edit-listing-screen");
      const titleInput = screen.getByTestId("title");
      await user.type(titleInput, "product 1");
      const descInput = screen.getByTestId("description");
      await user.type(descInput, "product 1 description");
      const priceInput = screen.getByTestId("price");
      await user.type(priceInput, "555");
      const stockInput = screen.getByTestId("stock");
      await user.type(stockInput, "6");

      // Simulate file upload
      const file = new File(["test image content"], "test.jpg", {
        type: "image/jpeg",
      });
      const fileInput = screen.getByTestId("file-upload");
      await user.upload(fileInput, file);
      // check we got listing images on screen
      const listingImages = await screen.findByTestId("listing-images");
      expect(listingImages.children.length).toEqual(1);
      // Verify the image was uploaded
      const uploadedImage = await screen.findByTestId(
        "uploaded-product-image",
      );
      expect(uploadedImage).toBeDefined();
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
        await user.click(publishButton);
      });

      // Check the stateManager to see that listing was created

      await waitFor(async () => {
        const listings = await stateManager.get(["Listings"]) as Map<
          CodecKey,
          CodecValue
        >;
        expect(listings.size).toEqual(1);
        for (const [id, listing] of listings.entries()) {
          listingId = id;
          const l = Listing.fromCBOR(listing);
          expect(l.Metadata.Title).toEqual("product 1");
          expect(l.Metadata.Description).toEqual("product 1 description");
          expect(l.Price).toEqual(parseEther("555"));
          expect(l.ViewState).toEqual(ListingViewState.Published);
          expect(l.Metadata.Images?.length).toEqual(1);
          const inventory = await stateManager.get(["Inventory", listingId]);
          expect(inventory).toEqual(6);
        }
      });

      unmount();
    });

    await t.step("Edit an existing listing", async () => {
      const wrapper = await createWrapper(shopId, `/?itemId=${listingId}`);
      const { unmount } = render(<MerchantTestComponent />, {
        wrapper,
      });

      await screen.findByTestId("edit-listing-screen");
      await waitFor(() => {
        const priceInput = screen.getByTestId("price") as HTMLInputElement;
        expect(priceInput.value).toBe("555");
      });
      const titleInput = screen.getByTestId("title") as HTMLInputElement;
      expect(titleInput.value).toBe("product 1");
      const descInput = screen.getByTestId("description") as HTMLInputElement;
      expect(descInput.value).toBe("product 1 description");
      const quantityInput = screen.getByTestId("stock") as HTMLInputElement;
      expect(quantityInput.value).toBe("6");
      const publishCheckbox = screen.getByRole("checkbox", {
        name: /Publish product/i,
      }) as HTMLInputElement;
      expect(publishCheckbox.checked).toBeTruthy();

      // Update the inputs
      const stockInput = screen.getByTestId("stock") as HTMLInputElement;
      await user.clear(stockInput);
      await user.type(stockInput, "4");
      waitFor(() => {
        expect(quantityInput.value).toBe("4");
      });
      const titleInput2 = screen.getByTestId("title");
      await user.clear(titleInput2);
      await user.type(titleInput2, "Updated title");
      const descInput2 = screen.getByTestId("description");
      await user.clear(descInput2);
      await user.type(descInput2, "Updated description");

      const publishButton = screen.getByRole("button", {
        name: /Update product/i,
      });
      await user.click(publishButton);
      await waitFor(async () => {
        const updatedListing = Listing.fromCBOR(
          await stateManager.get(["Listings", listingId]) as Map<
            CodecKey,
            CodecValue
          >,
        );
        expect(updatedListing.Metadata.Title).toBe("Updated title");
        expect(updatedListing.Metadata.Description).toBe("Updated description");
        const updateInv = await stateManager.get(["Inventory", listingId]);
        expect(updateInv).toBe(4);
      });
      unmount();
    });
    cleanup();
  }),
);

const MerchantTestComponent = () => {
  useKeycard({ role: "merchant" });
  return <EditListing />;
};
