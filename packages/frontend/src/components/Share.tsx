import BackButton from "./common/BackButton.tsx";
import { useShopId } from "../hooks/useShopId.ts";
export default function Share() {
  const { shopId } = useShopId();

  function copyToClipboard() {
    navigator.clipboard.writeText(
      `https://demo-shop.mass.market/listings?shopId=${shopId}`,
    );
  }
  return (
    <main className="px-4 flex justify-center">
      <section className="md:w-[800px] w-full">
        <BackButton href="/listings" />
        <h1 className="py-3">Share</h1>
        <section className="mt-2 flex flex-col gap-1 bg-white p-5 rounded-lg">
          <h3>Link</h3>
          <div className="flex gap-2">
            <input
              className="border-2 border-solid mt-1 p-2 rounded w-full"
              id="shopId"
              name="shopId"
              value={`demo-shop.mass.market/listings?shopId=${shopId}`}
              onChange={() => {}}
            />
            <button
              type="button"
              className="mr-4"
              style={{ backgroundColor: "transparent", padding: 0 }}
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
        </section>
      </section>
    </main>
  );
}
