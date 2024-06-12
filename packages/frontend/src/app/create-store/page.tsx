// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import AvatarUpload from "@/app/common/components/AvatarUpload";
import Button from "@/app/common/components/Button";
import { useMyContext } from "@/context/MyContext";
import { useAuth } from "@/context/AuthContext";
import * as abi from "@massmarket/contracts";
import { IStatus } from "@/types";
import { useRouter } from "next/navigation";

const StoreCreation = () => {
  const {
    relayClient,
    publicClient,
    walletAddress,
    clientWallet,
    setKeyCardEnrolled,
  } = useMyContext();
  const router = useRouter();

  const [storeName, setStoreName] = useState<string>("ethDubai");
  const [storeURL, setStoreURL] = useState<string>("ethdubai.mass.market");
  const [currency, setCurrency] = useState<string>("ETH");
  const [description, setDescription] = useState<string>("Creating store...");
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
          const hash = await relayClient.blockchain.createStore(clientWallet);
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
        //FIXME: create and pass published store ID
        await relayClient.writeStoreManifest();
        console.log("store manifested.");
        router.push("/products");
      })();
    }
  }, [isAuthenticated, relayClient]);

  return (
    <main className="pt-under-nav bg-gray-100 h-screen p-4">
      <h2 className="pt-4">Create new shop</h2>
      <section className="mt-4 flex flex-col gap-4">
        <div className="flex gap-4">
          <AvatarUpload img={avatar} setImgSrc={setAvatar} />
          <form
            className="flex flex-col grow"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="fname">Store Name</label>
            <input
              className="border-2 border-solid mt-1 p-2 rounded"
              id="fname"
              name="fname"
              value={storeName}
              onChange={(e) => handleStoreName(e)}
            />
          </form>
        </div>

        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="fname">URL</label>
          <input
            className="border-2 border-solid mt-1 p-2 rounded"
            id="fname"
            name="fname"
            value={storeURL}
            onChange={(e) => handleStoreURL(e)}
          />
        </form>
        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="fname">Description</label>
          <input
            className="border-2 border-solid mt-1 p-2 rounded"
            id="fname"
            name="fname"
            value={description}
            onChange={(e) => handleDesription(e)}
          />
        </form>
        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="fname">Base Currency</label>
          <input
            className="border-2 border-solid mt-1 p-2 rounded"
            id="fname"
            name="fname"
            value={currency}
            onChange={(e) => handleCurrency(e)}
          />
        </form>
      </section>
      <div className="mt-8">
        <Button onClick={createStore}>create store</Button>
      </div>
    </main>
  );
};

export default StoreCreation;
