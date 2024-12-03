import { useEffect, useState } from "react";
import { useSearch } from "@tanstack/react-router";
// import { ShopId } from "@/types";

export function useShopId() {
  const [shopId, setShopId] = useState<bigint | null>(null);
  // Get the search params
  const search = useSearch({
    from: "/",
  });

  useEffect(() => {
    const id = search.shopId;
    if (id) {
      setShopId(BigInt(id));
    }
  }, []);

  return { shopId, setShopId };
}
