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
import { UPDATE_STORE_NAME, UPDATE_STORE_PIC } from "@/reducers/storeReducer";

const StoreProfile = ({ close }: { close: () => void }) => {
  const { storeData, setStoreData } = useStoreContext();
  const { relayClient } = useMyContext();
  const [storeName, setStoreName] = useState<string>(storeData?.name);
  // const [storeURL, setStoreURL] = useState<string>("ethdubai.mass.market");
  const [avatar, setAvatar] = useState<FormData | null>(null);
  const { shopId } = useMyContext();

  useEffect(() => {
    setStoreName(storeData?.name);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shopId!);
  };

  const updateStoreInfo = async () => {
    let path;
    if (avatar) {
      path = await relayClient!.uploadBlob(avatar as FormData);
      setStoreData({
        type: UPDATE_STORE_PIC,
        payload: { profilePictureUrl: path.url },
      });
    }
    setStoreData({
      type: UPDATE_STORE_NAME,
      payload: { name: storeName },
    });

    avatar
      ? await relayClient!.updateShopManifest({
          name: storeName,
          profilePictureUrl: path.url,
        })
      : await relayClient!.updateShopManifest({
          name: storeName,
        });
    close();
  };

  return (
    <section className="pt-under-nav h-screen">
      <ModalHeader headerText="Store Profile" goBack={close} />
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
