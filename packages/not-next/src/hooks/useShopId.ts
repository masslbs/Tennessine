import React, { useEffect, useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { ShopId } from "@/types";

export default function useShopId() {
  const [shopId, setShopId] = useState<null | ShopId>(null);
  // Get the search params
  const search = useSearch({
    from: "/",
  });

  useEffect(() => {
    //If shopId is provided as a query, set it as shopId, otherwise check for storeId in localStorage.
    const id = search.shopId || localStorage.getItem("shopId");

    if (id) {
      localStorage.setItem("shopId", id);
      setShopId(BigInt(id));
    }
  }, []);

  return { shopId, setShopId };
}
