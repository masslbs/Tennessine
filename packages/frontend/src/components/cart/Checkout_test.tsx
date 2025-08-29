import "../../happyDomSetup.ts";
import React, { useEffect, useState } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect } from "@std/expect";
import { fromHex, hexToBytes, zeroAddress } from "viem";
import { abi } from "@massmarket/contracts";
import "@massmarket/utils/logger";

import { randUint64 } from "@massmarket/utils";
import { allListings } from "@massmarket/schema/testFixtures";
import {
  AddressDetails,
  ChainAddress,
  Manifest,
  Order,
  OrderedItem,
  OrderPaymentState,
  ShippingRegion,
  ShippingRegionsMap,
} from "@massmarket/schema";
import { CodecKey, CodecValue } from "@massmarket/utils/codec";
import { useStateManager } from "@massmarket/react-hooks";

import ShippingDetails from "./ShippingDetails.tsx";
import ChoosePayment from "./ChoosePayment.tsx";
import {
  createTestRelayClient,
  createTestStateManager,
  createWrapper,
  denoTestOptions,
  testAccount,
  testClient,
  testWrapper,
} from "../../testutils/_createWrapper.tsx";

// Define currency types for testing
type CurrencyTestConfig = {
  name: string;
  address: `0x${string}`;
  expectedSymbol: string;
  isContract: boolean;
  expectedTotalAmount: string; // Expected displayed amount for this currency
};

const ETH_CONFIG: CurrencyTestConfig = {
  name: "ETH",
  address: zeroAddress,
  expectedSymbol: "ETH",
  isContract: false,
  expectedTotalAmount: "0.0035 ETH",
};

const EDD_CONFIG: CurrencyTestConfig = {
  name: "ERC20 (EDD)",
  address: abi.eddiesAddress as `0x${string}`,
  expectedSymbol: "EDD",
  isContract: true,
  expectedTotalAmount: "5.25 EDD", // EDD has 2 decimals
};

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
const orderId1 = randUint64();

async function setShopManifestAndListings(shopId: bigint) {
  const relayClient = await createTestRelayClient(shopId);
  const merchantStateManager = await createTestStateManager(shopId);
  await relayClient.connect();
  await relayClient.authenticate();
  merchantStateManager.addConnection(relayClient);
  // Wait for manifest to sync
  await waitFor(async () => {
    const manifest = await merchantStateManager.get(["Manifest"]);
    expect(manifest).toBeDefined();
    const manifestObj = Manifest.fromCBOR(
      manifest as Map<CodecKey, CodecValue>,
    );
    expect(manifestObj.ShopID).toBe(shopId);
  });

  // Add manifest data with the test currency
  const testCurrencyETH = new ChainAddress(
    31337,
    hexToBytes(ETH_CONFIG.address),
  );

  const testCurrencyEDD = new ChainAddress(
    31337,
    hexToBytes(EDD_CONFIG.address),
  );

  const currentManifestMap = await merchantStateManager.get(["Manifest"]);
  if (!currentManifestMap) {
    throw new Error("Manifest not found");
  }
  const currentManifest = Manifest.fromCBOR(currentManifestMap);

  // Add ETH
  currentManifest.AcceptedCurrencies.addAddress(
    testCurrencyETH.ChainID,
    testCurrencyETH.Address,
    ETH_CONFIG.isContract,
  );
  currentManifest.Payees.addAddress(
    testCurrencyETH.ChainID,
    fromHex(testAccount, { size: 20, to: "bytes" }),
    false,
  );
  // Add EDD
  currentManifest.AcceptedCurrencies.addAddress(
    testCurrencyEDD.ChainID,
    testCurrencyEDD.Address,
    EDD_CONFIG.isContract,
  );
  currentManifest.Payees.addAddress(
    testCurrencyEDD.ChainID,
    fromHex(testAccount, { size: 20, to: "bytes" }),
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
    // Increase price of the test items to make sure we get more then a cent in EDD
    if (listingID === 23) {
      listing.Price = 300000000000000n;
    } else if (listingID === 42) {
      listing.Price = 700000000000000n;
    }
    await merchantStateManager.set(["Listings", listingID], listing);
    await merchantStateManager.set(["Inventory", listingID], 100);
  }

  return { relayClient, merchantStateManager };
}

Deno.test(
  "Checkout - Update Shipping Details",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    const user = userEvent.setup();
    const { merchantStateManager } = await setShopManifestAndListings(shopId);

    await t.step("Update shipping details.", async () => {
      const wrapper = createWrapper(shopId);
      const { unmount } = render(<ShippingDetailsTest />, { wrapper });
      await waitFor(() => {
        const shippingScreen = screen.getByTestId(
          "shipping-details",
        ) as HTMLElement;
        expect(shippingScreen).toBeTruthy();
      });

      // Fill in all shipping details fields
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

      const submitShippingDetails = screen.getByTestId(
        "goto-payment-options",
      );
      await user.click(submitShippingDetails);

      await waitFor(async () => {
        // Verify order details were saved correctly
        const updatedOrderData = await merchantStateManager.get([
          "Orders",
          orderId1,
        ]);
        expect(updatedOrderData).toBeDefined();
        const updatedOrder = Order.fromCBOR(updatedOrderData!);
        expect(updatedOrder.InvoiceAddress).toBeDefined();
        expect(updatedOrder.ShippingAddress).toBeUndefined();
        expect(updatedOrder.InvoiceAddress).toEqual(testShippingDetails);
      });

      unmount();
    });
    cleanup();
  }),
);

