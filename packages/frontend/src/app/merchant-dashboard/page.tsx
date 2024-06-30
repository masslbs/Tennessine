"use client";

import React from "react";
import Link from "next/link";
import { useMerchantContext } from "@/context/MerchantContext";
import { useStoreContext } from "@/context/StoreContext";

const MerchantDashboard = () => {
  const { storeIds } = useMerchantContext();
  const { storeData } = useStoreContext();
  console.log({ storeIds, storeData });
  return (
    <main className="pt-under-nav h-screen p-5">
      <h1 className="mt-10">{storeData.name}</h1>
      <div className="flex text-xs gap-1">
        <div className="flex">
          <Link href="/create-store">
            <h2>New store</h2>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default MerchantDashboard;
