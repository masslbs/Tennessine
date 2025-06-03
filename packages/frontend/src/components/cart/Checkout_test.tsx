import "../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect } from "@std/expect";
import { fromHex, hexToBytes, zeroAddress } from "viem";
import { abi } from "@massmarket/contracts";
import "@massmarket/utils/logger";

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

// Define currency types for testing
type CurrencyTestConfig = {
  name: string;
  address: `0x${string}`;
  expectedSymbol: string;
  isContract: boolean;
  expectedTotalAmount: string; // Expected displayed amount for this currency
};

const CURRENCY_CONFIGS: CurrencyTestConfig[] = [
  {
    name: "ETH",
    address: zeroAddress,
    expectedSymbol: "ETH",
    isContract: false,
    expectedTotalAmount: "0.0000000000021 ETH",
  },
  {
    name: "ERC20 (EDD)",
    address: abi.eddiesAddress as `0x${string}`,
    expectedSymbol: "EDD",
    isContract: true,
    expectedTotalAmount: "42000 EDD", // EDD has 2 decimals, so amounts are much larger
  },
];

async function runCheckoutTest(currencyConfig: CurrencyTestConfig) {
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
    const manifestObj = Manifest.fromCBOR(
      manifest as Map<CodecKey, CodecValue>,
    );
    expect(manifestObj.ShopID).toBe(shopId);
  });

  // Add manifest data with the test currency
  const testCurrency = new ChainAddress(
    31337,
    hexToBytes(currencyConfig.address),
  );

  // work around it by replacing the whole manifest instead
  const currentManifestMap = await merchantStateManager.get(["Manifest"]);
  if (!currentManifestMap) {
    throw new Error("Manifest not found");
  }
  const currentManifest = Manifest.fromCBOR(currentManifestMap);
  currentManifest.AcceptedCurrencies.addAddress(
    testCurrency.ChainID,
    testCurrency.Address,
    currencyConfig.isContract,
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

  // Create listings
  for (const [listingID, listing] of allListings.entries()) {
    await merchantStateManager.set(["Listings", listingID], listing);
    await merchantStateManager.set(["Inventory", listingID], 100);
  }

  // Remove merchant's keycard to free up for customer
  localStorage.removeItem(`keycard${shopId}`);

  // Set up customer
  const { wrapper, stateManager, relayClient, testAccount } =
    await createRouterWrapper({
      shopId,
    });
  await relayClient.enrollKeycard(testClient, testAccount, true);
  await relayClient.connect();
  await relayClient.authenticate();
  stateManager.addConnection(relayClient);

  // Mint ERC20 tokens for test account if using ERC20
  if (currencyConfig.isContract) {
    // Check that tokens were minted successfully by verifying balance
    const balance = await testClient.readContract({
      address: currencyConfig.address,
      abi: abi.eddiesAbi,
      functionName: "balanceOf",
      args: [testAccount],
    });

    const neededAmount =
      BigInt(currencyConfig.expectedTotalAmount.split(" ")[0]) * 100n;

    if (balance < neededAmount) {
      // Mint enough tokens for the test account to cover the payment
      const transactionHash = await testClient.writeContract({
        address: currencyConfig.address,
        abi: abi.eddiesAbi,
        functionName: "mint",
        args: [testAccount, neededAmount],
        account: testAccount,
      });

      const receipt = await testClient.waitForTransactionReceipt({
        hash: transactionHash,
      });
      expect(receipt.status).toBe("success");

      console.info(
        "Minted ERC20 tokens for test account:",
        testAccount,
        neededAmount,
      );
    }
  }

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

  // Test cart contains correct items
  const { unmount: unmountCheckout } = render(<Checkout />, { wrapper });

  await screen.findByTestId("checkout-screen");
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
  await waitFor(() => {
    const outOfStockMsg = screen.getByTestId("out-of-stock");
    expect(outOfStockMsg).toBeTruthy();
    expect(outOfStockMsg.textContent).toContain(
      `Please reduce quantity or remove from cart to proceed.`,
    );
  });

  // Remove item and try to checkout again
  await act(async () => {
    const removeButton = screen.getByTestId("remove-item-23");
    expect(removeButton).toBeTruthy();
    await user.click(removeButton);
  });
  await act(async () => {
    const checkoutButton = screen.getByTestId("checkout-button");
    expect(checkoutButton).toBeTruthy();
    await user.click(checkoutButton);
  });

  const orderData = await stateManager.get(["Orders", orderId]);
  const o = Order.fromCBOR(orderData!);
  expect(o.State).toBe(OrderState.Committed);

  unmountCheckout();

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

  // Test input shipping details
  const { unmount: unmountShipping } = render(<ShippingDetails />, { wrapper });
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
  const updatedOrder = Order.fromCBOR(updatedOrderData!);
  expect(updatedOrder.InvoiceAddress).toBeDefined();
  expect(updatedOrder.ShippingAddress).toBeUndefined();
  expect(updatedOrder.InvoiceAddress).toEqual(testShippingDetails);
  unmountShipping();

  // Test choose payment
  const { unmount: unmountPayment } = render(<ChoosePayment />, { wrapper });
  const choosePayment = await screen.findByTestId("choose-payment");
  expect(choosePayment).toBeTruthy();

  await waitFor(() => {
    const paymentDetailsLoading = screen.getByTestId(
      "payment-details-loading",
    );
    expect(paymentDetailsLoading).toBeTruthy();
    expect(paymentDetailsLoading.classList.contains("hidden")).toBe(true);
    const displayedAmount = screen.getByTestId("total-price");
    expect(displayedAmount).toBeTruthy();
    expect(displayedAmount.textContent).toBe(
      currencyConfig.expectedTotalAmount,
    );
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

    // Verify amount is displayed with correct currency symbol
    const amountElement = screen.getByTestId("displayed-amount");
    expect(amountElement).toBeTruthy();
    expect(amountElement.textContent).toContain(
      currencyConfig.expectedTotalAmount,
    );
  });
  unmountPayment();

  return { stateManager, orderId };
}

Deno.test("Check that we can complete checkout with different currencies", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  for (const currencyConfig of CURRENCY_CONFIGS) {
    await t.step(
      `Cart checkout process with ${currencyConfig.name}`,
      async () => {
        await runCheckoutTest(currencyConfig);
      },
    );
  }

  cleanup();
});
