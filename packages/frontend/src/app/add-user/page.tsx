// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import Button from "../common/components/Button";
import React, { useState, useEffect, useRef } from "react";
import AvatarUpload from "@/app/common/components/AvatarUpload";
import { useMyContext } from "@/context/MyContext";
import { useAuth } from "@/context/AuthContext";
import { IStatus } from "@/types";
import { useRouter } from "next/navigation";
import SecondaryButton from "@/app/common/components/SecondaryButton";
import { random32BytesHex } from "@massmarket/utils";
import Image from "next/image";
import { useChains } from "wagmi";
import { bytesToHex, hexToBytes } from "viem";
import { SET_STORE_DATA } from "@/reducers/storeReducer";
import { useStoreContext } from "@/context/StoreContext";
import { BlockchainClient } from "@massmarket/blockchain";

const StoreCreation = () => {
  const {
    clientWallet,
    shopId,
  } = useMyContext();

  const [addUserAddr, setAddUserAddr] = useState<string>("");
  

  const { isConnected, setIsConnected, setIsMerchantView } = useAuth();
  const chains = useChains();
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
 

  const runAddUser = async () => {
    if  (clientWallet && addUserAddr !== "") {
      const blockchainClient = new BlockchainClient(shopId);
      const walletAddr = addUserAddr as `0x${string}`;
      const result = await blockchainClient.addAdminToShop(clientWallet, walletAddr);
      console.log("user added:")
      console.log(result)
    }
  }

  return (
    <main className="pt-under-nav h-screen p-4 mt-5">
      {errorMsg ? <p>{errorMsg}</p> : null}
      <div className="flex">


      <div className="m-4">
          <p className="font-sans">General</p>
          <section className="text-sm flex flex-col gap-4">
            <div>
              <section className="mt-4">
                <form
                  className="flex flex-col"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="addUser">Add User</label>
                  <input
                    className="border-2 border-solid mt-1 p-2 rounded"
                    id="addUser"
                    name="addUser"
                    value={addUserAddr}
                    onChange={(e) => setAddUserAddr(e.target.value)}
                  />
                  <div className="mt-auto mx-4">
                   <Button onClick={runAddUser}>Add</Button>
                  </div>
                </form>
              </section>
            </div>
          </section>
        </div>
        </div>
    </main>
  );
};

export default StoreCreation;
