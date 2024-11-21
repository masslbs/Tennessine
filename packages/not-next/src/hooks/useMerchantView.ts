import React, { useEffect, useState } from "react";

export default function useMerchantView() {
  const [isMerchantView, setIsMerchantView] = useState<boolean>(false);

  return isMerchantView;
}
