// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect, useState } from "react";
import ModalHeader from "../../common/components/ModalHeader";
import Button from "../../common/components/Button";
import { useStoreContext } from "@/context/StoreContext";
import { useMyContext } from "@/context/MyContext";
import Image from "next/image";
import AvatarUpload from "@/app/common/components/AvatarUpload";
import {
  UPDATE_STORE_NAME,
  UPDATE_STORE_PIC,
  UPDATE_BASE_CURRENCY,
} from "@/reducers/storeReducer";
import { ADD_ACCEPTED_CURR } from "@/reducers/acceptedCurrencyReducers";
import { TokenAddr } from "@/reducers/acceptedCurrencyReducers";
import SecondaryButton from "@/app/common/components/SecondaryButton";
import { hexToBytes } from "viem";
import { sepolia, hardhat } from "viem/chains";

const StoreProfile = ({ close }: { close: () => void }) => {
  const {
    shopManifest,
    setShopManifest,
    acceptedCurrencies,
    setAcceptedCurrencies,
  } = useStoreContext();
  const { relayClient } = useMyContext();
  const [storeName, setStoreName] = useState<string>(shopManifest?.name);
  const [baseCurrencyAddr, setStoreBase] = useState<TokenAddr | "">("");
  const [avatar, setAvatar] = useState<FormData | null>(null);
  const [addTokenAddr, setAddTokenAddr] = useState<TokenAddr | "">("");
  const { shopId } = useMyContext();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME!;

  useEffect(() => {
    setStoreName(shopManifest?.name);
    setStoreBase(shopManifest?.baseCurrencyAddr || "");
  }, [acceptedCurrencies]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shopId!);
  };

  const updateStoreInfo = async () => {
    if (!baseCurrencyAddr)
      throw Error("Missing base currency address for store.");
    let path;
    if (avatar) {
      path = await relayClient!.uploadBlob(avatar as FormData);
      setShopManifest({
        type: UPDATE_STORE_PIC,
        payload: { profilePictureUrl: path.url },
      });
    }
    setShopManifest({
      type: UPDATE_STORE_NAME,
      payload: { name: storeName },
    });
    setShopManifest({
      type: UPDATE_BASE_CURRENCY,
      payload: { baseCurrencyAddr },
    });

    avatar
      ? await relayClient!.updateShopManifest({
          name: storeName,
          profilePictureUrl: path.url,
          setBaseCurrency: {
            tokenAddr: hexToBytes(baseCurrencyAddr as `0x${string}`),
            chainId: chainName === "sepolia" ? sepolia.id : hardhat.id,
          },
        })
      : await relayClient!.updateShopManifest({
          name: storeName,
          setBaseCurrency: {
            tokenAddr: hexToBytes(baseCurrencyAddr as `0x${string}`),
            chainId: chainName === "sepolia" ? sepolia.id : hardhat.id,
          },
        });
    close();
  };
  const renderAcceptedCurrencies = () => {
    const currencies = Array.from([...acceptedCurrencies.keys()]);
    return currencies.map((a, i) => <p key={i}>{a}</p>);
  };
  const addAcceptedCurrencyFn = async () => {
    if (!addTokenAddr.length) return;
    try {
      await relayClient!.updateShopManifest({
        addAcceptedCurrency: {
          tokenAddr: hexToBytes(addTokenAddr as `0x${string}`),
          chainId: chainName === "sepolia" ? sepolia.id : hardhat.id,
        },
      });
      setAcceptedCurrencies({
        type: ADD_ACCEPTED_CURR,
        payload: { tokenAddr: addTokenAddr as TokenAddr },
      });
      console.log("tokenAddr added to accepted currencies");
    } catch (error) {
      console.log({ error });
      setAddTokenAddr("");
      //@ts-expect-error FIXME
      error.message && setErrorMsg(error.message);
    }
  };

  return (
    <section className="pt-under-nav h-screen">
      <ModalHeader headerText="Store Profile" goBack={close} />
      <h1 className="text-red-500">{errorMsg}</h1>
      <section className="flex flex-col h-5/6">
        <AvatarUpload setImgBlob={setAvatar} />
        <div className="m-4">
          <p className="font-sans">General</p>
          <section className="text-sm flex flex-col gap-4">
            <div>
              <section className="mt-4">
                <form
                  className="flex flex-col"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="storeName">Store Name</label>
                  <input
                    className="border-2 border-solid mt-1 p-2 rounded"
                    id="storeName"
                    name="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </form>
              </section>
              <section className="mt-4 flex">
                <form
                  className="flex flex-col"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="storeId">Store ID</label>
                  <div className="flex gap-2">
                    <input
                      className="border-2 border-solid mt-1 p-2 rounded"
                      id="fname"
                      name="fname"
                      value={shopId}
                      onChange={() => {}}
                    />
                    <button className="mr-4" onClick={copyToClipboard}>
                      <Image
                        src="/assets/copy-icon.svg"
                        width={14}
                        height={14}
                        alt="copy-icon"
                      />
                    </button>
                  </div>
                </form>
              </section>
              <section className="mt-4">
                <form
                  className="flex flex-col"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="storeName">Base Currency</label>
                  <div className="flex gap-2">
                    <input
                      className="border-2 border-solid mt-1 p-2 rounded"
                      id="storeName"
                      name="storeName"
                      value={baseCurrencyAddr}
                      //@ts-expect-error FIXME
                      onChange={(e) => setStoreBase(e.target.value)}
                    />
                    <button className="mr-4" onClick={copyToClipboard}>
                      <Image
                        src="/assets/copy-icon.svg"
                        width={14}
                        height={14}
                        alt="copy-icon"
                      />
                    </button>
                  </div>
                </form>
              </section>
              <section className="mt-4">
                <p>Accepted currencies:</p>
                {renderAcceptedCurrencies()}
              </section>
              <section className="mt-4">
                <form
                  className="flex flex-col"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="addTokenAddr">Add Token Address</label>
                  <p>
                    Note: for now it will add with the chainID from env file...
                  </p>
                  <div className="flex gap-2">
                    <input
                      className="border-2 border-solid mt-1 p-2 rounded"
                      id="addTokenAddr"
                      name="addTokenAddr"
                      value={addTokenAddr}
                      //@ts-expect-error FIXME
                      onChange={(e) => setAddTokenAddr(e.target.value)}
                    />
                    <SecondaryButton
                      className="mr-4"
                      onClick={addAcceptedCurrencyFn}
                    >
                      Add
                    </SecondaryButton>
                  </div>
                </form>
              </section>
            </div>
            <div></div>
          </section>
        </div>
        <div className="mt-auto mx-4">
          <Button onClick={updateStoreInfo}>Update</Button>
        </div>
      </section>
    </section>
  );
};

export default StoreProfile;
