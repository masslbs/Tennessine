import "../../happyDomSetup.ts";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
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
  OrderState,
  ShippingRegion,
  ShippingRegionsMap,
} from "@massmarket/schema";
import { CodecKey, CodecValue } from "@massmarket/utils/codec";
import { testClient } from "../../testutils/mod.tsx";
import Checkout from "./Checkout.tsx";
import ShippingDetails from "./ShippingDetails.tsx";
import ChoosePayment from "./ChoosePayment.tsx";
import {
  createTestRelayClient,
  createTestStateManager,
  createWrapper,
  denoTestOptions,
  testAccount,
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

Deno.test(
  "Check that we can complete checkout with different currencies",
  denoTestOptions,
  testWrapper(async (shopId, t) => {
    const user = userEvent.setup();
    const orderId = randUint64();

    // Set up merchant. Enrolls keycard as merchant and sends authenticate request.
    const relayClient = await createTestRelayClient(shopId);
    const merchantStateManager = await createTestStateManager(shopId);
    await relayClient.connect();
    await relayClient.authenticate();
    merchantStateManager.addConnection(relayClient);

    // Set up customer. Enrolls keycard as guest.
    const customerRelayClient = await createTestRelayClient(shopId, true);
    const customerStateManager = await createTestStateManager(shopId);
    await customerRelayClient.connect();
    customerStateManager.addConnection(customerRelayClient);

    await t.step("Set shop manifest and add listings", async () => {
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
    });

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

      // Wait for listings to sync
      await waitFor(async () => {
        const storedListings = await customerStateManager.get([
          "Listings",
        ]) as Map<
          number,
          unknown
        >;
        expect(storedListings.size).toBe(allListings.size);
      });

      // Create order and add items
      const order = new Order(
        orderId,
        [
          new OrderedItem(23, 200), // Purposefully select more than inventory amount so we can test the error msg is displayed.
          new OrderedItem(42, 5),
        ],
        OrderState.Open,
      );
      await customerStateManager.set(["Orders", orderId], order);
    });

    await t.step("Cart is rendered with correct items", async () => {
      const wrapper = await createWrapper(shopId);
      const { unmount } = render(<Checkout />, { wrapper });
      const wantTotalPrice = "0.0635";

      await waitFor(() => {
        screen.findByTestId("checkout-screen");
        const titles = screen.getAllByTestId("listing-title");
        expect(titles).toHaveLength(2);
        expect(titles[0].textContent).toContain("test");
        expect(titles[1].textContent).toContain("test42");
        const selectedQty = screen.getAllByTestId("selected-qty");
        expect(selectedQty).toHaveLength(2);
        expect(selectedQty[0].textContent).toContain("200");
        expect(selectedQty[1].textContent).toContain("5");

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

      await waitFor(async () => {
        const orderData = await merchantStateManager.get(["Orders", orderId]);
        const o = Order.fromCBOR(orderData!);
        expect(o.State).toBe(OrderState.Committed);
      });

      unmount();
    });

    await t.step("Update shipping details.", async () => {
      const wrapper = await createWrapper(shopId);
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
        const submitShippingDetails = screen.getByTestId(
          "goto-payment-options",
        );
        await user.click(submitShippingDetails);
      });

      await waitFor(async () => {
        // Verify order details were saved correctly
        const updatedOrderData = await merchantStateManager.get([
          "Orders",
          orderId,
        ]);
        expect(updatedOrderData).toBeDefined();
        const updatedOrder = Order.fromCBOR(updatedOrderData!);
        expect(updatedOrder.InvoiceAddress).toBeDefined();
        expect(updatedOrder.ShippingAddress).toBeUndefined();
        expect(updatedOrder.InvoiceAddress).toEqual(testShippingDetails);
      });

      unmount();
    });

    // Helper to test payment with a given currency
    async function testPayWithCurrency(
      currencyConfig: CurrencyTestConfig,
      oId: number,
    ) {
      const wrapper = await createWrapper(shopId);
      const { unmount } = render(<ChoosePayment />, { wrapper });
      const choosePayment = screen.getByTestId("choose-payment");
      expect(choosePayment).toBeTruthy();

      await waitFor(() => {
        const paymentCurrency = screen.getByTestId("payment-currency");
        expect(paymentCurrency).toBeTruthy();
      });

      await act(async () => {
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
      });

      await waitFor(async () => {
        // Check that the ChosenCurrency event was successfully sent to relay and order now has PaymentDetails.
        const orderWithPaymentData = await merchantStateManager.get([
          "Orders",
          oId,
        ]);
        expect(orderWithPaymentData).toBeDefined();
        const orderWithPayment = Order.fromCBOR(orderWithPaymentData!);
        expect(orderWithPayment.ChosenCurrency).toBeDefined();
        expect(orderWithPayment.PaymentDetails).toBeDefined();
        expect(orderWithPayment.PaymentDetails!.Total).toBeGreaterThan(0);
      });
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
      });

      unmount();
    }

    await t.step("Pay with ETH", async () => {
      await testPayWithCurrency(ETH_CONFIG, orderId);
    });

    await t.step("Pay with EDD", async () => {
      // Create new order to checkout with EDD, since we already completed the first order with ETH.

      const orderId2 = randUint64();
      const order = new Order(
        orderId2,
        [
          new OrderedItem(42, 5),
        ],
        OrderState.Open,
      );

      await customerStateManager.set(["Orders", orderId2], order);
      await customerStateManager.set(
        ["Orders", orderId2, "State"],
        OrderState.Committed,
      );
      await customerStateManager.set(
        ["Orders", orderId2, "InvoiceAddress"],
        testShippingDetails,
      );

      await testPayWithCurrency(EDD_CONFIG, orderId2);
    });
    cleanup();
  }),
);
