// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { ReactNode } from "react";
import Image from "next/image";

export type Header = {
  headerText: string;
  goBack: () => void;
  rightIcon?: ReactNode;
};

const ModalHeader = ({ goBack, headerText, rightIcon }: Header) => {
  return (
    <div className="py-4 mx-4">
      <div id="container" className="flex relative">
        <Image
          id="overlay"
          src="/assets/left-arrow.svg"
          width={24}
          height={24}
          alt="left-arrow-icon"
          onClick={goBack}
          className="absolute margin-auto top-0 bottom-0 left-0 right-0"
        />
        <div className="flex justify-center w-full">
          <h1 className={`${rightIcon ? "pl-6" : ""}`}>{headerText}</h1>
        </div>
        {rightIcon && <div className="w-10 flex justify-end">{rightIcon}</div>}
      </div>
    </div>
  );
};

export default ModalHeader;
