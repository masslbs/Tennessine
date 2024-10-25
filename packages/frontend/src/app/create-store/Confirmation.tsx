// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { useUserContext } from "@/context/UserContext";
import Button from "@/app/common/components/Button";

const Confirmation = () => {
  const { shopId } = useUserContext();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shopId!);
  };

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
        <h1 className="font-bold" data-testid="confirmation">
          Congratulations!
        </h1>
        <h1>Your shop has been created</h1>
      </section>
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg ">
        <h2 className="font-bold">shop ID</h2>
        <p className="text-lg">
          This is your shop’s ID. If you would like to access your shop in the
          future, you should write this down. If your cache gets cleared, there
          will be no other way to re-access this shop again (until we build an
          indexer!) so we recommend that you really write it down.
        </p>
        <div className="flex gap-2">
          <div className="bg-background-gray p-2 rounded-md overflow-x-auto w-40">
            <p>{shopId}</p>
          </div>
          <button onClick={copyToClipboard}>
            <Image
              src="/icons/copy-icon.svg"
              width={20}
              height={20}
              alt="copy-icon"
              unoptimized={true}
              className="w-auto h-auto ml-auto"
            />
          </button>
        </div>
      </section>
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg ">
        <h2 className="font-bold">Next steps</h2>
        <Button>
          <Link href="/merchant-dashboard">View Dashboard</Link>
        </Button>
      </section>
    </main>
  );
};

export default Confirmation;
