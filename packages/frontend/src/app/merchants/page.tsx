// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect, useState } from "react";
import Button from "@/app/common/components/Button";
import { useUserContext } from "@/context/UserContext";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Status } from "@/types";
import MerchantConnectWallet from "@/app/components/login/MerchantConnectWallet";

function MerchantHomepage() {
  const [openConnectModal, setOpenConnectModal] = useState<boolean>(false);

  const { setInviteSecret } = useUserContext();
  const { clientConnected, isMerchantView } = useAuth();
  const searchParams = useSearchParams();
  const inviteSecret = searchParams!.get("inviteSecret") as `0x${string}`;
  const router = useRouter();

  useEffect(() => {
    if (clientConnected === Status.Complete && isMerchantView) {
      router.push("/merchant-dashboard");
    }
  }, [clientConnected, isMerchantView]);

  if (inviteSecret) {
    setInviteSecret(inviteSecret);
  }

  const connectAction =
    clientConnected === Status.Complete
      ? () => router.push("/products")
      : () => setOpenConnectModal(true);

  if (openConnectModal) {
    return (
      <MerchantConnectWallet
        close={() => {
          setOpenConnectModal(false);
        }}
      />
    );
  }

  return (
    <main className="min-h-screen overflow-hidden flex flex-col">
      <section className=" grow flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <h1 className="text-4xl">Mass Market</h1>
        </div>
      </section>
      <section className="bg-gray-300 p-8 mt-auto">
        <div>
          <Button
            onClick={connectAction}
            color={
              "bg-gradient-to-r from-button-gradient-start to-button-gradient-end"
            }
          >
            Connect Wallet
          </Button>
        </div>
      </section>
    </main>
  );
}

export default MerchantHomepage;
