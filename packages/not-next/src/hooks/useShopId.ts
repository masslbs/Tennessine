import { useEffect, useState } from "react";
import { useSearch } from "@tanstack/react-router";

import { ShopId } from "../types.ts";

export function useShopId() {
  const [shopId, setShopId] = useState<ShopId | null>(null);
  const search = useSearch({ strict: false });

  useEffect(() => {
    const id = search?.shopId;
    if (id) {
      setShopId(BigInt(id));
    }
  }, [search]);

  return { shopId };
}
