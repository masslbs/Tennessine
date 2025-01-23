// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Link } from "@tanstack/react-router";
import Button from "../common/Button.tsx";
import { useShopDetails } from "../../hooks/useShopDetails.ts";

export default function ConnectConfirmation() {
  const { shopDetails } = useShopDetails();
  return (
    <main className="pt-under-nav h-screen p-4 mt-5">
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg items-center">
        <img
          src="/icons/smiley.svg"
          width={80}
          height={80}
          alt="smiley-icon"
          className="w-auto h-auto"
        />
        <h1 className="font-bold">Welcome Back</h1>
      </section>
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg ">
        <h2 className="font-bold">{shopDetails.name}</h2>
        <Button>
          <Link
            to="/merchant-dashboard"
            search={(prev: Record<string, string>) => ({ shopId: prev.shopId })}
          >
            Shop Dashboard
          </Link>
        </Button>
      </section>
    </main>
  );
}
