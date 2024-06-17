// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState } from "react";
import Image from "next/image";
import NavigationMenu from "./NavigationMenu";
import Button from "../../common/components/Button";
import { useMyContext } from "@/context/MyContext";
import { useAuth } from "@/context/AuthContext";
import { IStatus } from "@/types";

const Navigation = () => {
  const [menuOpened, setMenuOpened] = useState<boolean>(false);

  const { avatar, name } = useMyContext();
  const { isAuthenticated } = useAuth();

  // const profilePhoto = avatar ? avatar : "example-avatar.svg";

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
        <div
          className="flex items-center text-primary-gray"
          onClick={menuSwitch}
        >
          {loggedIn ? (
            <div className="flex gap-2">
              <Image
                src="/assets/back-button.svg"
                width={12}
                height={12}
                alt="hamburger-icon"
                className="h-6"
              />
              <p>back</p>
            </div>
          ) : null}
          <p className="ml-5">{name || "antimofm.eth"}</p>
        </div>
        {loggedIn ? (
          <div className="flex gap-4">
            <button onClick={menuSwitch}>
              <Image
                src={`/assets/MassLabsLogo.svg`}
                width={24}
                height={24}
                alt="profile-avatar"
              />
            </button>
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
