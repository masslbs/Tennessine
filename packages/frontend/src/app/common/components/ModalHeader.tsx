// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import CartButton from "@/app/components/checkout/CartButton";
import { useRouter } from "next/navigation";

export type Header = {
  headerText: string;
  goBack: () => void;
  rightIcon?: ReactNode;
};

const ModalHeader = () => {
  const router = useRouter();

  return (
    <div className="mx-4">
      <div className="flex">
        <Image
          src="/assets/chevron-left.svg"
          width={24}
          height={24}
          alt="left-arrow-icon"
          onClick={() => router.back()}
        />
        <h2 className="ml-2 text-primary-gray">back</h2>
        <div className="w-10 flex justify-end ml-auto">
          <CartButton />
        </div>
      </div>
    </div>
  );
};

export default ModalHeader;
