// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later
import { Link } from "@tanstack/react-router";

interface SuccessToastProps {
  message: string | null;
  onClose: () => void;
  cta?: { copy: string; href: string };
}

export default function SuccessToast(
  { message, onClose, cta }: SuccessToastProps,
) {
  if (!message) return null;

  return (
    <div
      className="px-4 py-2 bg-success-green text-white font-thin rounded-lg flex items-center"
      data-testid="success-toast"
    >
      <p data-testid="success-toast-text">{message}</p>
      {cta
        ? (
          <Link
            style={{ color: "white" }}
            className="ml-auto flex gap-2"
            to={cta.href}
            search={(prev: Record<string, string>) => ({
              shopId: prev.shopId,
            })}
          >
            <p>{cta.copy}</p>
            <img
              src="/icons/white-arrow.svg"
              alt="white-arrow"
              width={7}
              height={12}
            />
          </Link>
        )
        : (
          <button
            onClick={() => onClose()}
            className="ml-auto"
            style={{ backgroundColor: "transparent", padding: 0 }}
            type="button"
          >
            <div className="bg-white rounded-full w-4 h-4 flex justify-center items-center">
              <img
                src="/icons/close-icon.svg"
                alt="close-icon"
                width={8}
                height={8}
                className="w-2 h-2"
              />
            </div>
          </button>
        )}
    </div>
  );
}
