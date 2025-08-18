import React from "react";
import { Link } from "@tanstack/react-router";
import Button from "./Button.tsx";

interface ButtonLinkProps {
  to: string;
  children: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
  search?: Record<string, string>;
}

export default function ButtonLink({
  to,
  children,
  style,
  disabled,
  search,
}: ButtonLinkProps) {
  return (
    <Button disabled={disabled}>
      <Link
        to={to}
        search={(prev: Record<string, string>) =>
          search ?? ({
            shopId: prev.shopId,
          })}
        style={{
          color: "white",
          ...style,
        }}
      >
        <div className="flex gap-2 items-center">
          <p>{children}</p>
          <img
            src="/icons/white-arrow.svg"
            alt="white-arrow"
            width={7}
            height={12}
          />
        </div>
      </Link>
    </Button>
  );
}
