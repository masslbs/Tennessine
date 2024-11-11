// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  custom?: string;
}

const SecondaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    return (
      <button
        className={`flex justify-center px-5 py-3 rounded-md text-lg bg-background-gray disabled:bg-gray-200 disabled:text-gray-500 ${
          props.custom ? props.custom : ""
        }`}
        ref={ref}
        {...props}
      />
    );
  },
);
SecondaryButton.displayName = "Button";
export default SecondaryButton;
