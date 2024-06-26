// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import AvatarUpload from "@/app/common/components/AvatarUpload";
import { useMyContext } from "@/context/MyContext";
import { useAuth } from "@/context/AuthContext";
import * as abi from "@massmarket/contracts";
import { IStatus } from "@/types";
import { useRouter } from "next/navigation";
import SecondaryButton from "@/app/common/components/SecondaryButton";
import { random32BytesHex } from "@massmarket/client/src/utils";
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
  const [storeURL, setStoreURL] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [avatar, setAvatar] = useState<FormData | null>(null);
  const [tokenAddr, setTokenAddr] = useState<`0x${string}`>("0x");
  const [chainId, setAcceptedChain] = useState<number>(0);
  const chains = useChains();

  const enrollKeycard = useRef(false);
  const { isAuthenticated } = useAuth();
  const randomShopIdHasBeenSet = useRef(false);

  const handleStoreName = (e: ChangeEvent<HTMLInputElement>) => {
    setStoreName(e.target.value);
  };
  const handleStoreURL = (e: ChangeEvent<HTMLInputElement>) => {
    setStoreURL(e.target.value);
  };
  const handleDesription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  const handleCurrency = (e: ChangeEvent<HTMLInputElement>) => {
    //FIXME: check that value is hex
    setTokenAddr(e.target.value);
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
            const _hasAccess = await publicClient.readContract({
              address: abi.addresses.ShopReg as `0x${string}`,
              abi: abi.ShopReg,
              functionName: "hasPermission",
              args: [shopId, walletAddress, PERMRootHash],
            });
            if (_hasAccess && clientWallet) {
              if (enrollKeycard.current) return;
              enrollKeycard.current = true;
              const res = await relayClient.enrollKeycard(clientWallet);
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
              tokenAddr: hexToBytes(tokenAddr),
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
          await relayClient.blockchain.setShopsURI(clientWallet, url);
        }

        router.push("/products");
      })();
    }
  }, [isAuthenticated, relayClient]);
  const allRequiredFieldsComplete = true;
  return (
    <main className="pt-under-nav h-screen p-4 mt-5">
      <div className="flex">
        <h2>Create new shop</h2>
        <div className="ml-auto">
          <SecondaryButton
            onClick={createShop}
            disabled={!allRequiredFieldsComplete}
          >
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
              onChange={(e) => handleStoreName(e)}
              placeholder="Type a name"
            />
          </form>
        </div>

        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="fname">URL</label>
          <input
            className="border-2 border-solid mt-1 p-2 rounded-2xl"
            id="fname"
            name="fname"
            value={storeURL}
            onChange={(e) => handleStoreURL(e)}
          />
        </form>
        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="fname">Description</label>
          <input
            className="border-2 border-solid mt-1 p-2 rounded-2xl"
            id="fname"
            name="fname"
            value={description}
            onChange={(e) => handleDesription(e)}
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
            <label htmlFor="fname">Base Currency</label>

            <Image
              src="/assets/search.svg"
              width={19}
              height={19}
              alt="search-icon"
              className="absolute m-2 mt-4 ml-3"
            />
            <input
              className="border-2 border-solid mt-1 p-2 rounded-2xl w-full pl-10"
              id="fname"
              name="fname"
              value={tokenAddr}
              onChange={(e) => handleCurrency(e)}
              placeholder="Search or Paste Address"
            />
          </form>
        </div>
      </section>
    </main>
  );
};

export default StoreCreation;
