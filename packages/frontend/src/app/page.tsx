// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect } from "react";

import { useUserContext } from "@/context/UserContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useClient } from "@/context/AuthContext";
import { Status } from "../types";

function Homepage() {
  const { setInviteSecret } = useUserContext();
  const { clientConnected } = useClient();
  const searchParams = useSearchParams();
  const inviteSecret = searchParams!.get("inviteSecret") as `0x${string}`;
  const router = useRouter();

  useEffect(() => {
    if (clientConnected === Status.Complete) {
      router.push("/products");
    }
  }, [clientConnected]);

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
    </main>
  );
}

export default Homepage;
