// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

function BackButton({ href }: { href: string }) {
  return (
    <Link href={href} className="flex gap-1 items-center">
      <Image
        src={"/icons/chevron-left.svg"}
        width={8}
        height={8}
        alt="chevron-left"
        unoptimized={true}
        className="w-3 h-3"
      />
      Back
    </Link>
  );
}
export default BackButton;
