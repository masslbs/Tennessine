import React from "react";
import { describe, test, expect } from "vitest";
import { waitFor, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { zeroAddress, random32BytesHex, anvilAddress } from "@massmarket/utils";
import { getStateManager, render, getWallet } from "./test-utils";
import { createPublicClient, http, pad, Address } from "viem";
import CheckoutFlow from "@/app/checkout/page";
import { BlockchainClient } from "@massmarket/blockchain";
import { hardhat } from "viem/chains";
import * as abi from "@massmarket/contracts";

describe("Checkout", async () => {
  const user = userEvent.setup();

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  const shopId = random32BytesHex();
  const wallet = getWallet();
  const sm = await getStateManager(true);
  const blockchain = new BlockchainClient(shopId);
  const transactionHash = await blockchain.createShop(wallet);
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: transactionHash,
  });
  let orderId: `0x${string}`;

  test("Renders correct amount", async () => {
    expect(receipt.status).equals("success");
    await sm.keycards.addAddress(wallet.account.address);
    //@ts-expect-error FIXME
    await sm.client.enrollKeycard(wallet, false, shopId, undefined);
    await sm.client.connect();
    await sm.client.authenticate();

    await sm.client.sendMerchantSubscriptionRequest(shopId);

    await sm.manifest.create(
      {
        acceptedCurrencies: [
          {
            chainId: 31337,
            address: zeroAddress,
          },
        ],
        pricingCurrency: {
          chainId: 31337,
          address: zeroAddress,
        },
        payees: [
          {
            address: anvilAddress,
            callAsContract: false,
            chainId: 31337,
            name: "default",
          },
        ],
        shippingRegions: [
          {
            name: "test",
            country: "California",
            postalCode: "91011",
            city: "Los Angeles",
            orderPriceModifiers: [],
          },
        ],
      },
      shopId,
    );

    const { id } = await sm.items.create({
      price: "12.00",
      metadata: {
        title: "Cart testing Product I",
        description: "Test description I",
        images: ["https://http.cat/images/201.jpg"],
      },
    });
    const { id: id2 } = await sm.items.create({
      price: "5.00",
      metadata: {
        title: "Cart testing Product II",
        description: "Test description II",
        images: ["https://http.cat/images/201.jpg"],
      },
    });
    const order = await sm.orders.create();
    orderId = order.id;
    await sm.items.changeInventory(id, 100);
    await sm.items.changeInventory(id2, 100);

    await sm.orders.addsItems(order.id, id, 5);
    await sm.orders.addsItems(order.id, id2, 1);
    render(<CheckoutFlow />, sm, orderId);

    await waitFor(async () => {
      const p = await screen.findAllByTestId("title");
      const total = await screen.findByTestId("total");
      const symbol = await screen.findByTestId("symbol");
      expect(p.length).toEqual(2);
      expect(total.textContent).toEqual("65");
      // Since we set our base currency as ETH, this checks that getTokenInformation fn is correct.
      expect(symbol.textContent).toEqual("ETH");
    });
  });

  test("Update shipping details and commit items.", async () => {
    render(<CheckoutFlow />, sm, orderId);

    await act(async () => {
      const proceed = screen.getByRole("button", { name: /proceed/i });
      await user.click(proceed);
    });
    await waitFor(async () => {
      const nameInput = screen.getByTestId("name");
      const addressInput = screen.getByTestId("address");
      const cityInput = screen.getByTestId("city");
      const zipInput = screen.getByTestId("zip");
      const countryInput = screen.getByTestId("country");
      const phoneInput = screen.getByTestId("phone");

      await user.type(nameInput, "First Last");
      await user.type(addressInput, "111 fakeAddress");
      await user.type(cityInput, "Los Angeles");
      await user.type(zipInput, "91011");
      await user.type(countryInput, "California");
      await user.type(phoneInput, "123456789");
    });
    await act(async () => {
      const checkout = screen.getByRole("button", { name: /checkout/i });
      await user.click(checkout);
    });
    await waitFor(
      async () => {
        //Payment option screen means commitOrder successfully went thru and we have all the payment details.
        const payment = await screen.findByTestId("paymentOptions");
        expect(payment).toBeTruthy();
        const o = await sm.orders.get(orderId);
        //choosePayment and paymentDetails properties should now exist on the order.
        expect(o.choosePayment).toBeTruthy();
        expect(o.paymentDetails).toBeTruthy();
        const copy = await screen.findByTestId("copyAddress");
        await user.click(copy);
        //Renders correct price and symbol.
        const erc20Amount = await screen.findByTestId("erc20Amount");
        expect(erc20Amount.textContent).toEqual("Send 65 ETH");

        //Make a payment
        const { total, shopSignature, ttl } = o.paymentDetails!;
        const { currency, payee } = o.choosePayment!;
        const zeros32Bytes = pad(zeroAddress, { size: 32 });

        const args = [
          currency.chainId,
          ttl,
          zeros32Bytes,
          zeroAddress,
          BigInt(total),
          payee.address,
          false, // is paymentendpoint?
          shopId,
          shopSignature,
        ];

        const hash = await wallet.writeContract({
          address: abi.addresses.Payments as Address,
          abi: abi.PaymentsByAddress,
          functionName: "payTokenPreApproved",
          args: [args],
        });
        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
        });
        expect(receipt.status).toEqual("success");
      },
      { timeout: 10000 },
    );
    await waitFor(
      async () => {
        const o = await sm.orders.get(orderId);
        expect(o.txHash).toBeTruthy();
        const tx = await screen.findByTestId("txHash");

        expect(tx.textContent).toEqual(o.txHash);
      },
      { timeout: 10000 },
    );
  });
});
