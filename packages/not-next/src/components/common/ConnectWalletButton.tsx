import { useConnectModal } from "@rainbow-me/rainbowkit";

export default function ConnectWalletButton() {
  const { openConnectModal } = useConnectModal();

  return (
    <button
      data-testid="connect-wallet"
      className="rounded-lg flex flex-col items-center gap-2"
      onClick={openConnectModal}
    >
      <img
        src="/icons/wallet-icon.svg"
        width={40}
        height={40}
        alt="wallet-icon"
        className="w-10 h-10"
      />
      <div className="flex gap-2 items-center">
        <p>Connect wallet</p>
        <img
          src="/icons/chevron-right.svg"
          width={12}
          height={12}
          alt="chevron"
          className="w-3 h-3"
        />
      </div>
    </button>
  );
}
