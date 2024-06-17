// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React from "react";
import Link from "next/link";
import FullModal from "@/app/common/components/FullModal";
import { useStoreContext } from "@/context/StoreContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { IStatus } from "@/types";

const _menuOptions = [
  { title: "Sales dashboard", img: "earnings.svg", href: "/earnings" },
  { title: "Shop settings", img: "store-settings.svg", href: "/store" },
  { title: "My profile", img: "profile.svg", href: "/account" },
  { title: "New shop", img: "create-store.png", href: "/create-store" },
];

const NavigationMenu = ({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) => {
  // const { db, invalidateOrder } = useStoreContext();
  const { db } = useStoreContext();

  const { setIsAuthenticated } = useAuth();

  const router = useRouter();
  const logout = () => {
    db.clear();
    setIsAuthenticated(IStatus.Pending);
    localStorage.clear();
    router.push("/");
  };
  const renderItems = () => {
    return _menuOptions.map((opt, i) => {
      return (
        <section
          data-testid={`menu-button-${opt.title}`}
          key={i}
          // className="m-4 pb-4"
          onClick={onClose}
        >
          <div className="flex">
            <Link href={opt.href} key={opt.title}>
              <h2>{opt.title}</h2>
            </Link>
          </div>
        </section>
      );
    });
  };
  return (
    <FullModal isOpen={isOpen} onClose={onClose}>
      <main>
        <div className="flex flex-col justify-between mx-4 mt-4">
          <div className="mb-4">
            <h2>Long shop name</h2>
          </div>
          <div>{renderItems()}</div>
          <div>
            <h2 onClick={logout}>Log out</h2>
          </div>

          {/* <div className="absolute bottom-0 left-0 right-0 mb-20 mx-5">
            <button
              type="button"
              className="flex justify-center bg-gradient-to-r from-button-gradient-start to-button-gradient-end w-full text-white px-4 py-4 rounded-md"
              onClick={() => {
                invalidateOrder("New sale started.");
                router.push("/products");
                onClose();
              }}
            >
              New Sale
            </button>
          </div> */}
        </div>
      </main>
    </FullModal>
  );
};

export default NavigationMenu;
