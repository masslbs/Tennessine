// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import Button from "@/app/common/components/Button";
import { useUserContext } from "@/context/UserContext";

function MerchantHomepage() {
  const { setInviteSecret } = useUserContext();
  const searchParams = useSearchParams();
  const inviteSecret = searchParams!.get("inviteSecret") as `0x${string}`;

  if (inviteSecret) {
    setInviteSecret(inviteSecret);
  }

  return (
    <main className="min-h-screen overflow-hidden flex flex-col">
      <section className=" grow flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <h1 className="text-4xl">Mass Market</h1>
        </div>
      </section>
      <section className="bg-gray-300 p-8 mt-auto">
        <div className="flex flex-col gap-2">
          <Button custom="w-auto">
            <Link href={"/merchants/connect"}>Connect to shop</Link>
          </Button>
          <Button>
            <Link href={"/create-store"}>Create Shop</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

export default MerchantHomepage;
