// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import AvatarUpload from "@/app/common/components/AvatarUpload";
import { useUserContext } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { Option, Payee, ShopCurrencies, Status } from "@/types";
import { useRouter } from "next/navigation";
import { random32BytesHex, zeroAddress } from "@massmarket/utils";
import { useChains } from "wagmi";
import { useStoreContext } from "@/context/StoreContext";
import { BlockchainClient } from "@massmarket/blockchain";
import debugLib from "debug";
import { getTokenAddress, isValidHex } from "@/app/utils";
import ValidationWarning from "@/app/common/components/ValidationWarning";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import { discoverRelay } from "@massmarket/client";
import { privateKeyToAccount } from "viem/accounts";
import Dropdown from "@/app/common/components/Dropdown";
import Button from "@/app/common/components/Button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const StoreCreation = () => {
  const {
    shopPublicClient,
    clientWallet,
    shopId,
    setShopId,
    checkPermissions,
    setRelayClient,
    relayClient,
    createNewRelayClient,
  } = useUserContext();

  const { stateManager, setShopDetails } = useStoreContext();
  const { clientConnected, setIsConnected, setIsMerchantView } = useAuth();
  const chains = useChains();
  const router = useRouter();
  const { status } = useAccount();
  const { openConnectModal } = useConnectModal();

  const [step, setStep] = useState<"manifest form" | "connect wallet">(
    "manifest form",
  );
  const [storeName, setStoreName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [avatar, setAvatar] = useState<FormData | null>(null);
  const [pricingCurrency, setPricingCurrency] = useState<
    Partial<ShopCurrencies>
  >({ address: zeroAddress });
  const [acceptedCurrencies, setAcceptedCurrencies] = useState<
    ShopCurrencies[]
  >([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isStoreCreated, setStoreCreated] = useState<boolean>(false);
  const [payee, setPayee] = useState<Partial<ShopCurrencies> | null>(null);
  const enrollKeycard = useRef(false);
  const randomShopIdHasBeenSet = useRef(false);
  const debug = debugLib("frontend:create-store");

  useEffect(() => {
    if (clientWallet?.account.address) {
      setPayee({
        address: clientWallet?.account.address,
      });
    }
  }, [clientWallet]);

  useEffect(() => {
    if (!randomShopIdHasBeenSet.current) {
      localStorage.removeItem("merchantKeyCard");
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

  const handleAcceptedCurrencies = async (e: ChangeEvent<HTMLInputElement>) => {
    const [sym, chainId] = e.target.value.split("/");
    const address = await getTokenAddress(sym, Number(chainId));
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
  };

  const handleBaseCurrency = async (option: Option) => {
    const v = option.value as string;
    const [sym, chainId] = v.split("/");
    const address = await getTokenAddress(sym, Number(chainId));
    setPricingCurrency({ address, chainId: Number(chainId) });
  };

  const checkRequiredFields = () => {
    if (!payee?.address || !payee?.chainId) {
      return "Payee is required.";
    }
    if (!pricingCurrency?.address || !pricingCurrency?.chainId) {
      return "pricingCurrency is required.";
    }
    const isTokenAddrHex = isValidHex(pricingCurrency.address);
    const isPayeeAddHex = isValidHex(payee.address);

    if (!isTokenAddrHex) {
      return "Token address must be a valid hex value";
    } else if (!storeName.length) {
      return "Store name is required";
    } else if (!description.length) {
      return "Store description is required";
    } else if (!pricingCurrency.address.length) {
      return "Token Address is required";
    } else if (!isPayeeAddHex) {
      return "Payee Address must be a valid hex value";
    }
    return null;
  };
  const goToConnectWallet = () => {
    const warning = checkRequiredFields();
    if (warning) {
      setValidationError(warning);
      throw Error(`Check all required fields:${warning}`);
    } else {
      setValidationError(null);
    }
    setStep("connect wallet");
  };

  const createShop = async () => {
    const rc = await createNewRelayClient();
    if (rc && shopPublicClient && clientWallet && shopId) {
      try {
        const blockchainClient = new BlockchainClient(shopId);
        const hash = await blockchainClient.createShop(clientWallet);

        const transaction = await shopPublicClient.waitForTransactionReceipt({
          hash,
          retryCount: 10,
        });

        if (transaction!.status == "success") {
          // //Add relay tokenId for event verification.
          const relayURL =
            (process && process.env["NEXT_PUBLIC_RELAY_TOKEN_ID"]) ||
            "ws://localhost:4444/v3";
          const relayEndpoint = await discoverRelay(relayURL);
          await blockchainClient.addRelay(clientWallet, relayEndpoint.tokenId);
          localStorage.setItem("shopId", shopId!);
          const hasAccess = await checkPermissions();

          if (hasAccess && clientWallet) {
            if (enrollKeycard.current) return;
            enrollKeycard.current = true;
            const res = await rc.enrollKeycard(
              clientWallet,
              false,
              shopId,
              process.env.TEST ? undefined : new URL(window.location.href),
            );
            if (res.ok) {
              setRelayClient(rc);
              const keyCardToEnroll = localStorage.getItem(
                "keyCardToEnroll",
              ) as `0x${string}`;
              setIsMerchantView(true);
              localStorage.setItem("merchantKeyCard", keyCardToEnroll);
              //Connect, authenticate, and send subscription request.
              await rc.connect();
              await rc.authenticate();
              await rc.sendMerchantSubscriptionRequest(shopId);
              setStoreCreated(true);
              setIsConnected(Status.Complete);
            } else {
              debug("Failed to enroll keycard");
            }
            localStorage.removeItem("keyCardToEnroll");
          }
        } else {
          debug("Transaction failed while minting store.");
        }
      } catch (err) {
        setErrorMsg("Error while creating store");
        debug(`Error while creating store: ${err}`);
      }
    } else {
      debug("Client undefined");
    }
  };

  useEffect(() => {
    //Create manifest once KC is enrolled and client is connected + authenticated.
    if (
      relayClient &&
      shopId &&
      stateManager &&
      isStoreCreated &&
      clientConnected == Status.Complete
    ) {
      //Add address of kc wallet for all outgoing event verification.
      const kc = localStorage.getItem("merchantKeyCard") as `0x${string}`;
      const keyCardWallet = privateKeyToAccount(kc!);
      stateManager.keycards.addAddress(keyCardWallet.address).then(() => {
        stateManager.manifest
          .create(
            {
              pricingCurrency: pricingCurrency as ShopCurrencies,
              acceptedCurrencies,
              payees: [
                {
                  address: payee!.address,
                  callAsContract: false,
                  chainId: payee!.chainId!,
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
            shopId,
          )
          .then(() => {
            uploadMetadata()
              .then(() => {
                router.push("/products");
              })
              .catch((e) => debug(e));
          })
          .catch((e) => {
            debug(e);
            setErrorMsg("Error while create shop manifest");
          });
      });
    }
  }, [clientConnected]);

  const uploadMetadata = async () => {
    let metadataPath;
    let imgPath;
    //Testing dom does not support FormData and test client will fail with:
    //Content-Type isn't multipart/form-data
    //so if it is a test env, we are skipping uploadBlob
    if (process.env.TEST) {
      metadataPath = { url: "/" };
      imgPath = { url: "/" };
    } else {
      imgPath = avatar
        ? await relayClient!.uploadBlob(avatar as FormData)
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
      metadataPath = await relayClient!.uploadBlob(formData);
    }

    if (metadataPath) {
      const blockchainClient = new BlockchainClient(shopId!);

      //Write shop metadata to blockchain client.
      await blockchainClient.setShopMetadataURI(
        clientWallet!,
        metadataPath.url,
      );
      setShopDetails({
        name: storeName,
        profilePictureUrl: imgPath.url,
      });
    }
  };
  if (step === "manifest form") {
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
        <div className="flex">
          <h2>Create new shop</h2>
        </div>
        <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
          <form
            className="flex flex-col grow"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="storeName">Store Name</label>
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
            <p>Upload PFP</p>
          </div>
          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="desc">Description</label>
            <input
              className="border-2 border-solid mt-1 p-2 rounded-md bg-background-gray"
              data-testid="desc"
              name="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </form>
          <div>
            <label>Accepted currency</label>
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
              <label htmlFor="pricingCurrency">Pricing Currency</label>
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
                callback={handleBaseCurrency}
              />
            </div>
          </form>
          <div data-testid="payee-info">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label htmlFor="payee">Payment Address</label>
              <input
                className="border-2 border-solid mt-1 p-2 rounded-md w-full bg-background-gray"
                id="payee"
                data-testid="payeeAddress"
                name="payee"
                value={payee?.address || ""}
                onChange={(e) =>
                  setPayee({
                    address: e.target.value as `0x${string}`,
                    chainId: payee?.chainId,
                  })
                }
              />
            </form>
            <Dropdown
              options={chains.map((c) => {
                return { label: c.name, value: c.id };
              })}
              callback={(selected) => {
                setPayee({
                  address: payee?.address,
                  chainId: selected.value as number,
                });
              }}
            />
          </div>

          <div className="mt-6">
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
        <h2>Connect your wallet</h2>
        <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
          {status === "connected" ? (
            <div className="flex flex-col gap-4">
              <ConnectButton chainStatus="name" />
              <Button onClick={createShop}>
                <h6>Mint Shop</h6>
              </Button>
            </div>
          ) : (
            <button
              data-testid="connect-wallet"
              className="rounded-lg flex flex-col items-center gap-2"
              onClick={openConnectModal}
            >
              <Image
                src="/icons/wallet-icon.svg"
                width={40}
                height={40}
                alt="wallet-icon"
                unoptimized={true}
              />
              <div className="flex gap-2">
                <p>Connect wallet</p>
                <Image
                  src="/icons/chevron-left.svg"
                  width={5}
                  height={5}
                  alt="wallet-icon"
                  unoptimized={true}
                />
              </div>
            </button>
          )}
        </section>
      </main>
    );
  }
};

export default StoreCreation;
