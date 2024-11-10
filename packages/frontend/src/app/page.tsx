// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect } from "react";

import { useUserContext } from "@/context/UserContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useClient } from "@/context/AuthContext";
import { Status } from "../types";

// add _mtm to global for matomo
declare global {
  interface Window {
    _mtm: any;
  }
}

function Homepage() {
  const { setInviteSecret } = useUserContext();
  const { clientConnected } = useClient();
  const searchParams = useSearchParams();
  const inviteSecret = searchParams!.get("inviteSecret") as `0x${string}`;
  const router = useRouter();

  // setup matomo
  const matomoUrl = process.env.NEXT_PUBLIC_MATOMO_URL || null;
  useEffect(() => {
    if (matomoUrl) {
      const _mtm = (window._mtm = window._mtm || []);
      _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
      var d = document,
        g = d.createElement("script"),
        s = d.getElementsByTagName("script")[0];
      g.async = true;
      g.src = matomoUrl;
      s.parentNode.insertBefore(g, s);
    }
  }, [matomoUrl]);

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
