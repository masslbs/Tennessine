// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Link } from "@tanstack/react-router";
import Button from "../common/Button.tsx";

export default function TimerExpiration() {
  return (
    <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg items-center">
      <img
        src="/icons/timer-expired.svg"
        width={80}
        height={80}
        alt="timer-expired"
        className="w-auto h-auto"
      />
      <h1>Timer expired</h1>
      <p className="text-lg">Sorry your timer has expired.</p>
      <Button>
        <Link
          to="/listings"
          search={(prev: Record<string, string>) => ({
            shopId: prev.shopId,
          })}
          style={{
            color: "white",
          }}
        >
          Return to shop
        </Link>
      </Button>
    </section>
  );
}
