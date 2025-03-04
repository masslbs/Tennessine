// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { ConnectButton, useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { privateKeyToAccount } from "viem/accounts";
import { useAccount, useConfig, usePublicClient, useWalletClient } from "wagmi";
import { simulateContract } from "@wagmi/core";

import {
  addRelay,
  checkPermissions,
  mintShop,
  setTokenURI,
} from "@massmarket/blockchain";
import {
  assert,
  getWindowLocation,
  logger,
  random256BigInt,
} from "@massmarket/utils";
import * as abi from "@massmarket/contracts";

import ManifestForm from "./ManifestForm.tsx";
import Confirmation from "./CreateShopConfirmation.tsx";
import ErrorMessage from "../../common/ErrorMessage.tsx";
import Button from "../../common/Button.tsx";
import LoadingSpinner from "../../common/LoadingSpinner.tsx";
import ConnectWalletButton from "../../common/ConnectWalletButton.tsx";
import { useClientWithStateManager } from "../../../hooks/useClientWithStateManager.ts";
import { useShopId } from "../../../hooks/useShopId.ts";
import { useKeycard } from "../../../hooks/useKeycard.ts";
import { useShopDetails } from "../../../hooks/useShopDetails.ts";
import { useChain } from "../../../hooks/useChain.ts";
import { CreateShopStep, ShopCurrencies, ShopForm } from "../../../types.ts";
import { removeCachedKeycards } from "../../../utils/mod.ts";

// When create shop CTA is clicked, these functions are called:
// 1. mintShop
// 2. enrollConnectAuthenticate
// 3. createShopManifest
// 4. uploadMetadata

const namespace = "frontend: CreateShop";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

