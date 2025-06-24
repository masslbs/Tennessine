// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useRouter } from "@tanstack/react-router";

export default function BackButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  const router = useRouter();
  return (
    <button
      onClick={onClick ? onClick : () => router.history.back()}
      className="flex gap-[10px] items-center p-0 mt-[10px] text-lg font-light"
      style={{ color: "black" }}
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
