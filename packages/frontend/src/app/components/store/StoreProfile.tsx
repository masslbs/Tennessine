// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React from "react";
import ModalHeader from "../../common/components/ModalHeader";
// import PhotoUpload from "../../common/components/PhotoUpload";
// import Button from "../../common/components/Button";
import { useStoreContext } from "@/context/StoreContext";
import { useMyContext } from "@/context/MyContext";
import Image from "next/image";

const StoreProfile = ({ close }: { close: () => void }) => {
  // const [storeName, setStoreName] = useState<string>("ethDubai");
  // const [storeURL, setStoreURL] = useState<string>("ethdubai.mass.market");
  // const [avatar, setAvatar] = useState<string | null>(null);
  const { storeData } = useStoreContext();
  const { shopId } = useMyContext();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shopId!);
  };

  return (
    <section className="pt-under-nav h-screen">
      <ModalHeader headerText="Store Profile" goBack={close} />
      <section className="flex flex-col h-5/6">
        {/* <PhotoUpload img={avatar} setImgSrc={setAvatar} /> */}
        <div className="m-4">
          <p className="font-sans">General</p>
          <section className="text-sm flex flex-col gap-4">
            <div>
              {/* FIXME: make this text area into reusuable component */}
              <section className="mt-4">
                <form
                  className="flex flex-col"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="fname">Store Name</label>
                  <input
                    className="border-2 border-solid mt-1 p-2 rounded"
                    id="fname"
                    name="fname"
                    value={storeData.name}
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
        {/* <div className="mt-auto mx-4">
          <Button disabled={true} onClick={() => null}>
            Update
          </Button>
        </div> */}
      </section>
    </section>
  );
};

export default StoreProfile;
