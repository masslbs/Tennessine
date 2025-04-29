import { logger } from "@massmarket/utils";
import ButtonLink from "../common/ButtonLink.tsx";

const namespace = "frontend:PaymentConfirmation";
const debug = logger(namespace);

export default function PaymentConfirmation(
  { displayedAmount, hash }: { displayedAmount: string; hash: string | null },
) {
  function copyToClipboard() {
    navigator.clipboard.writeText(hash || "Hash not available");
  }

  return (
    <section className="md:flex justify-center px-4">
      <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg items-center md:w-[560px]">
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
        <p>Your order has been completed.</p>
        <div className="flex-col items-center gap-2 flex">
          <p>Tx hash:</p>
          <div className="flex gap-2">
            <input
              className="border-2 border-solid mt-1 p-2 rounded"
              id="txHash"
              name="txHash"
              data-testid="tx-hash-input"
              value={hash || ""}
              onChange={() => {
                debug("hash copied");
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
      </section>
    </section>
  );
}
