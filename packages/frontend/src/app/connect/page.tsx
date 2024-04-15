"use client";

import React from "react";
import ConnectWallet from "../components/login/ConnectWallet";
import { useRouter } from "next/navigation";

const Connect = () => {
  const router = useRouter();

  return (
    <ConnectWallet
      close={() => {
        router.push("/");
      }}
    />
  );
};

export default Connect;
