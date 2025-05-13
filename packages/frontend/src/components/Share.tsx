import { useState } from "react";
import { useSearch } from "@tanstack/react-router";

import BackButton from "./common/BackButton.tsx";
import { useShopDomain } from "../hooks/useShopDomain.ts";
import { env } from "../utils/env.ts";

export default function Share() {
  const search = useSearch({ strict: false });
  const shopId = search?.shopId || env.shopTokenId || "";
  const { protocol, shopDomain } = useShopDomain();
  const [copiedToClipboard, setCopied] = useState<boolean>(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(
      `${protocol}//${shopDomain}/listings?shopId=${shopId}`,
    );
    setCopied(true);
  }
  return (
    <main className="px-4 flex justify-center">
      <section className="md:w-[800px] w-full">
        <BackButton />
        <h1 className="py-3">Share</h1>
        <section className="mt-2 flex flex-col gap-1 bg-white p-5 rounded-lg">
          <div className="flex justify-between">
            <h3>Link</h3>
            {copiedToClipboard ? <div>copied!</div> : null}
          </div>
          <div className="flex gap-2">
            <input
              className="border-2 border-solid mt-1 p-2 rounded w-full"
              id="shopId"
              name="shopId"
              value={`${protocol}//${shopDomain}/listings?shopId=${shopId}`}
              onChange={() => {}}
            />
            <button
              type="button"
              className="mr-4 cursor-pointer"
              style={{ backgroundColor: "transparent", padding: 0 }}
              onClick={copyToClipboard}
            >
              <img
                src="/icons/copy-icon.svg"
                width={14}
                height={14}
                alt="copy-icon"
                className="w-auto h-auto"
              />
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
