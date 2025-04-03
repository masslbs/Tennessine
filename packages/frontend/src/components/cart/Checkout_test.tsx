import "../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect } from "@std/expect";
import { fromHex } from "viem";

// import { addresses } from "@massmarket/contracts";
import { random256BigInt, randUint64 } from "@massmarket/utils";
import { allListings } from "@massmarket/schema/testFixtures";
import {
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
  // const testCurrency = new ChainAddress(31337, new Uint8Array(20))
  // TODO: allow for setting the whole acceptec currencies map at once
  // await merchantStateManager.set(["Manifest", "AcceptedCurrencies", testCurrency.ChainID, testCurrency.Address],
  //   // @ts-ignore TODO: add BaseClass to CodecValue
  //   new Map<number, Map<string, boolean>>([
  //     [testCurrency.ChainID, new Map([[testCurrency.Address, true]])],
  //   ])
  // );
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
      expect(items[0].textContent).toContain(metadata.title);
      expect(items[1].textContent).toContain(metadata2.title);
      expect(screen.getByTestId("total-price").textContent).toBe("29");
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

  await t.step("Input shipping details", async () => {
    // Fill in all shipping details fields
    await act(async () => {
      await user.type(screen.getByTestId("name"), shippingDetails.name);
      await user.type(screen.getByTestId("address"), shippingDetails.address1);
      await user.type(screen.getByTestId("city"), shippingDetails.city);
      await user.type(screen.getByTestId("zip"), shippingDetails.postalCode);
      await user.type(screen.getByTestId("country"), shippingDetails.country);
      await user.type(
        screen.getByTestId("email"),
        shippingDetails.emailAddress,
      );
      await user.type(screen.getByTestId("phone"), shippingDetails.phoneNumber);
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
    const o = Order.fromCBOR(updatedOrderData);
    expect(o.shippingDetails).toBeDefined();
    const {
      name,
      address1,
      city,
      postalCode,
      country,
      phoneNumber,
      emailAddress,
    } = o.shippingDetails as TAddressDetails;

    expect(name).toBe(shippingDetails.name);
    expect(address1).toBe(shippingDetails.address1);
    expect(city).toBe(shippingDetails.city);
    expect(postalCode).toBe(shippingDetails.postalCode);
    expect(country).toBe(shippingDetails.country);
    expect(emailAddress).toBe(shippingDetails.emailAddress);
    expect(phoneNumber).toBe(shippingDetails.phoneNumber);
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
      const dropdownOptions = screen.getByTestId("dropdown-options");
      expect(dropdownOptions).toBeTruthy();
      // // click on the ETH/Hardhat option
      const option = screen.getByTestId("ETH/Hardhat");
      expect(option).toBeTruthy();
      await user.click(option);
    });
  });

  unmount();
  cleanup();
});
