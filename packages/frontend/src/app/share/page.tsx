// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React from "react";
import BackButton from "@/app/common/components/BackButton";
import { useUserContext } from "@/context/UserContext";

function Share() {
  const { shopId } = useUserContext();
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shopId!);
  };

  return (
    <main className="pt-under-nav h-screen bg-gray-100">
      <section className="m-4">
        <BackButton href="/products" />
        <div className="flex mt-2">
          <h1>Share</h1>
        </div>
        <section className="mt-2 flex flex-col bg-white p-5 rounded-lg">
          <h3>Link</h3>
          <div className="flex gap-2 mt-4">
            <div className="bg-background-gray p-2 rounded-md overflow-x-auto w-40">
              <p>{shopId}</p>
            </div>
            {/* FIXME: this should be shop link */}
            <button onClick={copyToClipboard}>
              <img
                src="/icons/copy-icon.svg"
                width={20}
                height={20}
                alt="copy-icon"
                className="w-auto h-auto ml-auto"
              />
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Share;
