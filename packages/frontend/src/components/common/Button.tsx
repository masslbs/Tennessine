// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  custom?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref: React.ForwardedRef<HTMLButtonElement>) => {
    return (
      <button
        className={`flex justify-center items-center rounded-md
          disabled:bg-gray-200 disabled:text-gray-500 ${
          props.custom ? props.custom : ""
        }`}
        style={{
          padding: "8px 12px",
          backgroundColor: "#3b513e",
          color: "white",
          fontSize: "18px",
        }}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
export default Button;
