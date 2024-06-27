// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { SetStateAction, Dispatch } from "react";
import { createContext, useContext, useState } from "react";
import { IStatus } from "@/types";

export type IAuthContext = {
  isAuthenticated: IStatus;
  setIsAuthenticated: Dispatch<SetStateAction<IStatus>>;
  hasAllAccess: boolean;
  setHasAllAccess: Dispatch<SetStateAction<boolean>>;
};
export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: IStatus.Pending,
  setIsAuthenticated: () => {},
  hasAllAccess: false,
  setHasAllAccess: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = (props: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<IStatus>(
    IStatus.Pending,
  );
  const [hasAllAccess, setHasAllAccess] = useState<boolean>(false);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        hasAllAccess,
        setHasAllAccess,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
