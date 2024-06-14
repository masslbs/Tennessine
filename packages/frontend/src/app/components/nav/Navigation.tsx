// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState } from "react";
import Image from "next/image";
import NavigationMenu from "./NavigationMenu";
import Button from "../../common/components/Button";
import Link from "next/link";
import { useMyContext } from "@/context/MyContext";
import { useStoreContext } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { IStatus } from "@/types";

const Navigation = () => {
  const [menuOpened, setMenuOpened] = useState<boolean>(false);

  const { avatar } = useMyContext();
  const { isAuthenticated } = useAuth();
  const { orderItems, orderId } = useStoreContext();

  const profilePhoto = avatar ? avatar : "example-avatar.svg";
  const activeCartItems = orderId && orderItems.get(orderId)?.items;
  const arr = activeCartItems ? Object.values(activeCartItems) : [];
  let len = 0;
  for (const val of arr) {
    len += val;
  }
  const loggedIn = isAuthenticated === IStatus.Complete;
  const menuSwitch = () => {
    setMenuOpened(!menuOpened);
  };

  return menuOpened ? (
    <NavigationMenu
      isOpen={menuOpened}
      onClose={() => {
        setMenuOpened(false);
      }}
    />
  ) : (
    <div className={`absolute left-0 top-0 right-0`}>
      <div className="w-full border border-gray-200 p-4 text-base flex justify-between">
        <div className="flex items-center" onClick={menuSwitch}>
          {loggedIn ? (
            <Image
              src="/assets/Menu.svg"
              width={24}
              height={24}
              alt="hamburger-icon"
              className="h-6"
            />
          ) : null}
          <p className="ml-2">
            <span className="text-primary-gray">Hey, </span> antimofm.eth
          </p>
        </div>
        {loggedIn ? (
          <div className="flex gap-4">
            <Link href="/cart" className="flex gap-2">
              <Image
                src={"/assets/Ecommerce.png"}
                width={24}
                height={24}
                alt="ecommerce"
                unoptimized={true}
              />
              <p>{len}</p>
            </Link>

            <Link href="/my-wallet">
              <Image
                src={`/assets/MassLabsLogo.svg`}
                width={24}
                height={24}
                alt="profile-avatar"
              />
            </Link>
          </div>
        ) : (
          <Button
            style={{ width: "fit-content", padding: "8px 15px" }}
            onClick={() => {}}
          >
            Connect
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navigation;
