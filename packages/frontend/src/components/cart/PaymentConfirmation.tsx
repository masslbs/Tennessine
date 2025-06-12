import { type Chain } from "wagmi/chains";

import { getLogger } from "@logtape/logtape";
import ButtonLink from "../common/ButtonLink.tsx";

const logger = getLogger(["mass-market", "frontend", "PaymentConfirmation"]);

export default function PaymentConfirmation(
  { displayedAmount, txHash, blockHash, paymentChain }: {
    displayedAmount: string;
    txHash: string | null;
    blockHash: string | null;
    paymentChain: Chain | undefined;
  },
) {
  if (!paymentChain) {
    throw new Error("Payment chain not found");
  }
  const explorerUrl = paymentChain.blockExplorers?.default?.url || null;
  function copyToClipboard() {
    navigator.clipboard.writeText(txHash || blockHash || "Hash not available");
  }
  return (
    <section className="md:flex justify-center px-4">
      <section className="mt-15 flex flex-col gap-4 bg-white p-5 rounded-lg items-center md:w-[560px]">
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
          <h1 data-testid="displayed-amount">{displayedAmount}</h1>
        </div>
        <p className="font-inter">Your order has been completed.</p>
        <div className="flex-col items-center gap-2 flex">
          <p>
            {txHash
              ? "Tx hash:"
              : blockHash
              ? "Block hash:"
              : "Hash unavailable"}
          </p>
          <div className="flex gap-2">
            <input
              className="border-2 border-solid mt-1 p-2 rounded"
              id="txHash"
              name="txHash"
              data-testid="tx-hash-input"
              value={txHash || blockHash || ""}
              onChange={() => {
                logger.debug("hash copied");
              }}
            />
            <button
              className="mr-4"
              style={{ backgroundColor: "transparent", padding: 0 }}
              onClick={copyToClipboard}
              type="button"
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
        <ButtonLink to="/listings">Back to listings</ButtonLink>

        {explorerUrl && (
          <a
            href={`${explorerUrl}/${txHash ? "tx" : "block"}/${
              txHash ?? blockHash
            }`}
            style={{ color: "black" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            View transaction
          </a>
        )}
      </section>
    </section>
  );
}
