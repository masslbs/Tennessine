// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  custom?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    //fixme: make sure button ui is clicked, not just fire onclick fn
    return (
      <button
        className={`flex justify-center items-center text-white px-5 py-3 rounded-md text-lg	
          bg-primary-dark-green disabled:bg-gray-200 disabled:text-gray-500 ${
            props.custom ? props.custom : ""
          }`}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
export default Button;
