import React from "react";
import Image from "next/image";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export function ConnectWalletButton() {
  const { openConnectModal } = useConnectModal();

  return (
    <button
      data-testid="connect-wallet"
      className="rounded-lg flex flex-col items-center gap-2"
      onClick={openConnectModal}
    >
      <Image
        src="/icons/wallet-icon.svg"
        width={40}
        height={40}
        alt="wallet-icon"
        unoptimized={true}
        className="w-10 h-10"
      />
      <div className="flex gap-2 items-center">
        <p>Connect wallet</p>
        <Image
          src="/icons/chevron-right.svg"
          width={12}
          height={12}
          alt="chevron"
          unoptimized={true}
          className="w-3 h-3"
        />
      </div>
    </button>
  );
}