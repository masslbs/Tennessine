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

// @ts-ignore
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<IStatus>(
    IStatus.Pending,
  );
  return (
    // @ts-ignore
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
