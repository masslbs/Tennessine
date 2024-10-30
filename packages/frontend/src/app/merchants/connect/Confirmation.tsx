// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useStoreContext } from "@/context/StoreContext";
import Button from "@/app/common/components/Button";

const Confirmation = () => {
  const { shopDetails } = useStoreContext();
  const router = useRouter();

  return (
    <main className="pt-under-nav h-screen p-4 mt-5">
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg items-center">
        <Image
          src="/icons/smiley.svg"
          width={80}
          height={80}
          alt="smiley-icon"
          unoptimized={true}
          className="w-auto h-auto"
        />
        <h1 className="font-bold">Welcome Back</h1>
      </section>
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg ">
        <h2 className="font-bold">{shopDetails.name}</h2>
        <Button
          onClick={() => {
            router.push("/merchant-dashboard");
          }}
        >
          Shop Dashboard
        </Button>
      </section>
    </main>
  );
};

export default Confirmation;
