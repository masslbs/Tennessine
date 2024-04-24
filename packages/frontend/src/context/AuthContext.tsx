// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { SetStateAction, Dispatch } from "react";
import { createContext, useContext, useState } from "react";
import { IStatus } from "@/types/index";

export type IAuthContext = {
  isAuthenticated: IStatus;
  setIsAuthenticated: Dispatch<SetStateAction<IStatus>>;
};
const AuthContext = createContext<IAuthContext>({
  isAuthenticated: IStatus.Pending,
  setIsAuthenticated: () => {},
});

type Props = {
  children: React.ReactNode;
  params: { prefName: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export const AuthProvider = (props: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<IStatus>(
    IStatus.Pending
  );
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