export default function () {
  const addRecentTransaction = useAddRecentTransaction();
  const { status } = useAccount();
  const { chain } = useChain();
  const shopPublicClient = usePublicClient({ chainId: chain.id });
  const { data: wallet } = useWalletClient();
  const { shopId } = useShopId();
  const { setShopDetails } = useShopDetails();

  // Set skipConnect to true so that useQuery does not try to connect and authenticate before enrolling the keycard.
  const { clientStateManager } = useClientWithStateManager(true);
  const [keycard, setKeycard] = useKeycard();
  const { connector } = useAccount();
  const config = useConfig();

  const navigate = useNavigate({ from: "/create-shop" });
  const search = useSearch({ from: "/create-shop" });

  const [step, setStep] = useState<
    CreateShopStep
  >(CreateShopStep.ManifestForm);

  const [shopInputData, setShopInput] = useState<ShopForm>({
    shopName: "",
    description: "",
    avatar: null,
    payees: [{
      address: wallet?.account.address || null,
      chainId: wallet?.chain.id || chain.id,
      name: "default",
      callAsContract: false,
    }],
    pricingCurrency: { address: abi.addresses.zeroAddress, chainId: chain.id },
    acceptedCurrencies: [],
  });

  const [storeRegistrationStatus, setStoreRegistrationStatus] = useState<
    string
  >("");
  const [mintedHash, setMintedHash] = useState<string | null>(null);
  const [creatingShop, setCreatingShop] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!search.shopId) {
      const newShopId = random256BigInt();
      navigate({ search: { shopId: `0x${newShopId.toString(16)}` } });
    }
    return () => {
      // If user exits before creating shop, remove keycard from local storage.
      removeCachedKeycards();
    };
  }, []);

  useEffect(() => {
    if (wallet?.account) {
      setShopInput({
        ...shopInputData,
        payees: [{
          address: wallet.account.address,
          chainId: chain.id,
          name: "default",
          callAsContract: false,
        }],
      });
    }
  }, [wallet]);

  async function mint() {
    debug(`creating shop for ${shopId}`);
    setStoreRegistrationStatus("Minting shop...");
    setCreatingShop(true);
    try {
      if (!shopPublicClient) {
        throw new Error("shopPublicClient not found");
      }
      // This will throw error if simulate fails.
      await simulateContract(config, {
        abi: abi.shopRegAbi,
        address: abi.addresses.ShopReg,
        functionName: "mint",
        args: [shopId!, wallet!.account.address],
        connector,
      });

      const hash = await mintShop(wallet!, [shopId!, wallet!.account.address]);
      debug(`Mint hash: ${hash}`);

      addRecentTransaction({
        hash,
        description: "Mint Shop",
        // confirmations: 2,
      });
      setMintedHash(hash);
      setStoreRegistrationStatus("Waiting to confirm mint transaction...");
      let receipt = await shopPublicClient!.waitForTransactionReceipt({
        hash,
        // confirmations: 2,
        retryCount: 5,
      });
      if (receipt!.status !== "success") {
        throw new Error("Mint shop: transaction failed");
      }

      setStoreRegistrationStatus("Adding relay token ID...");
      // Add relay tokenId for event verification.
      const tx = await addRelay(wallet!, [
        shopId!,
        clientStateManager!.relayClient.relayEndpoint.tokenId,
      ]);
      debug(
        `Added relay token ID:${
          clientStateManager!.relayClient.relayEndpoint.tokenId
        }`,
      );
      receipt = await shopPublicClient!.waitForTransactionReceipt({
        hash: tx,
        // confirmations: 2,
        retryCount: 5,
      });
      if (receipt.status !== "success") {
        throw new Error("Error: addRelay");
      }
    } catch (err: unknown) {
      assert(err instanceof Error, "Error is not an instance of Error");
      errlog("Error minting store", err);
      setErrorMsg(`Error minting store`);
      return;
    }

    await enrollConnectAuthenticate();
  }

  async function enrollConnectAuthenticate() {
    setStoreRegistrationStatus("Checking permissions...");
    try {
      const hasAccess = await checkPermissions(shopPublicClient!, [
        shopId!,
        wallet!.account.address,
        abi.permissions.updateRootHash,
      ]);
      if (!hasAccess) {
        throw new Error("Access denied.");
      }
      setStoreRegistrationStatus("Enrolling keycard...");

      const res = await clientStateManager!.relayClient.enrollKeycard(
        wallet,
        false,
        shopId!,
        getWindowLocation(),
      );
      //set keycard role to merchant
      setKeycard({ ...keycard, role: "merchant" });
      if (!res.ok) {
        throw Error("Failed to enroll keycard");
      }

      // Connect & authenticate
      setStoreRegistrationStatus(
        "Connecting and authenticating Relay Client...",
      );
      await clientStateManager!.connectAndAuthenticate();

      // Add address of current kc wallet for all outgoing event verification.
      const keyCardWallet = privateKeyToAccount(keycard.privateKey);
      await clientStateManager!.stateManager.keycards.addAddress(
        keyCardWallet.address.toLowerCase() as `0x${string}`,
      );

      debug(
        `keycard wallet address added: ${keyCardWallet.address.toLowerCase()}`,
      );
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("enrollConnectAuthenticate failed", error);
      setErrorMsg("Error connecting to client");
      return;
    }
    await createShopManifest();
  }

  async function createShopManifest() {
    try {
      await clientStateManager!.sendMerchantSubscriptionRequest();
      debug("Sent merchant subscription request");

      const uniqueByChainId = [
        ...new Set(
          shopInputData.acceptedCurrencies.map((cur: ShopCurrencies) =>
            cur.chainId
          ),
        ),
      ];
      // Get all unique chain IDs for selected accepted currencies and add payee for each chain.
      const payees = uniqueByChainId.map((chainId) => {
        return {
          address: shopInputData.payees[0].address,
          callAsContract: false,
          chainId,
          name: `default - ${chainId}`,
        };
      });
      await clientStateManager!.stateManager!.manifest.create(
        {
          pricingCurrency: shopInputData.pricingCurrency as ShopCurrencies,
          acceptedCurrencies: shopInputData.acceptedCurrencies,
          payees,
          //TODO: UI for inputting shipping regions.
          shippingRegions: [
            {
              name: "default",
              country: "",
              postalCode: "",
              city: "",
              orderPriceModifiers: [],
            },
          ],
        },
        shopId!,
      );
      debug("Manifest created");
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error creating shop manifest", error);
      setErrorMsg("Error creating shop manifest");
      return;
    }

    await uploadMetadata();
  }

  async function uploadMetadata() {
    setStoreRegistrationStatus("Setting shop metadata...");
    try {
      const imgPath = shopInputData.avatar
        ? await clientStateManager!.relayClient!.uploadBlob(
          shopInputData.avatar as FormData,
        )
        : { url: null };
      const metadata = {
        name: shopInputData.shopName,
        description: shopInputData.description,
        image: imgPath.url,
      };
      const jsn = JSON.stringify(metadata);
      const blob = new Blob([jsn], { type: "application/json" });
      const file = new File([blob], "file.json");
      const formData = new FormData();
      formData.append("file", file);
      const metadataPath = await clientStateManager!.relayClient!.uploadBlob(
        formData,
      );

      //Write shop metadata to blockchain client.
      const metadataHash = await setTokenURI(wallet!, [
        shopId!,
        metadataPath.url,
      ]);

      const transaction = await shopPublicClient!.waitForTransactionReceipt({
        hash: metadataHash,
        retryCount: 10,
      });

      if (transaction.status !== "success") {
        throw new Error("Error: setShopMetadataURI");
      }

      setShopDetails({
        name: shopInputData.shopName,
        profilePictureUrl: imgPath.url,
      });

      debug("Shop created");
      setCreatingShop(false);
      setStep(CreateShopStep.Confirmation);
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error uploading metadata", error);
      setErrorMsg("Error uploading metadata");
    }
  }

  function renderContent() {
    if (step === CreateShopStep.ManifestForm) {
      return (
        <ManifestForm
          shopInputData={shopInputData}
          setShopInput={setShopInput}
          setStep={setStep}
        />
      );
    } else if (step === CreateShopStep.ConnectWallet) {
      return (
        <section
          className="md:w-[560px]"
          data-testid="connect-wallet-screen"
        >
          <ErrorMessage
            errorMessage={errorMsg}
            onClose={() => {
              setErrorMsg(null);
            }}
          />
          <h1>Connect your wallet</h1>
          <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
            {status === "connected"
              ? (
                <div className="flex flex-col gap-4">
                  <ConnectButton chainStatus="name" />
                  <p>{storeRegistrationStatus}</p>
                  {mintedHash && (
                    <a
                      href={`${
                        shopPublicClient!.chain.blockExplorers?.default?.url
                      }/tx/${mintedHash}`}
                    >
                      View TX
                    </a>
                  )}
                  {creatingShop
                    ? <LoadingSpinner />
                    : (
                      <Button onClick={mint} disabled={!wallet || !shopId}>
                        <h6>Mint Shop</h6>
                      </Button>
                    )}
                </div>
              )
              : <ConnectWalletButton />}
          </section>
        </section>
      );
    } else if (step === CreateShopStep.Confirmation) {
      return <Confirmation />;
    }
  }

  return (
    <main
      className="p-4 pt-under-nav flex justify-center"
      data-testid="create-shop-screen"
    >
      {renderContent()}
    </main>
  );
}
