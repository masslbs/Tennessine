// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useShopDetails } from "../../hooks/useShopDetails.ts";
import ButtonLink from "../common/ButtonLink.tsx";

export default function ConnectConfirmation() {
  const { shopDetails } = useShopDetails();
  return (
    <div data-testid="connect-confirmation" className="md:w-[560px]">
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
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg items-center">
        <h2 className="font-bold">{shopDetails.name}</h2>
        <ButtonLink to="/merchant-dashboard">Shop Dashboard</ButtonLink>
      </section>
    </div>
  );
}
