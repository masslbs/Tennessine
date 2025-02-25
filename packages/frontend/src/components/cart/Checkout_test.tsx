import "../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { expect } from "jsr:@std/expect";

import { addresses } from "@massmarket/contracts";
import { random256BigInt } from "@massmarket/utils";
import {
  metadata,
  metadata2,
  payees,
  shippingDetails,
  shippingRegions,
} from "@massmarket/schema/testFixtures";

import { ListingViewState, ShippingDetails } from "../../types.ts";
import { createRouterWrapper } from "../../utils/test.tsx";
import CheckoutFlow from "./CheckoutFlow.tsx";

Deno.test("Check that we can render the checkout screen", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const user = userEvent.setup();

  const { wrapper, csm } = await createRouterWrapper(
    null,
    "/checkout?step=cart",
  );
  await csm.stateManager!.manifest.create(
    {
      acceptedCurrencies: [{
        chainId: 31337,
        address: addresses.zeroAddress,
      }],
      pricingCurrency: { chainId: 31337, address: addresses.zeroAddress },
      payees,
      shippingRegions,
    },
    random256BigInt(),
  );
  const item1 = await csm.stateManager!.listings.create({
    price: "12.00",
    metadata,
    viewState: ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
  });
  const item2 = await csm.stateManager!.listings.create({
    price: "1.00",
    metadata: metadata2,
    viewState: ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
  });
  // Create order and add item to it
  const order = await csm.stateManager!.orders.create();
  await csm.stateManager!.orders.addItems(order.id, [{
    listingId: item1.id,
    quantity: 2,
  }, { listingId: item2.id, quantity: 5 }]);

  const { unmount } = render(<CheckoutFlow />, { wrapper });
  screen.debug();
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
      await user.type(screen.getByTestId("address"), shippingDetails.address);
      await user.type(screen.getByTestId("city"), shippingDetails.city);
      await user.type(screen.getByTestId("zip"), shippingDetails.zip);
      await user.type(screen.getByTestId("country"), shippingDetails.country);
      await user.type(screen.getByTestId("email"), shippingDetails.email);
      await user.type(screen.getByTestId("phone"), shippingDetails.phone);
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
    const o = (await csm.stateManager!.orders.get(order.id))!;
    expect(o.shippingDetails).toBeDefined();
    const {
      name,
      address1,
      city,
      postalCode,
      country,
      phoneNumber,
      emailAddress,
    } = o.shippingDetails as ShippingDetails;

    expect(name).toBe(shippingDetails.name);
    expect(address1).toBe(shippingDetails.address);
    expect(city).toBe(shippingDetails.city);
    expect(postalCode).toBe(shippingDetails.zip);
    expect(country).toBe(shippingDetails.country);
    expect(emailAddress).toBe(shippingDetails.email);
    expect(phoneNumber).toBe(shippingDetails.phone);
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