// Helper fn to test ETH and ERC20 payment
async function testPayWithCurrency(
  currencyConfig: CurrencyTestConfig,
  orderId: number,
  shopId: bigint,
) {
  const { merchantStateManager } = await setShopManifestAndListings(shopId);
  const user = userEvent.setup();
  await waitFor(() => {
    const choosePayment = screen.getByTestId("choose-payment");
    expect(choosePayment).toBeTruthy();
  });

  const paymentCurrency = screen.getByTestId("payment-currency-dropdown");
  expect(paymentCurrency).toBeTruthy();
  const selectElement = paymentCurrency.querySelector("select");
  expect(selectElement).toBeTruthy();
  await user.selectOptions(
    selectElement as HTMLSelectElement,
    `${currencyConfig.expectedSymbol}/Hardhat`,
  );
  // First verify the selection was made in the UI
  expect((selectElement as HTMLSelectElement).value).toBe(
    `${currencyConfig.expectedSymbol}/Hardhat`,
  );
  console.log("Checkout Test: User selected currency");
  await waitFor(async () => {
    // Check that the ChosenCurrency event was successfully sent to relay and order now has PaymentDetails.
    const orderWithPaymentData = await merchantStateManager.get([
      "Orders",
      orderId,
    ]);
    expect(orderWithPaymentData).toBeDefined();
    const orderWithPayment = Order.fromCBOR(orderWithPaymentData!);
    expect(orderWithPayment.ChosenCurrency).toBeDefined();
    expect(orderWithPayment.PaymentDetails).toBeDefined();
    expect(orderWithPayment.PaymentDetails!.Total).toBeGreaterThan(0);
  }, { timeout: 10000 });
  console.log("Checkout Test: Order now has PaymentDetails");

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
  console.log("Checkout Test: Displayed amount is correct");

  // Connect wallet and initiate payment
  const connectWalletButton = screen.getByTestId(
    "rainbowkit-connect-wallet",
  );
  expect(connectWalletButton).toBeTruthy();
  await user.click(connectWalletButton);
  let payButton: HTMLElement | null = null;
  await waitFor(() => {
    // Wait for the Pay button to appear after wallet connection
    payButton = screen.getByRole("button", {
      name: /Pay/i,
    });
    expect(payButton).toBeTruthy();
  });

  expect(payButton).toBeTruthy();
  await user.click(payButton!);

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
  console.log("Checkout Test: Waiting for transaction...");

  // Check payment confirmation screen
  await waitFor(() => {
    // Check for payment confirmation screen
    const successMessage = screen.getByText("Payment Successful");
    expect(successMessage).toBeTruthy();

    // // Verify the transaction hash is displayed
    const txHashInput = screen.getByTestId("tx-hash-input");
    expect(txHashInput).toBeTruthy();
    expect((txHashInput as HTMLInputElement).value).toContain("0x");
    // Verify amount is displayed with correct currency symbol
    const amountElement = screen.getByTestId("displayed-amount");
    expect(amountElement).toBeTruthy();
    expect(amountElement.textContent).toContain(
      currencyConfig.expectedTotalAmount,
    );
  }, { timeout: 10000 });
}

Deno.test(
  "Checkout - Choose Payment ETH",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    await t.step("Pay with ETH", async () => {
      const orderId = randUint64();
      const ChoosePaymentTest = createTestComponent(
        ChoosePayment,
        orderId,
      );
      const wrapper = createWrapper(shopId);
      const { unmount } = render(<ChoosePaymentTest />, { wrapper });
      await testPayWithCurrency(ETH_CONFIG, orderId, shopId);
      unmount();
    });
    cleanup();
  }),
);

Deno.test(
  "Checkout - Choose Payment EDD",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    await t.step("Mint ERC20 and add order.", async () => {
      const balance = await testClient.readContract({
        address: EDD_CONFIG.address,
        abi: abi.eddiesAbi,
        functionName: "balanceOf",
        args: [testAccount],
      });

      const neededAmount = 525n;

      if (balance < neededAmount) {
        // Mint enough tokens for the test account to cover the payment
        const transactionHash = await testClient.writeContract({
          address: EDD_CONFIG.address,
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
    });
    await t.step("Pay with EDD", async () => {
      const orderId = randUint64();
      const ChoosePaymentTest = createTestComponent(
        ChoosePayment,
        orderId,
      );
      const wrapper = createWrapper(shopId);
      const { unmount } = render(<ChoosePaymentTest />, { wrapper });
      await testPayWithCurrency(EDD_CONFIG, orderId, shopId);
      unmount();
    });
    cleanup();
  }),
);

const createTestComponent = (
  Component: React.ComponentType,
  orderId: number,
) => {
  return () => {
    const { stateManager } = useStateManager();
    const [listingsLoaded, setLoading] = useState<boolean>(
      false,
    );
    useEffect(() => {
      if (!stateManager) return;

      stateManager.get(["Listings"]).then(
        (listings: CodecValue | undefined) => {
          if (listings instanceof Map) {
            setLoading(!!listings.size);
          }
        },
      );
      stateManager.events.on((listings: CodecValue | undefined) => {
        if (listings instanceof Map) {
          setLoading(!!listings.size);
        }
      }, ["Listings"]);
    }, [stateManager]);

    useEffect(() => {
      if (!stateManager || !listingsLoaded) return;
      // Create order and add items

      const order = new Order(
        orderId,
        [
          new OrderedItem(42, 5),
        ],
        OrderPaymentState.Open,
      );
      stateManager.set(["Orders", orderId], order).then(() => {
        stateManager.set(
          ["Orders", orderId, "PaymentState"],
          OrderPaymentState.Locked,
        );
      });
      stateManager.set(
        ["Orders", orderId, "InvoiceAddress"],
        testShippingDetails,
      );
    }, [listingsLoaded]);

    return <Component />;
  };
};

const ShippingDetailsTest = createTestComponent(
  ShippingDetails,
  orderId1,
);
