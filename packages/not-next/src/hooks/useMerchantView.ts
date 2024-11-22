import { useState } from "react";

export default function useMerchantView() {
  const [isMerchantView, setIsMerchantView] = useState<boolean>(false);
  setIsMerchantView("todo");

  return isMerchantView;
}
