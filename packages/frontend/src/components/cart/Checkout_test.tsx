import "../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect } from "@std/expect";
import { fromHex } from "viem";

// import { addresses } from "@massmarket/contracts";
import { random256BigInt, randUint64 } from "@massmarket/utils";
import { allListings } from "@massmarket/schema/testFixtures";
import {
  AddressDetails,
  ChainAddress,
  Manifest,
  Order,
  OrderedItem,
  OrderState,
} from "@massmarket/schema";

import { createRouterWrapper, testClient } from "../../testutils/mod.tsx";
import CheckoutFlow from "./CheckoutFlow.tsx";

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

  // wait for manifest to sync
  await waitFor(async () => {
    const manifest = await merchantStateManager.get(["Manifest"]);
    expect(manifest).toBeDefined();
    const manifestObj = Manifest.fromCBOR(manifest as Map<string, unknown>);
    // console.log({manifestObj})
    expect(manifestObj.ShopID).toBe(shopId);
    // expect(manifestObj.AcceptedCurrencies.size).toBe(1);
  });

  // Add manifest data
  const testCurrency = new ChainAddress(31337, new Uint8Array(20));

  // TODO: allow for setting the whole accepted currencies map at once
  // await merchantStateManager.set(["Manifest", "AcceptedCurrencies", testCurrency.ChainID, testCurrency.Address],
  //   // @ts-ignore TODO: add BaseClass to CodecValue
  //   new Map<number, Map<string, boolean>>([
  //     [testCurrency.ChainID, new Map([[testCurrency.Address, true]])],
  //   ])
  // );

  // work around it by replacing the whole manifest instead
  const currentManifestMap = await merchantStateManager.get(["Manifest"]);
  const currentManifest = Manifest.fromCBOR(
    currentManifestMap as Map<string, unknown>,
  );
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
  await merchantStateManager.set(["Manifest"], currentManifest);

  // await merchantStateManager.set(["Manifest", "PricingCurrency"],
  //   // @ts-ignore TODO: add BaseClass to CodecValue
  //   testCurrency
  // );

  // Create listings
  for (const [listingID, listing] of allListings.entries()) {
    // @ts-ignore TODO: add BaseClass to CodecValue
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
      path: "/checkout?step=cart",
    });

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
      new OrderedItem(23, 2), // 2 of item 23
      new OrderedItem(42, 5), // 5 of item 42
    ],
    OrderState.Open,
  );
  // @ts-ignore TODO: add BaseClass to CodecValue
  await stateManager.set(["Orders", orderId], order);

  const { unmount } = render(<CheckoutFlow />, { wrapper });
  screen.getByTestId("checkout-screen");

  await t.step("Cart contains correct items", async () => {
    screen.getByTestId("cart");
    await waitFor(() => {
      const items = screen.getAllByTestId("cart-item") as HTMLElement[];
      expect(items).toHaveLength(2);
      expect(items[0].textContent).toContain("test2Qty: 2460000ETH");
      expect(items[1].textContent).toContain("test425Qty: 52100000ETH");
      expect(screen.getByTestId("total-price").textContent).toBe("2560000");
    });
    await act(async () => {
      const checkoutButton = screen.getByTestId("checkout-button");
      expect(checkoutButton).toBeTruthy();
      await user.click(checkoutButton);
    });
    await waitFor(() => {
      const shippingScreen = screen.getByTestId(
        "shipping-details",
      ) as HTMLElement;
      expect(shippingScreen).toBeTruthy();
    });
  });

  const testShippingDetails = new AddressDetails(
    "John Doe",
    "123 Main St",
    "Anytown",
    "12345",
    "USA",
    "john.doe@example.com",
    undefined, // Address 2 not used yet
    "+1234567890",
  );

  await t.step("Input shipping details", async () => {
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
      const submitShippingDetails = screen.getByRole("button", {
        name: "Payment options",
      });
      await user.click(submitShippingDetails);
    });

    // Wait for shipping details to be saved and screen to change
    await waitFor(() => {
      const choosePayment = screen.getByTestId("choose-payment");
      expect(choosePayment).toBeTruthy();
    });

    // Verify order details were saved correctly
    const updatedOrderData = await stateManager.get(["Orders", orderId]);
    const o = Order.fromCBOR(updatedOrderData as Map<string, unknown>);
    expect(o.InvoiceAddress).toBeDefined();
    expect(o.ShippingAddress).toBeUndefined();

    expect(o.InvoiceAddress).toEqual(testShippingDetails);
  });

  await t.step("Choose payment", async () => {
    const choosePayment = screen.getByTestId("choose-payment");
    expect(choosePayment).toBeTruthy();
    await act(async () => {
      const paymentCurrency = screen.getByTestId("payment-currency");
      expect(paymentCurrency).toBeTruthy();
      const dropdown = paymentCurrency.querySelector(
        '[data-testid="dropdown"]',
      ) as HTMLInputElement;
      await user.click(dropdown);
    });
    await act(async () => {
      const dropdownOptions = screen.getByTestId("chains-dropdown-select");
      expect(dropdownOptions).toBeTruthy();
      const selectElement = dropdownOptions.querySelector("select");
      expect(selectElement).toBeTruthy();
      // // click on the ETH/Hardhat option
      await user.selectOptions(
        selectElement as HTMLSelectElement,
        "ETH/Hardhat",
      );
    });
    await waitFor(() => {
      const paymentDetailsLoading = screen.getByTestId(
        "payment-details-loading",
      );
      expect(paymentDetailsLoading).toBeTruthy();
      expect(paymentDetailsLoading.classList.contains("hidden")).toBe(true);
    });
  });

  await t.step("Connect wallet and initiate payment", async () => {
    await act(async () => {
      const connectWalletButton = screen.getByRole("button", {
        name: /Connect Wallet/i,
      });
      expect(connectWalletButton).toBeTruthy();
      await user.click(connectWalletButton);
    });
    console.log("clicked connect wallet button");
    await waitFor(() => {
      // hardHatButton = screen.getByRole("button", {
      //   name: /Hardhat/i,
      // });

      const hardHatButton = screen.getByTestId("rk-chain-button");
      expect(hardHatButton).toBeTruthy();
    });
    console.log("found hardhat button");
    await act(async () => {
      const hardHatButton = screen.getByTestId("rk-chain-button");
      expect(hardHatButton).toBeTruthy();
      await user.click(hardHatButton);
    });

    let payButton: HTMLElement | null = null;
    await waitFor(() => {
      // Wait for the Pay button to appear after wallet connection
      payButton = screen.getByRole("button", {
        name: /Pay/i,
      });
      expect(payButton).toBeTruthy();

      // Verify the button text is "Pay"
      const payButtonText = screen.getByText("Pay");
      expect(payButtonText).toBeTruthy();
      expect(payButtonText.textContent).toBe("Pay");
    });
    await act(async () => {
      console.log("found pay button");
      expect(payButton).toBeTruthy();
      await user.click(payButton!);
    });
  });

  // await t.step("Confirm payment", async () => {
  //   await waitFor(() => {
  //     const txHashLink = screen.getByTestId("tx-hash-link");
  //     expect(txHashLink).toBeTruthy();
  //   });
  //   screen.debug();
  // });

  unmount();
  cleanup();
});
