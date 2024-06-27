"use client";

import React from "react";
import SecondaryButton from "@/app/common/components/SecondaryButton";
import Image from "next/image";
import Link from "next/link";

const MerchantDashboard = () => {
  return (
    <main className="pt-under-nav h-screen p-5">
      <h1 className="mt-10">Long shop name</h1>
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
