// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
import Link from "next/link";

import Button from "@/app/common/components/Button";

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
        <Link href="/products">Return to shop</Link>
      </Button>
    </section>
  );
}
