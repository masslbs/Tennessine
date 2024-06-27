// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect, useRef } from "react";
import AvatarUpload from "@/app/common/components/AvatarUpload";
import { useMyContext } from "@/context/MyContext";
import { useAuth } from "@/context/AuthContext";
import * as abi from "@massmarket/contracts";
import { IStatus } from "@/types";
import { useRouter } from "next/navigation";
import SecondaryButton from "@/app/common/components/SecondaryButton";
import { random32BytesHex } from "@massmarket/client/utils";
import Image from "next/image";
import { useChains } from "wagmi";
import { hexToBytes } from "viem";
import { SET_STORE_DATA } from "@/reducers/storeReducer";
import { useStoreContext } from "@/context/StoreContext";

const StoreCreation = () => {
  const {
    relayClient,
    publicClient,
    walletAddress,
    clientWallet,
    shopId,
    setShopId,
    setKeyCardEnrolled,
  } = useMyContext();
  const { setStoreData } = useStoreContext();
  const router = useRouter();

  const [storeName, setStoreName] = useState<string>("");
  // const [storeURL, setStoreURL] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [avatar, setAvatar] = useState<FormData | null>(null);
  const [tokenAddr, setTokenAddr] = useState<string>("0x");
  const [chainId, setAcceptedChain] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const chains = useChains();

  const enrollKeycard = useRef(false);
  const { isAuthenticated } = useAuth();
  const randomShopIdHasBeenSet = useRef(false);

  const checkRequiredFields = () => {
    const isHex = Boolean(tokenAddr.match(/^0x[0-9a-f]+$/i));
    let error = null;
    if (!isHex) {
      error = "Token address must be a valid hex value";
    } else if (!storeName.length) {
      error = "Store name is required";
    } else if (!description.length) {
      error = "Store description is required";
    } else if (!avatar) {
      error = "Store mage is required";
    } else if (!tokenAddr.length) {
      error = "Token Address is required";
    } else if (!chainId) {
      error = "Select a chainID";
    }
    if (error) {
      setErrorMsg(error);
      throw Error("Check all required fields");
    } else {
      setErrorMsg(null);
    }
  };

  useEffect(() => {
    if (!randomShopIdHasBeenSet.current && relayClient) {
      randomShopIdHasBeenSet.current = true;
      const randomShopId = random32BytesHex();
      console.log(`enrolling shopId: ${randomShopId}`);
      setShopId(randomShopId);
    }
  }, [relayClient]);

  const createShop = () => {
    (async () => {
      checkRequiredFields();

      if (relayClient && publicClient && clientWallet) {
        try {
          const hash = await relayClient.blockchain.createShop(clientWallet);
          const transaction =
            publicClient &&
            (await publicClient.waitForTransactionReceipt({
              hash,
            }));
          if (transaction.status == "success") {
            console.log(`shopId: ${shopId} created`);
            localStorage.setItem("shopId", shopId!);
            const PERMRootHash = await publicClient.readContract({
              address: abi.addresses.ShopReg as `0x${string}`,
              abi: abi.ShopReg,
              functionName: "PERM_updateRootHash",
            });
            const _hasAccess = (await publicClient.readContract({
              address: abi.addresses.ShopReg as `0x${string}`,
              abi: abi.ShopReg,
              functionName: "hasPermission",
              args: [shopId, walletAddress, PERMRootHash],
            })) as boolean;
            if (_hasAccess && clientWallet) {
              if (enrollKeycard.current) return;
              enrollKeycard.current = true;
              const res = await relayClient.enrollKeycard(
                clientWallet,
                !_hasAccess,
              );
              if (res.ok) {
                const keyCardToEnroll = localStorage.getItem(
                  "keyCardToEnroll",
                ) as `0x${string}`;
                localStorage.setItem("keyCard", keyCardToEnroll);
                localStorage.removeItem("keyCardToEnroll");
                console.log(`keycard enrolled:${keyCardToEnroll}`);
                setKeyCardEnrolled(keyCardToEnroll);
              } else {
                console.error("failed to enroll keycard");
              }
            }
          }
        } catch (err) {
          console.log("error creating store", err);
        }
      }
    })();
  };

  useEffect(() => {
    if (relayClient && isAuthenticated === IStatus.Complete) {
      (async () => {
        const publishedTagId = new Uint8Array(32);
        crypto.getRandomValues(publishedTagId);
        await relayClient.shopManifest({
          name: storeName,
          description,
          profilePictureUrl: "https://http.cat/images/200.jpg",
          publishedTagId,
        });
        console.log("store manifested.");
        const newPubId = await relayClient.createTag({ name: "visible" });
        const path = await relayClient!.uploadBlob(avatar as FormData);

        if (newPubId && path.url) {
          await relayClient!.updateShopManifest({
            publishedTagId: newPubId,
            setBaseCurrency: {
              tokenAddr: hexToBytes(tokenAddr as `0x${string}`),
              chainId,
            },
            profilePictureUrl: path.url,
          });
        }

        setStoreData({
          type: SET_STORE_DATA,
          payload: { name: storeName!, profilePictureUrl: path.url! },
        });
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

        const { url } = await relayClient.uploadBlob(formData);
        if (clientWallet && url) {
          await relayClient.blockchain.setShopMetadataURI(clientWallet, url);
        }

        router.push("/products");
      })();
    }
  }, [isAuthenticated, relayClient]);

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
              id="storeName"
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
            id="desc"
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
            <label htmlFor="tokenAddr">Base Currency</label>

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
              name="tokenAddr"
              value={tokenAddr}
              onChange={(e) => setTokenAddr(e.target.value)}
              placeholder="Search or Paste Address"
            />
          </form>
        </div>
      </section>
    </main>
  );
};

export default StoreCreation;
