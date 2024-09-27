import React from "react";
import { describe, test, expect } from "vitest";
import { waitFor, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { zeroAddress, random32BytesHex } from "@massmarket/utils";
import { getStateManager, render, getWallet } from "./test-utils";
import { createPublicClient, http } from "viem";
import CheckoutFlow from "@/app/checkout/page";
import { BlockchainClient } from "@massmarket/blockchain";
import { hardhat } from "viem/chains";

describe("Checkout", async () => {
  const user = userEvent.setup();

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  const randomShopId = random32BytesHex();
  const wallet = getWallet();
  const sm = await getStateManager(true);
  const blockchain = new BlockchainClient(randomShopId);
  const transactionHash = await blockchain.createShop(wallet);
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: transactionHash,
  });
  let orderId: `0x${string}`;

  test("Display correct cart item values", async () => {
    await waitFor(async () => {
      expect(receipt.status).equals("success");

      await sm.keycards.addAddress(wallet.account.address);
      //@ts-expect-error FIXME
      await sm.client.enrollKeycard(wallet, false, randomShopId, undefined);
      await sm.manifest.create(
        {
          name: "New Shop",
          description: "New shopManifest",
        },
        randomShopId,
      );

      await sm.manifest.update({
        addAcceptedCurrencies: [
          {
            chainId: 31337,
            tokenAddr: zeroAddress,
          },
        ],
        setBaseCurrency: {
          chainId: 31337,
          tokenAddr: zeroAddress,
        },
        addPayee: {
          addr: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
          callAsContract: false,
          chainId: 31337,
          name: "default",
        },
      });
      const { id } = await sm.items.create({
        price: "12.00",
        metadata: {
          title: "Cart testing Product I",
          description: "Test description I",
          image: "https://http.cat/images/201.jpg",
        },
      });
      const { id: id2 } = await sm.items.create({
        price: "5.00",
        metadata: {
          title: "Cart testing Product II",
          description: "Test description II",
          image: "https://http.cat/images/201.jpg",
        },
      });
      const order = await sm.orders.create();
      orderId = order.id;
      await sm.items.changeStock([id, id2], [100, 100]);
      await sm.orders.changeItems(orderId, id, 5);
      await sm.orders.changeItems(orderId, id2, 1);
      render(<CheckoutFlow />, sm, orderId);
    });

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
  test("Update shipping details", async () => {
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
        // payment option screen means commitOrder successfully went thru and we have all the payment details.
        const payment = await screen.findByTestId("paymentOptions");
        expect(payment).toBeTruthy;

        const o = await sm.orders.get(orderId);
        expect(o.orderFinalized).toBeTruthy;
        const copy = await screen.findByTestId("copyAddress");
        await user.click(copy);
        const erc20Amount = await screen.findByTestId("erc20Amount");
        console.log("displayedValue", erc20Amount.textContent);
      },
      { timeout: 10000 },
    );
  });
});
