import "../../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect } from "jsr:@std/expect";
import { mainnet, sepolia } from "wagmi/chains";

import { random256BigInt } from "@massmarket/utils";
import { addresses } from "@massmarket/contracts";
import {
  metadata,
  payees,
  shippingRegions,
} from "@massmarket/schema/testFixtures";

import EditListing from "./EditListing.tsx";
import {
  createClientStateManager,
  createRouterWrapper,
} from "../../../utils/test.tsx";
import { ListingViewState } from "../../../types.ts";

Deno.test("Edit Listing", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const user = userEvent.setup();

  await t.step("Create new listing", async () => {
    const { wrapper, csm } = await createRouterWrapper(null, "/?itemId=new");
    const { unmount } = await render(<EditListing />, { wrapper });
    screen.getByTestId("edit-listing-page");
    await act(async () => {
      const titleInput = screen.getByTestId("title");
      await user.type(titleInput, "product 1");
      const descInput = screen.getByTestId("description");
      await user.type(descInput, "product 1 description");
      const priceInput = screen.getByTestId("price");
      await user.type(priceInput, "1");
      const stockInput = screen.getByTestId("units");
      await user.type(stockInput, "10");

      // Simulate file upload
      const file = new File(["test image content"], "test.jpg", {
        type: "image/jpeg",
      });
      const fileInput = screen.getByTestId("file-upload");
      await user.upload(fileInput, file);

      // Check checkbox to mark listing as published
      const publishCheckbox = screen.getByRole("checkbox", {
        name: /Publish product/i,
      });
      await user.click(publishCheckbox);
    });

    await act(async () => {
      // Verify the image was uploaded
      const uploadedImage = await screen.findByAltText(
        "uploaded-product-image",
      );
      expect(uploadedImage).toBeDefined();
      // Click on publish button
      const publishButton = screen.getByRole("button", {
        name: /Create product/i,
      });
      await user.click(publishButton);
    });
    // Check the db to see that listing was created
    let listingCount = 0;
    for await (const [_, item] of csm.stateManager!.listings.iterator()) {
      listingCount++;
      const { metadata: { title, description, images } } = item;
      expect(title).toBe("product 1");
      expect(description).toBe("product 1 description");
      expect(item.price).toBe("1");
      expect(item.quantity).toBe(10);
      expect(images).toBeDefined();
      expect(item.viewState).toBe(
        ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
      );
    }

    expect(listingCount).toBe(1);
    unmount();
  });
  await t.step("Edit existing listing", async () => {
    const csm = await createClientStateManager();
    await csm.stateManager!.manifest.create(
      {
        acceptedCurrencies: [{
          chainId: mainnet.id,
          address: addresses.zeroAddress,
        }, {
          chainId: sepolia.id,
          address: addresses.zeroAddress,
        }],
        pricingCurrency: { chainId: 1, address: addresses.zeroAddress },
        payees,
        shippingRegions,
      },
      random256BigInt(),
    );

    const { id } = await csm.stateManager!.listings.create({
      metadata,
      price: "100",
      viewState: ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
    });
    await csm.stateManager!.listings.changeInventory(id, 5);
    const { wrapper } = await createRouterWrapper(null, `/?itemId=${id}`, csm);

    const { unmount } = await render(<EditListing />, {
      wrapper,
    });
    screen.getByTestId("edit-listing-page");

    await waitFor(() => {
      const priceInput = screen.getByTestId("price") as HTMLInputElement;
      expect(priceInput.value).toBe("100");
      const titleInput = screen.getByTestId("title") as HTMLInputElement;
      expect(titleInput.value).toBe(metadata.title);
      const descInput = screen.getByTestId("description") as HTMLInputElement;
      expect(descInput.value).toBe(metadata.description);
      const quantityInput = screen.getByTestId("units") as HTMLInputElement;
      expect(quantityInput.value).toBe("5");
      const publishCheckbox = screen.getByRole("checkbox", {
        name: /Publish product/i,
      }) as HTMLInputElement;
      expect(publishCheckbox.checked).toBeTruthy();
    });

    // Update the inputs
    await act(async () => {
      const stockInput = screen.getByTestId("units");
      await user.clear(stockInput);
      await user.type(stockInput, "10");
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

    const updatedListing = await csm.stateManager!.listings.get(id);
    expect(updatedListing.quantity).toBe(10);
    expect(updatedListing.metadata.title).toBe("Updated title");
    expect(updatedListing.metadata.description).toBe("Updated description");

    unmount();
  });
  cleanup();
});
