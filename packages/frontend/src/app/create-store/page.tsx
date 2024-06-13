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

const StoreCreation = () => {
  const {
    relayClient,
    publicClient,
    walletAddress,
    clientWallet,
    setKeyCardEnrolled,
  } = useMyContext();
  const router = useRouter();

  const [storeName, setStoreName] = useState<string>("");
  const [storeURL, setStoreURL] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const enrollKeycard = useRef(false);
  const { isAuthenticated } = useAuth();

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
    setCurrency(e.target.value);
  };
  const createStore = () => {
    (async () => {
      if (relayClient && publicClient && clientWallet) {
        try {
          const storeId =
            localStorage.getItem("storeId") || process.env.NEXT_PUBLIC_STORE_ID;
          const hash = await relayClient.blockchain.createShop(clientWallet);
          const transaction =
            publicClient &&
            (await publicClient.waitForTransactionReceipt({
              hash,
            }));
          if (transaction.status == "success") {
            console.log("store created");
            const PERMRootHash = await publicClient.readContract({
              address: abi.addresses.ShopReg as `0x${string}`,
              abi: abi.ShopReg,
              functionName: "PERM_updateRootHash",
            });
            const _hasAccess = await publicClient.readContract({
              address: abi.addresses.ShopReg as `0x${string}`,
              abi: abi.ShopReg,
              functionName: "hasPermission",
              args: [storeId, walletAddress, PERMRootHash],
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
        await relayClient.writeShopManifest(storeName, description, "/testing");
        console.log("store manifested.");
        const publishedTagId = await relayClient.createTag("visible");
        if (publishedTagId) {
          await relayClient!.updateShopManifest({ publishedTagId });
        }
        router.push("/products");
      })();
    }
  }, [isAuthenticated, relayClient]);

  return (
    <main className="pt-under-nav h-screen p-4">
      <div className="flex">
        <h2 className="pt-4">Create new shop</h2>
        <div className="ml-auto">
          <SecondaryButton onClick={createStore}>save</SecondaryButton>
        </div>
      </div>
      <section className="mt-4 flex flex-col gap-4">
        <div className="flex gap-4">
          <div>
            <p>pfp</p>
            <AvatarUpload img={avatar} setImgSrc={setAvatar} />
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
        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="fname">Base Currency</label>
          <input
            className="border-2 border-solid mt-1 p-2 rounded-2xl"
            id="fname"
            name="fname"
            value={currency}
            onChange={(e) => handleCurrency(e)}
          />
        </form>
      </section>
    </main>
  );
};

export default StoreCreation;
