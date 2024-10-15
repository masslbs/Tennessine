// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect, useRef } from "react";
import AvatarUpload from "@/app/common/components/AvatarUpload";
import { useUserContext } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { Status, ObjectType } from "@/types";
import { useRouter } from "next/navigation";
import SecondaryButton from "@/app/common/components/SecondaryButton";
import { random32BytesHex, zeroAddress } from "@massmarket/utils";
import Image from "next/image";
import { useChains } from "wagmi";
import { useStoreContext } from "@/context/StoreContext";
import { BlockchainClient } from "@massmarket/blockchain";
import debugLib from "debug";
import { isValidHex } from "@/app/utils";
import ValidationWarning from "@/app/common/components/ValidationWarning";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import { discoverRelay } from "@massmarket/client";
import { privateKeyToAccount } from "viem/accounts";

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

  const [storeName, setStoreName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [avatar, setAvatar] = useState<FormData | null>(null);
  const [tokenAddr, setTokenAddr] = useState<string>(zeroAddress);
  const [chainId, setAcceptedChain] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isStoreCreated, setStoreCreated] = useState<boolean>(false);
  const [payeeAddr, setPayeeAddr] = useState<string>("");

  const enrollKeycard = useRef(false);
  const randomShopIdHasBeenSet = useRef(false);
  const debug = debugLib("frontend:create-store");

  useEffect(() => {
    if (clientWallet?.account.address) {
      setPayeeAddr(clientWallet?.account.address);
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

  const checkRequiredFields = () => {
    const isTokenAddrHex = isValidHex(tokenAddr);
    const isPayeeAddHex = isValidHex(payeeAddr);

    let warning = null;
    if (!isTokenAddrHex) {
      warning = "Token address must be a valid hex value";
    } else if (!storeName.length) {
      warning = "Store name is required";
    } else if (!description.length) {
      warning = "Store description is required";
    } else if (!tokenAddr.length) {
      warning = "Token Address is required";
    } else if (!chainId) {
      warning = "Select a chainID";
    } else if (!isPayeeAddHex) {
      warning = "Payee Address must be a valid hex value";
    }
    if (warning) {
      setValidationError(warning);
      throw Error(`Check all required fields:${warning}`);
    } else {
      setValidationError(null);
    }
  };

  const createShop = async () => {
    checkRequiredFields();

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
              console.error("failed to enroll keycard");
            }
            localStorage.removeItem("keyCardToEnroll");
          }
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
              pricingCurrency: {
                chainId: 1,
                address: tokenAddr as `0x${string}`,
              },
              acceptedCurrencies: [
                {
                  address: tokenAddr as `0x${string}`,
                  chainId,
                },
              ],
              payees: [
                {
                  address: payeeAddr as `0x${string}`,
                  callAsContract: false,
                  chainId,
                  name: "default",
                },
              ],
              //TODO: UI for inputting shipping regions.
              shippingRegions: [
                {
                  name: "test",
                  country: "test country",
                  postalCode: "test postal",
                  city: "test city",
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
      imgPath = await relayClient!.uploadBlob(avatar as FormData);
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

    if (clientWallet && metadataPath) {
      const blockchainClient = new BlockchainClient(shopId!);

      //Write shop metadata to blockchain client.
      await blockchainClient.setShopMetadataURI(clientWallet, metadataPath.url);
      setShopDetails({
        name: storeName,
        profilePictureUrl: imgPath.url,
      });
    }
  };

  return (
    <main className="pt-under-nav h-screen p-4 mt-5">
      <ValidationWarning
        warningMessage={validationError}
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
        <div className="ml-auto">
          <SecondaryButton onClick={createShop}>
            <h6>save</h6>
          </SecondaryButton>
        </div>
      </div>
      <section className="mt-8 flex flex-col gap-4">
        <div className="flex gap-4">
          <div>
            <p>PFP</p>
            <AvatarUpload setImgBlob={setAvatar} />
          </div>
          <form
            className="flex flex-col grow"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="storeName">Store Name</label>
            <input
              className="border-2 border-solid mt-1 p-2 rounded-2xl"
              data-testid="storeName"
              name="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Type a name"
            />
          </form>
        </div>

        {/* <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="url">URL</label>
          <input
            className="border-2 border-solid mt-1 p-2 rounded-2xl"
            id="url"
            name="url"
            value={storeURL}
            onChange={(e) => handleStoreURL(e)}
          />
        </form> */}
        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="desc">Description</label>
          <input
            className="border-2 border-solid mt-1 p-2 rounded-2xl"
            data-testid="desc"
            name="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Type a description"
          />
        </form>
        <div>
          <label>Accepted chains</label>
          <div className="flex gap-2">
            {chains.map((c) => (
              <SecondaryButton
                onClick={() => {
                  setAcceptedChain(c.id);
                }}
                data-testid="acceptedChains"
                key={c.id}
                color={c.id === chainId ? "bg-black" : "bg-primary-gray"}
              >
                {c.name}
              </SecondaryButton>
            ))}
          </div>
        </div>
        <div className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label htmlFor="tokenAddr as `0x${string}`">Base Currency</label>

            <Image
              src="/assets/search.svg"
              width={19}
              height={19}
              alt="search-icon"
              className="absolute m-2 mt-4 ml-3"
            />
            <input
              className="border-2 border-solid mt-1 p-2 rounded-2xl w-full pl-10"
              id="tokenAddr"
              data-testid="baseTokenAddr"
              name="tokenAddr"
              value={tokenAddr}
              onChange={(e) => setTokenAddr(e.target.value)}
              placeholder="Search or Paste Address"
            />
          </form>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="payee">Payment Address</label>
          <input
            className="border-2 border-solid mt-1 p-2 rounded-2xl w-full"
            id="payee"
            data-testid="payeeAddress"
            name="payee"
            value={payeeAddr}
            onChange={(e) => setPayeeAddr(e.target.value)}
          />
        </form>
      </section>
    </main>
  );
};

export default StoreCreation;
