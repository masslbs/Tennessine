// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import FullModal from "@/app/common/components/FullModal";
import { useStoreContext } from "@/context/StoreContext";
import { useRouter } from "next/navigation";

const _menuOptions = [
  // { title: "home", img: "home.svg", href: "/" },
  { title: "products", img: "products.svg", href: "/products" },
  { title: "transactions", img: "transactions.svg", href: "/transactions" },
  { title: "earnings", img: "earnings.svg", href: "/earnings" },
  { title: "store settings", img: "store-settings.svg", href: "/store" },
  { title: "create store", img: "create-store.png", href: "/create-store" },
  { title: "profile", img: "profile.svg", href: "/account" },
];

const NavigationMenu = ({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) => {
  const { invalidateCart } = useStoreContext();
  const router = useRouter();

  const renderItems = () => {
    return _menuOptions.map((opt, i) => {
      return (
        <section
          data-testid={`menu-button-${opt.title}`}
          key={i}
          className="m-4 pb-4"
          onClick={onClose}
        >
          <div className="flex">
            <Image
              src={`/assets/${opt.img}`}
              width={24}
              height={24}
              alt={`${opt.title}-icon`}
              unoptimized={true}
            />
            <Link href={opt.href} key={opt.title}>
              <h1 className="ml-4">{opt.title}</h1>
            </Link>
          </div>
        </section>
      );
    });
  };
  return (
    <FullModal isOpen={isOpen} onClose={onClose} showAvatar={true}>
      <main>
        <div className="flex flex-col justify-between mx-4">
          <div>
            <section className="flex mt-4 mb-10">
              <div className="mr-4">
                <Image
                  src="/assets/ethDubai.png"
                  width={56}
                  height={56}
                  alt="ethDubai-icon"
                  unoptimized={true} // TODO: pre-scale images
                />
              </div>
              <div>
                <h1 className="text-2xl">EthDubai</h1>
                <p className="text-sm text-gray-500">EthDubai.Mass.Market</p>
              </div>
            </section>
            {renderItems()}
          </div>
          <div className="absolute bottom-0 left-0 right-0 mb-20 mx-5">
            <button
              type="button"
              className="flex justify-center bg-gradient-to-r from-button-gradient-start to-button-gradient-end w-full text-white px-4 py-4 rounded-md"
              onClick={() => {
                invalidateCart("New sale started.");
                router.push("/products");
                onClose();
              }}
            >
              New Sale
            </button>
          </div>
        </div>
      </main>
    </FullModal>
  );
};

export default NavigationMenu;
