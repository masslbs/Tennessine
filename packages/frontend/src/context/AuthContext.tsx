// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { SetStateAction, Dispatch } from "react";
import { createContext, useContext, useState } from "react";
import { Status } from "@/types";

export type IAuthContext = {
  clientConnected: Status;
  setIsConnected: Dispatch<SetStateAction<Status>>;
  isMerchantView: boolean;
  setIsMerchantView: Dispatch<SetStateAction<boolean>>;
};
export const AuthContext = createContext<IAuthContext>({
  clientConnected: Status.Pending,
  setIsConnected: () => {},
  isMerchantView: false,
  setIsMerchantView: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = (props: Props) => {
  // short circuit if not a browser session
  // this reduces build problems with next.js pre-rendering
  if (typeof window == "undefined") {
    console.warn("auth:not a browser session")
    return (<></>);
  }
  const [clientConnected, setIsConnected] = useState<Status>(Status.Pending);
  const [isMerchantView, setIsMerchantView] = useState<boolean>(false);
  return (
    <AuthContext.Provider
      value={{
        clientConnected,
        setIsConnected,
        isMerchantView,
        setIsMerchantView,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
