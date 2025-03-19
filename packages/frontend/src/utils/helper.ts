import { formatUnits } from "viem";
import { Listing } from "@massmarket/schema";

export async function mapToListingsClass(listings){
  const items = new Map();
  for await (
    const [
      id,
      item,
    ] of listings.entries()
  ) {
    items.set(id, new Listing(item));
  }
  return items;
}

export function multiplyAndFormatUnits(
  price: string,
  quantity: number,
  decimals: number,
) {
  return formatUnits(BigInt(price) * BigInt(quantity), decimals);
}

export function removeCachedKeycards() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes("keycard")) {
      const keycard = JSON.parse(localStorage.getItem(key)!);
      if (keycard.role === "guest-new") {
        localStorage.removeItem(key);
        i--;
      }
    }
  }
}
