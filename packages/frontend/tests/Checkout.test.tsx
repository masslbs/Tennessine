import React from "react";
import { describe, test, expect } from "vitest";
import { waitFor, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  getClient,
  MerchantsRender,
  getWallet,
  randomShopId,
} from "./test-utils";
import { createPublicClient, http } from "viem";
import CheckoutFlow from "@/app/checkout/page";
import { BlockchainClient } from "@massmarket/blockchain";
import { hardhat } from "viem/chains";

//TODO: Still need to fix this test
describe.skip("Checkout", async () => {
  const user = userEvent.setup();

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  const wallet = getWallet();
  const client = await getClient();

  const blockchain = new BlockchainClient(randomShopId);
  const transactionHash = await blockchain.createShop(wallet);
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: transactionHash,
  });

  test("Update shipping details and commit items.", async () => {
    expect(receipt.status).equals("success");
    const here = client.createNewRelayClient();
    console.log({ here });
    const res = await client.relayClient!.enrollKeycard(
      wallet,
      false,
      randomShopId,
      undefined,
    );
    await client.createStateManager();
    await client.sendMerchantSubscriptionRequest();
    // await client.stateManager.orders.create();
    MerchantsRender(<CheckoutFlow />, client);

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
    // await waitFor(
    //   async () => {
    //     //Payment option screen means commitOrder successfully went thru and we have all the payment details.
    //     const payment = await screen.findByTestId("paymentOptions");
    //     expect(payment).toBeTruthy();
    //     const o = await sm.orders.get(orderId);
    //     //choosePayment and paymentDetails properties should now exist on the order.
    //     expect(o.choosePayment).toBeTruthy();
    //     expect(o.paymentDetails).toBeTruthy();
    //     const copy = await screen.findByTestId("copyAddress");
    //     await user.click(copy);
    //     //Renders correct price and symbol.
    //     const displayedAmount = await screen.findByTestId("displayedAmount");
    //     expect(displayedAmount.textContent).toEqual("Send 65 ETH");

    //     //Make a payment
    //     const { total, shopSignature, ttl } = o.paymentDetails!;
    //     const { currency, payee } = o.choosePayment!;
    //     const zeros32Bytes = pad(zeroAddress, { size: 32 });

    //     const args = [
    //       currency.chainId,
    //       ttl,
    //       zeros32Bytes,
    //       zeroAddress,
    //       BigInt(total),
    //       payee.address,
    //       false, // is paymentendpoint?
    //       shopId,
    //       shopSignature,
    //     ];

    //     const hash = await wallet.writeContract({
    //       address: abi.addresses.Payments as Address,
    //       abi: abi.PaymentsByAddress,
    //       functionName: "payTokenPreApproved",
    //       args: [args],
    //     });
    //     const receipt = await publicClient.waitForTransactionReceipt({
    //       hash,
    //     });
    //     expect(receipt.status).toEqual("success");
    //   },
    //   { timeout: 10000 },
    // );
    // await waitFor(
    //   async () => {
    //     const o = await sm.orders.get(orderId);
    //     expect(o.txHash).toBeTruthy();
    //     const tx = await screen.findByTestId("txHash");

    //     expect(tx.textContent).toEqual(o.txHash);
    //   },
    //   { timeout: 10000 },
    // );
  });
});
