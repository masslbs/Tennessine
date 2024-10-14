// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Chevron from "./Chevron";

const CurrencyButton = ({ toggle }: { toggle: () => void }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="flex gap-2 text-sm max-h-20">
      <div
        id="sortOption-button"
        className="flex border gap-1 rounded-xl py-2 px-4 bg-primary-gray ml-auto"
        onClick={() => {
          toggle();
          setOpen(!open);
        }}
      >
        <Image
          src="/assets/Ethereum.svg"
          width={19}
          height={19}
          alt="eth-icon"
        />
        <p className="flex items-center text-white px-1">USDC</p>
        <Chevron open={open} />
      </div>
    </div>
  );
};

export default CurrencyButton;
