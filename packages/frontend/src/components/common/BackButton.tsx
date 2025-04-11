// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Link } from "@tanstack/react-router";

export default function BackButton({
  href,
  onClick,
}: {
  href?: string;
  onClick?: () => void;
}) {
  if (href) {
    return (
      <Link
        to={href}
        search={(prev: Record<string, string>) => ({
          shopId: prev.shopId,
        })}
        className="flex gap-1 items-center p-0"
        style={{ color: "black" }}
      >
        <img
          src="/icons/chevron-left.svg"
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
      <button
        onClick={onClick}
        className="flex items-center gap-1"
        style={{ backgroundColor: "transparent", padding: 0 }}
        type="button"
      >
        <img
          src="/icons/chevron-left.svg"
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
