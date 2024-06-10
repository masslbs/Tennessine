"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const CurrencyButton = ({ toggle }) => {
  const [closed, setClosed] = useState<boolean>(true);
  return (
    <div className="flex gap-2 py-4 text-sm">
      <div
        id="sortOption-button"
        className="flex border gap-1 rounded-xl py-2 px-4 bg-primary-gray ml-auto"
        onClick={() => {
          toggle();
          setClosed(!closed);
        }}
      >
        <Image
          src="/assets/Ethereum.svg"
          width={19}
          height={19}
          alt="eth-icon"
        />
        <p className="flex items-center text-white px-1">USDC</p>
        {closed ? (
          <Image
            src="/assets/chevron-down.svg"
            width={13}
            height={13}
            alt="down-icon"
          />
        ) : (
          <Image
            src="/assets/chevron-up.svg"
            width={13}
            height={13}
            alt="up-icon"
          />
        )}
      </div>
    </div>
  );
};

export default CurrencyButton;
