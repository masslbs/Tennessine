// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import debugLib from "debug";
import React from "react";
import { useState, type ReactNode } from "react";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { config } from "../wagmi";
import { UserContextProvider } from "../context/UserContext";
import { StoreContextProvider } from "../context/StoreContext";
import { AuthProvider } from "@/context/AuthContext";
import { MerchantProvider } from "@/context/MerchantContext";

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  if (process.env.NEXT_PUBLIC_DEBUG) {
    debugLib.enable(process.env.NEXT_PUBLIC_DEBUG);
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AuthProvider>
            <UserContextProvider>
              <StoreContextProvider>
                <MerchantProvider>{props.children}</MerchantProvider>
              </StoreContextProvider>
            </UserContextProvider>
          </AuthProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
