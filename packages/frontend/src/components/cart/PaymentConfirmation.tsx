import { useNavigate } from "@tanstack/react-router";

import Button from "../common/Button.tsx";

export default function PaymentConfirmation(
  { displayedAmount, hash }: { displayedAmount: string; hash: string | null },
) {
  const navigate = useNavigate();

  function copyToClipboard() {
    navigator.clipboard.writeText(hash || "Hash not available");
  }

  return (
    <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg items-center">
      <img
        src="/icons/smiley.svg"
        width={80}
        height={80}
        alt="smiley-icon"
        className="w-20 h-20"
      />
      <h1>Payment Successful</h1>
      <div className="flex gap-2 items-center">
        <img
          src="/icons/usdc-coin.png"
          alt="coin"
          width={24}
          height={24}
          className="w-6 h-6 max-h-6"
        />
        <h1>{displayedAmount}</h1>
      </div>
      <p>Your order has been completed.</p>
      <div className="flex-col items-center gap-2 flex">
        <p>Tx hash:</p>
        <div className="flex gap-2">
          <input
            className="border-2 border-solid mt-1 p-2 rounded"
            id="txHash"
            name="txHash"
            value={hash || ""}
            onChange={() => {
              console.log("hash copied");
            }}
          />
          <button
            className="mr-4 p-0 bg-transparent"
            onClick={copyToClipboard}
          >
            <img
              src="/icons/copy-icon.svg"
              width={14}
              height={14}
              alt="copy-icon"
              className="w-auto h-auto"
            />
          </button>
        </div>
      </div>
      <Button
        onClick={() => {
          navigate({
            to: "/listings",
            search: (prev: Record<string, string>) => ({
              shopId: prev.shopId,
            }),
          });
        }}
      >
        <p>Back to listings</p>
      </Button>
    </section>
  );
}
