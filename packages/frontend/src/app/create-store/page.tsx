// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import debugLib from "debug";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { privateKeyToAccount } from "viem/accounts";
import { useChains, useAccount } from "wagmi";

import { BlockchainClient } from "@massmarket/blockchain";
import { random32BytesHex, zeroAddress } from "@massmarket/utils";

import AvatarUpload from "@/app/common/components/AvatarUpload";
import Button from "@/app/common/components/Button";
import Dropdown from "@/app/common/components/CurrencyDropdown";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import { ConnectWalletButton } from "@/app/common/components/ConnectWalletButton";
import { getTokenAddress, isValidHex } from "@/app/utils";
import ValidationWarning from "@/app/common/components/ValidationWarning";
import { useAuth } from "@/context/AuthContext";
import { useStoreContext } from "@/context/StoreContext";
import { useUserContext } from "@/context/UserContext";
import { CurrencyChainOption, Payee, ShopCurrencies, Status } from "@/types";

import Confirmation from "./Confirmation";
import { ClientWithStateManager } from "@/app/ClientWithStateManager";

// When create shop CTA is clicked, these functions are called:
// 1. mintShop
// 2. enrollConnectAuthenticate
// 3. createShopManifest
// 4. uploadMetadata

const debug = debugLib("frontend:create-store");
const log = debugLib("log:create-store");
log.color = "242";

