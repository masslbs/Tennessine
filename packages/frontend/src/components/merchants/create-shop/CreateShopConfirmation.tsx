// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import ButtonLink from "../../common/ButtonLink.tsx";

export default function Confirmation() {
  return (
    <section className="md:w-[560px] p-5" data-testid="mint-shop-confirmation">
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg items-center text-center">
        <img
          src="/icons/smiley.svg"
          width={80}
          height={80}
          alt="smiley-icon"
          className="w-auto h-auto"
        />
        <h1 className="font-bold" data-testid="confirmation">
          Congratulations!
        </h1>
        <h1>Your shop has been created</h1>
      </section>

      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg ">
        <h2 className="font-bold">Next steps</h2>
        <div>
          <ButtonLink to="/merchants">View Dashboard</ButtonLink>
        </div>
      </section>
    </section>
  );
}
