// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect, useRef } from "react";
import AvatarUpload from "@/app/common/components/AvatarUpload";
import { useMyContext } from "@/context/MyContext";
import { useAuth } from "@/context/AuthContext";
import { Status } from "@/types";
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

const StoreCreation = () => {
  const {
    shopPublicClient,
    clientWallet,
    shopId,
    setShopId,
    setKeyCardEnrolled,
    checkPermissions,
    setRelayClient,
    relayClient,
    createNewRelayClient,
  } = useMyContext();

  const { stateManager } = useStoreContext();
  const { isConnected, setIsConnected, setIsMerchantView } = useAuth();
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
      setKeyCardEnrolled(false);
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
    } else if (!avatar) {
      warning = "Store image is required";
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
              const keyCardToEnroll = localStorage.getItem(
                "keyCardToEnroll",
              ) as `0x${string}`;
              setIsMerchantView(true);
              setRelayClient(rc);
              localStorage.setItem("merchantKeyCard", keyCardToEnroll);
              setKeyCardEnrolled(true);
              setStoreCreated(true);
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
    if (
      relayClient &&
      shopId &&
      stateManager &&
      isStoreCreated &&
      isConnected == Status.Complete
    ) {
      stateManager.manifest
        .create(
          {
            baseCurrency: {
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
          },
          shopId,
        )
        .catch((e) => {
          debug(e);
          setErrorMsg("Error while create shop manifest");
        });

      //Now we write shop metadata to blockchain client.

      //Testing dom does not support FormData and test client will fail with:
      //Content-Type isn't multipart/form-data
      //so if it is a test env, we are skipping uploadBlob
      let path = { url: "/" };
      if (!process.env.TEST) {
        relayClient!
          .uploadBlob(avatar as FormData)
          .then((res) => {
            path = res;
          })
          .catch((e) => debug(e));
      }
      const metadata = {
        name: storeName,
        description: description,
        image: path.url,
      };
      const jsn = JSON.stringify(metadata);
      const blob = new Blob([jsn], { type: "application/json" });
      const file = new File([blob], "file.json");
      const formData = new FormData();
      formData.append("file", file);

      let response = { url: "/" };
      if (!process.env.TEST) {
        relayClient.uploadBlob(formData).then((res) => {
          response = res;
        });
      }
      if (clientWallet && response.url) {
        const blockchainClient = new BlockchainClient(shopId);
        blockchainClient
          .setShopMetadataURI(clientWallet, response.url)
          .then()
          .catch((e) => debug(e));
      }

      router.push("/products");
    }
  }, [isConnected, isStoreCreated, stateManager]);

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