const StoreCreation = () => {
  const {
    shopPublicClient,
    clientWallet,
    shopId,
    relayEndpoint,
    setShopId,
    checkPermissions,
    setClientStateManager,
  } = useUserContext();

  const { setShopDetails } = useStoreContext();
  const { setIsConnected, setIsMerchantView } = useAuth();
  const chains = useChains();
  const { status } = useAccount();

  const [step, setStep] = useState<
    "manifest form" | "connect wallet" | "confirmation"
  >("manifest form");
  const [storeName, setStoreName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [avatar, setAvatar] = useState<FormData | null>(null);
  const [pricingCurrency, setPricingCurrency] = useState<
    Partial<ShopCurrencies>
  >({ address: zeroAddress });
  const [acceptedCurrencies, setAcceptedCurrencies] = useState<
    ShopCurrencies[]
  >([]);
  const [payeeChain, setPayeeChain] = useState<number | null>(null);
  const [payeeAddress, setPayeeAddress] = useState<`0x${string}` | null>(
    clientWallet?.account.address || null,
  );
  const enrollKeycard = useRef(false);
  const randomShopIdHasBeenSet = useRef(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [storeRegistrationStatus, setStoreRegistrationStatus] =
    useState<string>("");

  useEffect(() => {
    if (clientWallet?.account) {
      setPayeeAddress(clientWallet.account.address);
    }
  }, [clientWallet]);

  useEffect(() => {
    if (!randomShopIdHasBeenSet.current) {
      localStorage.removeItem("merchantKC");
      localStorage.removeItem("guestKeyCard");

      randomShopIdHasBeenSet.current = true;
      const randomShopId = random32BytesHex();
      setIsConnected(Status.Pending);
      setShopId(randomShopId);
    }
    return () => {
      randomShopIdHasBeenSet.current = false;
    };
  }, []);

  async function handleAcceptedCurrencies(e: ChangeEvent<HTMLInputElement>) {
    const [sym, chainId] = e.target.value.split("/");
    const address = getTokenAddress(sym, chainId);

    if (e.target.checked) {
      setAcceptedCurrencies([
        ...acceptedCurrencies,
        { address, chainId: Number(chainId) },
      ]);
    } else {
      setAcceptedCurrencies(
        acceptedCurrencies.filter(
          (c) => c.chainId !== Number(chainId) || c.address !== address,
        ),
      );
    }
  }

  async function handlePricingCurrency(option: CurrencyChainOption) {
    const v = option.value as string;
    const [sym, chainId] = v.split("/");
    const address = getTokenAddress(sym, chainId);
    setPricingCurrency({ address, chainId: Number(chainId) });
  }

  function checkRequiredFields() {
    if (!payeeAddress) {
      return "Payee address is required.";
    } else if (!payeeChain) {
      return "Payee chain is required.";
    } else if (!pricingCurrency?.address) {
      return "Pricing currency address is required.";
    } else if (!pricingCurrency?.chainId) {
      return "Pricing currency chain is required.";
    }

    const isTokenAddrHex = isValidHex(pricingCurrency.address);
    const isPayeeAddHex = isValidHex(payeeAddress);

    if (!isTokenAddrHex) {
      return "Token address must be a valid hex value";
    } else if (!storeName.length) {
      return "Store name is required";
    } else if (!description.length) {
      return "Store description is required";
    } else if (!isPayeeAddHex) {
      return "Payee Address must be a valid hex value";
    }
    return null;
  }

  function goToConnectWallet() {
    const warning = checkRequiredFields();
    if (warning) {
      setValidationError(warning);
      throw Error(`Check all required fields:${warning}`);
    } else {
      setValidationError(null);
    }
    setStep("connect wallet");
  }

  async function mintShop() {
    log(`creating shop for ${shopId}`);
    setStoreRegistrationStatus("Minting shop...");
    let clientStateManager;
    try {
      if (enrollKeycard.current) {
        throw new Error("Keycard already enrolled");
      }
      clientStateManager = new ClientWithStateManager(
        shopPublicClient!,
        shopId!,
        relayEndpoint!,
      );
      setClientStateManager(clientStateManager);

      const rc = clientStateManager.createNewRelayClient();
      const blockchainClient = new BlockchainClient(shopId!);
      const hash = await blockchainClient.createShop(clientWallet!);
      setStoreRegistrationStatus("Waiting to confirm mint transaction...");
      const transaction = await shopPublicClient!.waitForTransactionReceipt({
        hash,
        retryCount: 10,
      });

      if (transaction!.status !== "success") {
        throw new Error("Mint shop: transaction failed");
      }
      localStorage.setItem("shopId", shopId!);

      setStoreRegistrationStatus("Adding relay token ID...");
      // Add relay tokenId for event verification.
      const tx = await blockchainClient.addRelay(
        clientWallet!,
        rc.relayEndpoint.tokenId,
      );
      log(`Added relay token ID:${rc.relayEndpoint.tokenId}`);
      const receipt = await shopPublicClient!.waitForTransactionReceipt({
        hash: tx,
      });
      if (receipt.status !== "success") {
        throw new Error("Error: addRelay");
      }
    } catch (err) {
      setErrorMsg(`Error minting store ${err}`);
      debug(`Error: mintShop:`, err);
    }

    await enrollConnectAuthenticate(clientStateManager!);
  }

  async function enrollConnectAuthenticate(client: ClientWithStateManager) {
    setStoreRegistrationStatus("Checking permissions...");
    try {
      const hasAccess = await checkPermissions();
      if (!hasAccess) {
        throw new Error("Access denied.");
      }
      setStoreRegistrationStatus("Enrolling keycard...");
      const res = await client.relayClient!.enrollKeycard(
        clientWallet!,
        false,
        shopId!,
        process.env.TEST ? undefined : new URL(window.location.href),
      );
      if (!res.ok) {
        throw Error("Failed to enroll keycard");
      }
      enrollKeycard.current = true;
      // Replace keyCardToEnroll to merchantKC for future refreshes
      const keycard = localStorage.getItem("keyCardToEnroll") as `0x${string}`;
      localStorage.setItem("merchantKC", keycard);
      localStorage.removeItem("keyCardToEnroll");

      // FIXME: for now we are instantiating sm after kc enroll. The reason is because we want to create a unique db name based on keycard.
      // TODO: see if it would be cleaner to pass the KC as a param
      client.createStateManager();
      log("StateManager created");

      //Add address of current kc wallet for all outgoing event verification.
      const keyCardWallet = privateKeyToAccount(keycard);
      await client.stateManager!.keycards.addAddress(keyCardWallet.address);
      log(
        `keycard wallet address added: ${keyCardWallet.address.toLowerCase()}`,
      );

      // Connect & authenticate
      setStoreRegistrationStatus(
        "Connecting and authenticating Relay Client...",
      );
      await client.relayClient!.connect();
      await client.relayClient!.authenticate();
    } catch (error) {
      debug(`Error:enrollConnectAuthenticate ${error}`);
      setErrorMsg("Error connecting to client");
    }
    await createShopManifest(client);
  }

  async function createShopManifest(client: ClientWithStateManager) {
    try {
      log("adding relays to keycards");
      await client.stateManager!.addRelaysToKeycards();
      log("sending merchant subscription request");
      await client.sendMerchantSubscriptionRequest();
      log("creating manifest");
      await client.stateManager!.manifest.create(
        {
          pricingCurrency: pricingCurrency as ShopCurrencies,
          acceptedCurrencies,
          payees: [
            {
              address: payeeAddress,
              callAsContract: false,
              chainId: payeeChain,
              name: "default",
            } as Payee,
          ],
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
      log("Manifest created");
    } catch (error) {
      debug(`Error:createShopManifest ${error}`);
      setErrorMsg("Error creating shop manifest");
    }

    await uploadMetadata(client);
  }

  async function uploadMetadata(client: ClientWithStateManager) {
    setStoreRegistrationStatus("Setting shop metadata...");
    let metadataPath;
    let imgPath;
    try {
      //Testing dom does not support FormData and test client will fail with:
      //Content-Type isn't multipart/form-data
      //so if it is a test env, we are skipping uploadBlob
      if (process.env.TEST) {
        metadataPath = { url: "/" };
        imgPath = { url: "/" };
      } else {
        imgPath = avatar
          ? await client.relayClient!.uploadBlob(avatar as FormData)
          : { url: null };
        const metadata = {
          name: storeName,
          description: description,
          image: imgPath.url,
        };
        const jsn = JSON.stringify(metadata);
        const blob = new Blob([jsn], { type: "application/json" });
        const file = new File([blob], "file.json");
        const formData = new FormData();
        formData.append("file", file);
        metadataPath = await client.relayClient!.uploadBlob(formData);
      }

      const blockchainClient = new BlockchainClient(shopId!);
      //Write shop metadata to blockchain client.
      const metadataHash = await blockchainClient.setShopMetadataURI(
        clientWallet!,
        metadataPath.url,
      );
      const transaction = await shopPublicClient!.waitForTransactionReceipt({
        hash: metadataHash,
        retryCount: 10,
      });

      if (transaction.status !== "success") {
        debug("Error: setShopMetadataURI");
        throw new Error("Error: setShopMetadataURI");
      }
      setShopDetails({
        name: storeName,
        profilePictureUrl: imgPath.url,
      });

      setIsMerchantView(true);
      setIsConnected(Status.Complete);
      setStep("confirmation");
    } catch (error) {
      debug(`Error:uploadMetadata ${error}`);
      setErrorMsg("Error uploading metadata");
    }
  }

  if (step === "manifest form") {
    return (
      <main className="pt-under-nav h-screen p-4 mt-2">
        <ValidationWarning
          warning={validationError}
          onClose={() => {
            setValidationError(null);
          }}
        />
        <ErrorMessage
          errorMessage={errorMsg}
          onClose={() => {
            setErrorMsg(null);
          }}
        />
        <div className="flex">
          <h1>Create new shop</h1>
        </div>
        <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
          <form
            className="flex flex-col grow"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="font-medium" htmlFor="storeName">
              Shop Name
            </label>
            <input
              className="border-2 border-solid mt-1 p-2 rounded-md bg-background-gray"
              data-testid="storeName"
              name="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </form>
          <div className="flex gap-2">
            <AvatarUpload setImgBlob={setAvatar} />
            <p className="flex items-center">Upload PFP</p>
          </div>
          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="desc" className="font-medium">
              Description
            </label>
            <input
              className="border-2 border-solid mt-1 p-2 rounded-md bg-background-gray"
              data-testid="desc"
              name="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </form>
          <div>
            <label className="font-medium">Accepted currency</label>
            <div className="flex flex-col gap-2">
              {chains.map((c) => (
                <div key={c.id}>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      onChange={(e) => handleAcceptedCurrencies(e)}
                      className="form-checkbox h-4 w-4"
                      value={`ETH/${c.id}`}
                    />
                    <span>{`ETH/${c.name}`}</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      onChange={(e) => handleAcceptedCurrencies(e)}
                      className="form-checkbox h-4 w-4"
                      value={`USDC/${c.id}`}
                    />
                    <span>{`USDC/${c.name}`}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div
              className="flex flex-col"
              onSubmit={(e) => e.preventDefault()}
              data-testid="pricing-currency"
            >
              <label htmlFor="pricingCurrency" className="font-medium">
                Pricing Currency
              </label>
              <Dropdown
                options={chains
                  .map((c) => {
                    return { label: `ETH/${c.name}`, value: `ETH/${c.id}` };
                  })
                  .concat(
                    chains.map((c) => {
                      return { label: `USDC/${c.name}`, value: `USDC/${c.id}` };
                    }),
                  )}
                callback={handlePricingCurrency}
              />
            </div>
          </form>
          <div data-testid="payee-info" className="flex flex-col gap-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label htmlFor="payee" className="font-medium">
                Payment Address
              </label>
              <input
                className="border-2 border-solid mt-1 p-2 rounded-md w-full bg-background-gray"
                id="payee"
                data-testid="payeeAddress"
                name="payee"
                value={payeeAddress || ""}
                onChange={(e) =>
                  setPayeeAddress(e.target.value as `0x${string}`)
                }
              />
            </form>
            <Dropdown
              options={chains.map((c) => {
                return { label: c.name, value: c.id };
              })}
              callback={(selected) => {
                setPayeeChain(selected.value as number);
              }}
            />
          </div>
          <div>
            <Button onClick={goToConnectWallet}>
              <h6>Connect Wallet</h6>
            </Button>
          </div>
        </section>
      </main>
    );
  } else if (step === "connect wallet") {
    return (
      <main className="pt-under-nav h-screen p-4 mt-5">
        <ValidationWarning
          warning={validationError}
          onClose={() => {
            setValidationError(null);
          }}
        />
        <ErrorMessage
          errorMessage={errorMsg}
          onClose={() => {
            setErrorMsg(null);
          }}
        />
        <h1>Connect your wallet</h1>
        <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
          {status === "connected" ? (
            <div className="flex flex-col gap-4">
              <ConnectButton chainStatus="name" />
              <p>{storeRegistrationStatus}</p>
              <Button onClick={mintShop} disabled={!clientWallet}>
                <h6>Mint Shop</h6>
              </Button>
            </div>
          ) : (
            <ConnectWalletButton />
          )}
        </section>
      </main>
    );
  } else if (step === "confirmation") {
    return <Confirmation />;
  }
};

export default StoreCreation;
