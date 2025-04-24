import "../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect } from "@std/expect";
import { fromHex } from "viem";

import { random256BigInt, randUint64 } from "@massmarket/utils";
import { allListings } from "@massmarket/schema/testFixtures";
import {
  AddressDetails,
  ChainAddress,
  Manifest,
  Order,
  OrderedItem,
  OrderState,
  ShippingRegion,
  ShippingRegionsMap,
} from "@massmarket/schema";
import { CodecKey, CodecValue } from "@massmarket/utils/codec";
import { createRouterWrapper, testClient } from "../../testutils/mod.tsx";
import Checkout from "./Checkout.tsx";
import ShippingDetails from "./ShippingDetails.tsx";
import ChoosePayment from "./ChoosePayment.tsx";

Deno.test("Check that we can render the checkout screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const user = userEvent.setup();
  const shopId = random256BigInt();

  // Set up merchant first
  const {
    stateManager: merchantStateManager,
    relayClient: merchantRelayClient,
    testAccount: testMerchantAccount,
  } = await createRouterWrapper({
    shopId,
    createShop: true,
    enrollMerchant: true,
  });
  merchantStateManager.addConnection(merchantRelayClient);
  console.log("acting as merchant:", testMerchantAccount);
  // wait for manifest to sync
  await waitFor(async () => {
    const manifest = await merchantStateManager.get(["Manifest"]);
    expect(manifest).toBeDefined();
    const manifestObj = Manifest.fromCBOR(
      manifest as Map<CodecKey, CodecValue>,
    );
    // console.log({manifestObj})
    expect(manifestObj.ShopID).toBe(shopId);
    // expect(manifestObj.AcceptedCurrencies.size).toBe(1);
  });

  // Add manifest data
  const testCurrency = new ChainAddress(31337, new Uint8Array(20));

  // TODO: allow for setting the whole accepted currencies map at once
  // await merchantStateManager.set(["Manifest", "AcceptedCurrencies", testCurrency.ChainID, testCurrency.Address],
  //   new Map<number, Map<string, boolean>>([
  //     [testCurrency.ChainID, new Map([[testCurrency.Address, true]])],
  //   ])
  // );

  // work around it by replacing the whole manifest instead
  const currentManifestMap = await merchantStateManager.get(["Manifest"]);
  if (!currentManifestMap) {
    throw new Error("Manifest not found");
  }
  const currentManifest = Manifest.fromCBOR(currentManifestMap);
  currentManifest.AcceptedCurrencies.addAddress(
    testCurrency.ChainID,
    testCurrency.Address,
    false,
  );
  currentManifest.Payees.addAddress(
    testCurrency.ChainID,
    fromHex(testMerchantAccount, { size: 20, to: "bytes" }),
    false,
  );
  currentManifest.ShippingRegions = new ShippingRegionsMap(
    new Map([
      [
        "default",
        new ShippingRegion(""),
      ],
    ]),
  );
  await merchantStateManager.set(["Manifest"], currentManifest);

  // await merchantStateManager.set(["Manifest", "PricingCurrency"],
  //   testCurrency
  // );

  // Create listings
  for (const [listingID, listing] of allListings.entries()) {
    await merchantStateManager.set(["Listings", listingID], listing);
    await merchantStateManager.set(["Inventory", listingID], 100);
  }

  // Remove merchant's keycard to free up for customer
  localStorage.removeItem(`keycard${shopId}`);

  console.log("merchant setup done. bringing up customer wrapper.");

  // Set up customer
  const { wrapper, stateManager, relayClient, testAccount } =
    await createRouterWrapper({
      shopId,
    });
  console.log("acting as customer:", testAccount);
  await relayClient.enrollKeycard(testClient, testAccount, true);
  await relayClient.connect();
  await relayClient.authenticate();
  stateManager.addConnection(relayClient);

  // Wait for listings to sync
  await waitFor(async () => {
    const storedListings = await stateManager.get(["Listings"]) as Map<
      number,
      unknown
    >;
    expect(storedListings.size).toBe(allListings.size);
  });

  // Create order and add items
  const orderId = randUint64();
  const order = new Order(
    orderId,
    [
      new OrderedItem(23, 200), // 200 of item 23
      new OrderedItem(42, 5), // 5 of item 42
    ],
    OrderState.Open,
  );
  await stateManager.set(["Orders", orderId], order);

  const wantTotalPrice = "0.0000000000481";
  await t.step("Cart contains correct items", async () => {
    const { unmount } = render(<Checkout />, { wrapper });

    screen.getByTestId("checkout-screen");
    await waitFor(() => {
      const items = screen.getAllByTestId("cart-item") as HTMLElement[];
      expect(items).toHaveLength(2);
      expect(items[0].textContent).toContain(
        "test200Qty: 2000.000000000046ETH",
      );
      expect(items[1].textContent).toContain("test425Qty: 50.0000000000021ETH");
      expect(screen.getByTestId("total-price").textContent).toBe(
        wantTotalPrice,
      );
    });
    await act(async () => {
      const checkoutButton = screen.getByTestId("checkout-button");
      expect(checkoutButton).toBeTruthy();
      await user.click(checkoutButton);
    });
    const outOfStockMsg = screen.getByTestId("out-of-stock");
    expect(outOfStockMsg).toBeTruthy();
    expect(outOfStockMsg.textContent).toContain(
      `Please remove the item test or reduce the selected quantity.`,
    );

    unmount();
  });

  const testShippingDetails = new AddressDetails(
    "John Doe",
    "123 Main St",
    "Anytown",
    "12345",
    "US",
    "john.doe@example.com",
    undefined, // Address 2 not used yet
    "+1234567890",
  );

  await t.step("Input shipping details", async () => {
    const { unmount } = render(<ShippingDetails />, { wrapper });
    await waitFor(() => {
      const shippingScreen = screen.getByTestId(
        "shipping-details",
      ) as HTMLElement;
      expect(shippingScreen).toBeTruthy();
    });
    // Fill in all shipping details fields
    await act(async () => {
      await user.type(screen.getByTestId("name"), testShippingDetails.Name);
      await user.type(
        screen.getByTestId("address"),
        testShippingDetails.Address1,
      );
      await user.type(screen.getByTestId("city"), testShippingDetails.City);
      await user.type(
        screen.getByTestId("zip"),
        testShippingDetails.PostalCode,
      );
      await user.type(
        screen.getByTestId("country"),
        testShippingDetails.Country,
      );
      await user.type(
        screen.getByTestId("email"),
        testShippingDetails.EmailAddress,
      );
      await user.type(
        screen.getByTestId("phone"),
        testShippingDetails.PhoneNumber!,
      );
    });

    await act(async () => {
      const submitShippingDetails = screen.getByTestId("goto-payment-options");
      await user.click(submitShippingDetails);
    });

    // Verify order details were saved correctly
    const updatedOrderData = await stateManager.get(["Orders", orderId]);
    expect(updatedOrderData).toBeDefined();
    const o = Order.fromCBOR(updatedOrderData!);
    expect(o.InvoiceAddress).toBeDefined();
    expect(o.ShippingAddress).toBeUndefined();

    expect(o.InvoiceAddress).toEqual(testShippingDetails);
    unmount();
  });

  await t.step("Choose payment", async () => {
    const { unmount } = render(<ChoosePayment />, { wrapper });
    const choosePayment = screen.getByTestId("choose-payment");
    expect(choosePayment).toBeTruthy();

    //TODO: post phase 1 of MVP, implement test for multiple payment currency options.
    // await act(async () => {
    //   const paymentCurrency = screen.getByTestId("payment-currency");
    //   expect(paymentCurrency).toBeTruthy();
    //   const dropdown = paymentCurrency.querySelector(
    //     '[data-testid="dropdown"]',
    //   ) as HTMLInputElement;
    //   await user.click(dropdown);
    // });
    // await act(async () => {
    //   const dropdownOptions = screen.getByTestId("chains-dropdown-select");
    //   expect(dropdownOptions).toBeTruthy();
    //   const selectElement = dropdownOptions.querySelector("select");
    //   expect(selectElement).toBeTruthy();
    //   // // click on the ETH/Hardhat option
    //   await user.selectOptions(
    //     selectElement as HTMLSelectElement,
    //     "ETH/Hardhat",
    //   );
    // });

    await waitFor(() => {
      const paymentDetailsLoading = screen.getByTestId(
        "payment-details-loading",
      );
      expect(paymentDetailsLoading).toBeTruthy();
      expect(paymentDetailsLoading.classList.contains("hidden")).toBe(true);
      const displayedAmount = screen.getByTestId("displayed-amount");
      expect(displayedAmount).toBeTruthy();
      expect(displayedAmount.textContent).toBe(`${wantTotalPrice} ETH`);
    });

    // Connect wallet and initiate payment
    await act(async () => {
      const connectWalletButton = screen.getByTestId(
        "rainbowkit-connect-wallet",
      );
      expect(connectWalletButton).toBeTruthy();
      await user.click(connectWalletButton);
    });
    let payButton: HTMLElement | null = null;
    await waitFor(() => {
      // Wait for the Pay button to appear after wallet connection
      payButton = screen.getByRole("button", {
        name: /Pay/i,
      });
      expect(payButton).toBeTruthy();
    });

    await act(async () => {
      expect(payButton).toBeTruthy();
      await user.click(payButton!);
    });
    // Wait for the transaction processing message to appear

    await waitFor(() => {
      let waitingMessage: HTMLElement | null;
      try {
        waitingMessage = screen.getByText("Waiting for transaction...");
        expect(waitingMessage!.tagName.toLowerCase()).toBe("h6");
      } catch (_e) {
        waitingMessage = null;
      }
      let successMessage: HTMLElement | null;
      try {
        successMessage = screen.getByText("Payment Successful");
        expect(successMessage!.tagName.toLowerCase()).toBe("h1");
      } catch (_e) {
        successMessage = null;
      }
      expect(waitingMessage || successMessage).toBeTruthy();
    });

    // Check payment confirmation screen
    await waitFor(() => {
      // Check for payment confirmation screen
      const successMessage = screen.getByText("Payment Successful");
      expect(successMessage).toBeTruthy();

      // Verify the transaction hash is displayed
      const txHashInput = screen.getByTestId("tx-hash-input");
      expect(txHashInput).toBeTruthy();
      expect((txHashInput as HTMLInputElement).value).toContain("0x");

      // Verify USDC amount is displayed
      const amountElement = screen.getByTestId("displayed-amount");
      expect(amountElement).toBeTruthy();
      expect(amountElement.textContent).toContain(wantTotalPrice);
    });
    unmount();
  });

  cleanup();
});
