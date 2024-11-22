import { useEffect, useState } from "react";
import { useSearch } from "@tanstack/react-router";
// import { ShopId } from "@/types";

export default function useShopId() {
  const [shopId, setShopId] = useState(null);
  // Get the search params
  const search = useSearch({
    from: "/",
  });

  useEffect(() => {
    //If shopId is provided as a query, set it as shopId, otherwise check for storeId in localStorage.
    const id = search.shopId;

    if (id) {
      setShopId(BigInt(id));
    }
  }, []);

  return { shopId, setShopId };
}
