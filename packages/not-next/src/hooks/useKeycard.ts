import { useEffect, useState } from "react";

export default function useKeycard() {
  const [isGuestKeycard, setIsGuestKeycard] = useState(false);
  const [isMerchantKeycard, setIsMerchantKeycard] = useState(false);
  const [keycard, setKeycard] = useState<`0x${string}` | null>(null);

  useEffect(() => {
    const mKC = localStorage.getItem("merchantKC") as `0x${string}`;
    const gKC = localStorage.getItem("guestCheckoutKC") as `0x${string}`;
    if (mKC) {
      setIsMerchantKeycard(true);
      setKeycard(mKC);
    } else if (gKC) {
      setIsGuestKeycard(true);
      setKeycard(gKC);
    }
  }, []);

  return { isGuestKeycard, isMerchantKeycard, keycard };
}
