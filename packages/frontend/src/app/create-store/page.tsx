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

const StoreCreation = () => {
  const {
    publicClient,
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
  }, []);

  const checkRequiredFields = () => {
    const isTokenAddrHex = Boolean(tokenAddr.match(/^0x[0-9a-f]+$/i));
    const isPayeeAddHex = Boolean(payeeAddr.match(/^0x[0-9a-f]+$/i));
    let error = null;
    if (!isTokenAddrHex) {
      error = "Token address must be a valid hex value";
    } else if (!storeName.length) {
      error = "Store name is required";
    } else if (!description.length) {
      error = "Store description is required";
    } else if (!avatar) {
      error = "Store image is required";
    } else if (!tokenAddr.length) {
      error = "Token Address is required";
    } else if (!chainId) {
      error = "Select a chainID";
    } else if (!isPayeeAddHex) {
      error = "Payee Address must be a valid hex value";
    }
    if (error) {
      setErrorMsg(error);
      throw Error(`Check all required fields:${error}`);
    } else {
      setErrorMsg(null);
    }
  };

  const createShop = async () => {
    checkRequiredFields();
    const rc = await createNewRelayClient();
    if (rc && publicClient && clientWallet) {
      try {
        const blockchainClient = new BlockchainClient(shopId);
        const hash = await blockchainClient.createShop(clientWallet);

        const transaction = await publicClient.waitForTransactionReceipt({
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
        debug(`Error while creating store: ${err}`);
      }
    } else {
      debug(`Client undefined`);
    }
  };

  useEffect(() => {
    if (
      relayClient &&
      stateManager &&
      isStoreCreated &&
      isConnected == Status.Complete
    ) {
      stateManager.manifest
        .create(
          {
            name: storeName,
            description,
          },
          shopId,
        )
        .catch((e) => {
          debug(e);
        });

      // Create published and remove tags + update shopManifest and metadata
      stateManager.tags
        .create("visible")
        .then(async (newPubId) => {
          await stateManager.tags.create("remove");

          //Testing dom does not support FormData and test client will fail with:
          //Content-Type isn't multipart/form-data
          //so if it is a test env, we are skipping uploadBlob
          const path = process.env.TEST
            ? { url: "/" }
            : await relayClient!.uploadBlob(avatar as FormData);

          if (newPubId && path.url) {
            await stateManager.manifest.update({
              publishedTagId: newPubId.id,
              setBaseCurrency: {
                tokenAddr: tokenAddr as `0x${string}`,
                chainId,
              },
              addAcceptedCurrencies: [
                {
                  tokenAddr: tokenAddr as `0x${string}`,
                  chainId,
                },
              ],
              addPayee: {
                addr: payeeAddr as `0x${string}`,
                callAsContract: false,
                chainId,
                name: "default",
              },
              profilePictureUrl: path.url,
            });
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
          //Testing dom does not support FormData and test client will fail with:
          //Content-Type isn't multipart/form-data
          //so if it is a test env, we are skipping uploadBlob
          const { url } = process.env.TEST
            ? { url: "/" }
            : await relayClient.uploadBlob(formData);
          if (clientWallet && url) {
            const blockchainClient = new BlockchainClient(shopId);
            await blockchainClient.setShopMetadataURI(clientWallet, url);
          }

          router.push("/products");
        })
        .catch((e) => {
          debug(e);
        });
    }
  }, [isConnected, isStoreCreated, stateManager]);

  return (
    <main className="pt-under-nav h-screen p-4 mt-5">
      {errorMsg ? <p>{errorMsg}</p> : null}
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
