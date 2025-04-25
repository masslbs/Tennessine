import React from "react";
import { Link } from "@tanstack/react-router";
import Button from "./Button.tsx";

interface ButtonLinkProps {
  to: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function ButtonLink({
  to,
  children,
  style,
}: ButtonLinkProps) {
  return (
    <Button>
      <Link
        to={to}
        search={(prev: Record<string, string>) => ({
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
