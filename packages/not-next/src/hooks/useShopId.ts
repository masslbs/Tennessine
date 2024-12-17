import { useEffect, useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { ShopId } from "../types.ts";

export function useShopId() {
  console.log("useShopId hook called");
  const [shopId, setShopId] = useState<ShopId | null>(null);
  const search = useSearch({ strict: false });
  console.log("in useShopId, search value:", search);

  useEffect(() => {
    console.log("in useShopId useEffect");
    const id = search?.shopId;
    if (id) {
      setShopId(BigInt(id));
    }
  }, [search]);

  return { shopId, setShopId };
}
