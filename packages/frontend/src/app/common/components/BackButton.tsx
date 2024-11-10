// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React from "react";
import Link from "next/link";

function BackButton({
  href,
  onClick,
}: {
  href?: string;
  onClick?: () => void;
}) {
  if (href) {
    return (
      <Link href={href} className="flex gap-1 items-center">
        <img
          src={"/icons/chevron-left.svg"}
          width={8}
          height={8}
          alt="chevron-left"
          className="w-3 h-3"
        />
        Back
      </Link>
    );
  } else if (onClick) {
    return (
      <button onClick={onClick} className="flex items-center gap-1">
        <img
          src={"/icons/chevron-left.svg"}
          width={8}
          height={8}
          alt="chevron-left"
          className="w-3 h-3"
        />
        Back
      </button>
    );
  }
}
export default BackButton;
