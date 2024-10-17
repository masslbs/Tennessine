// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useUserContext } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { Status } from "@/types";
import { useStoreContext } from "@/context/StoreContext";
import { useRouter, useSearchParams } from "next/navigation";
import FullModal from "@/app/common/components/FullModal";
import Link from "next/link";
import SecondaryButton from "@/app/common/components/SecondaryButton";
import { createQueryString } from "@/app/utils";

const _menuOptions = [
  {
    title: "Sales dashboard",
    img: "earnings.svg",
    href: "/merchant-dashboard",
  },
  { title: "Shop settings", img: "store-settings.svg", href: "/store" },
  { title: "New shop", img: "create-store.png", href: "/create-store" },
];

const Navigation = () => {
  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const { setIsConnected, isMerchantView } = useAuth();
  const { shopDetails } = useStoreContext();
  const { ensName } = useUserContext();
  const searchParams = useSearchParams();
  const router = useRouter();

  const logout = () => {
    setIsConnected(Status.Pending);
    localStorage.clear();
    router.push("/");
  };

  const menuSwitch = () => {
    setMenuOpened(!menuOpened);
  };

  const renderItems = () => {
    return _menuOptions.map((opt, i) => {
      return (
        <section
          data-testid={`menu-button-${opt.title}`}
          key={i}
          onClick={() => setMenuOpened(false)}
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

  return menuOpened && isMerchantView ? (
    <FullModal isOpen={menuOpened}>
      <main>
        <div className="w-full border border-gray-200 p-4 text-base flex justify-between">
          <p>{ensName}</p>
          <div className="flex gap-4">
            <button onClick={menuSwitch}>
              <Image
                src={
                  shopDetails.profilePictureUrl
                    ? shopDetails.profilePictureUrl
                    : `/assets/MassLabsLogo.svg`
                }
                width={40}
                height={40}
                alt="profile-avatar"
                unoptimized={true}
              />
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-between mx-4 mt-4">
          <div className="mb-4">
            <h2>{shopDetails.name}</h2>
            <div className="flex text-xs gap-1">
              <SecondaryButton onClick={menuSwitch}>
                <Link className="flex items-center gap-1" href="/products">
                  Go to Shop
                  <Image
                    src="/assets/forward-button.svg"
                    width={12}
                    height={12}
                    alt="forward-icon"
                  />
                </Link>
              </SecondaryButton>
              <SecondaryButton onClick={menuSwitch}>
                <Link
                  href={`/products/edit?${createQueryString("itemId", "new", searchParams)}`}
                  onClick={menuSwitch}
                >
                  Add Product +
                </Link>
              </SecondaryButton>
            </div>
          </div>
          <div>{renderItems()}</div>
          <div>
            <h2 onClick={logout}>Log out</h2>
          </div>
        </div>
      </main>
    </FullModal>
  ) : (
    <div className={`absolute left-0 top-0 right-0`}>
      <div className="w-full p-4 text-base flex justify-between bg-white">
        <div className="flex gap-2">
          <Image
            src={
              shopDetails.profilePictureUrl
                ? shopDetails.profilePictureUrl
                : `/icons/mass-labs-logo.svg`
            }
            width={29}
            height={25}
            alt="profile-avatar"
            unoptimized={true}
            priority={true}
          />
          <h2>{shopDetails.name}</h2>
        </div>
        <button onClick={menuSwitch}>
          <Image
            src="/icons/hamburger.svg"
            width={23}
            height={18}
            alt="hamburger"
            unoptimized={true}
          />
        </button>
      </div>
    </div>
  );
};

export default Navigation;
