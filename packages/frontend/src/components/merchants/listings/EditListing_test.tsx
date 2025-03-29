import "../../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import {
  createTestClient,
  http,
  publicActions,
  walletActions,
  zeroAddress,
} from "viem";
import { foundry } from "viem/chains";
import { userEvent } from "@testing-library/user-event";
import { expect } from "@std/expect";
import { hardhat, mainnet, sepolia } from "wagmi/chains";
import { mintShop, relayRegGetOwnerOf } from "@massmarket/contracts";
import { Listing } from "@massmarket/schema";
import { random256BigInt } from "@massmarket/utils";
import {
  metadata,
  payees,
  shippingRegions,
} from "@massmarket/schema/testFixtures";

import EditListing from "./EditListing.tsx";
import {
  createRouterWrapper,
  createTestStateManager,
  testAccount,
} from "../../../testutils/mod.tsx";
import { ListingViewState } from "../../../types.ts";

Deno.test("Edit Listing", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  // prepare shop
  // TODO: move to helper
  const blockchainClient = createTestClient({
    chain: foundry,
    mode: "anvil",
    transport: http(),
  }).extend(publicActions)
    .extend(walletActions);
  const [account] = await blockchainClient.requestAddresses();
  expect(account).toEqual(testAccount);

  const shopId = BigInt(Math.floor(Math.random() * 1000000));

  const transactionHash = await mintShop(blockchainClient, testAccount, [
    shopId,
    testAccount,
  ]);
  // this is still causing a leak
  // https://github.com/wevm/viem/issues/2903
  const receipt = await blockchainClient.waitForTransactionReceipt({
    hash: transactionHash,
  });
  expect(receipt.status).toBe("success");

  const user = userEvent.setup();
  await t.step("Create new listing", async () => {
    const { wrapper, csm } = await createRouterWrapper(shopId, "/?itemId=new");
    const { unmount } = render(<EditListing />, { wrapper });
    screen.getByTestId("edit-listing-screen");
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
      // check we got listing images on screen
      const listingImages = await screen.findByTestId("listing-images");
      expect(listingImages.children.length).toEqual(1);
      // Verify the image was uploaded
      const uploadedImage = await screen.findByTestId(
        "uploaded-product-image",
      );
      expect(uploadedImage).toBeDefined();
      // Click on publish button
      const publishButton = screen.getByRole("button", {
        name: /Create product/i,
      });
      // const publishButton = await screen.findByTestId("save-button")
      await user.click(publishButton);
    });

    let allListings: Map<string, unknown>
    // Check the db to see that listing was created
    let listingCount = 0;
    
    await waitFor(async () => {
      allListings = await csm.stateManager.get(["Listings"])
      expect(allListings.size).toEqual(1)
    }, {timeout: 10000})
    
    for (const [id, listingData] of allListings.entries()) {
      listingCount++;
      const l = Listing.fromCBOR(listingData)
      console.log({listingData, l})
      // const { metadata: { title, description, images } } = item;
      expect(l.Metadata.Title).toBe("product 1");
      expect(l.Metadata.Description).toBe("product 1 description");
      expect(l.Price).toEqual(1);
      // TODO: inventory
      // expect(l.Metadata.Quantity).toBe(10);
      expect(l.Metadata.Images.length).toEqual(1);
      expect(l.ViewState).toBe(
        ListingViewState.Published,
      );
    }

    expect(listingCount).toBe(1);
    unmount();
  });
  // await t.step("Edit existing listing", async () => {
  //   const csm = await createTestStateManager();
  //   await csm.stateManager!.manifest.create(
  //     {
  //       acceptedCurrencies: [{
  //         chainId: mainnet.id,
  //         address: zeroAddress,
  //       }, {
  //         chainId: sepolia.id,
  //         address: zeroAddress,
  //       }],
  //       pricingCurrency: {
  //         chainId: hardhat.id,
  //         address: zeroAddress,
  //       },
  //       payees,
  //       shippingRegions,
  //     },
  //     random256BigInt(),
  //   );

  //   const { id } = await csm.stateManager!.listings.create({
  //     metadata,
  //     price: "100",
  //     viewState: ListingViewState.Published,
  //   });
  //   await csm.stateManager!.listings.changeInventory(id, 5);
  //   const { wrapper } = await createRouterWrapper(null, `/?itemId=${id}`, csm);

  //   const { unmount } = render(<EditListing />, {
  //     wrapper,
  //   });
  //   screen.getByTestId("edit-listing-screen");

  //   await waitFor(() => {
  //     const priceInput = screen.getByTestId("price") as HTMLInputElement;
  //     expect(priceInput.value).toBe("100");
  //     const titleInput = screen.getByTestId("title") as HTMLInputElement;
  //     expect(titleInput.value).toBe(metadata.title);
  //     const descInput = screen.getByTestId("description") as HTMLInputElement;
  //     expect(descInput.value).toBe(metadata.description);
  //     const quantityInput = screen.getByTestId("units") as HTMLInputElement;
  //     expect(quantityInput.value).toBe("5");
  //     const publishCheckbox = screen.getByRole("checkbox", {
  //       name: /Publish product/i,
  //     }) as HTMLInputElement;
  //     expect(publishCheckbox.checked).toBeTruthy();
  //   });

  //   // Update the inputs
  //   await act(async () => {
  //     const stockInput = screen.getByTestId("units");
  //     await user.clear(stockInput);
  //     await user.type(stockInput, "10");
  //     const titleInput = screen.getByTestId("title");
  //     await user.clear(titleInput);
  //     await user.type(titleInput, "Updated title");
  //     const descInput = screen.getByTestId("description");
  //     await user.clear(descInput);
  //     await user.type(descInput, "Updated description");
  //   });

  //   await act(async () => {
  //     const publishButton = screen.getByRole("button", {
  //       name: /Update product/i,
  //     });
  //     await user.click(publishButton);
  //   });

  //   const updatedListing = await csm.stateManager!.listings.get(id);
  //   expect(updatedListing.quantity).toBe(10);
  //   expect(updatedListing.metadata.title).toBe("Updated title");
  //   expect(updatedListing.metadata.description).toBe("Updated description");

  //   unmount();
  // });
  cleanup();
});
