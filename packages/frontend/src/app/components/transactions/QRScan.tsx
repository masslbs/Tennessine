// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import Image from "next/image";
import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import QRCode from "qrcode";
import { useStoreContext } from "@/context/StoreContext";
import { IStatus } from "@/types";

function QRScan({
  imgSrc,
  // setStatusScreen,
  // totalToRender,
  totalDollar,
  purchaseAddress,
}: {
  imgSrc: string | null;
  // setStatusScreen: Dispatch<SetStateAction<boolean>>;
  // totalToRender: string | null;
  totalDollar: string;
  purchaseAddress: string;
}) {
  console.log("for testing send payment to:", imgSrc);
  const { cartId, cartItems, setCartId } = useStoreContext();
  const [src, setQr] = useState<string | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(purchaseAddress!);
  };

  useEffect(() => {
    imgSrc && QRCode.toDataURL(imgSrc).then(setQr);
  }, [imgSrc]);

  useEffect(() => {
    if (
      cartItems &&
      cartId &&
      cartItems.get(cartId)?.status === IStatus.Complete
    ) {
      // setStatusScreen(true);
      setCartId(null);
    }
  }, [cartItems]);

  return (
    <main className="text-center flex flex-col ">
      <div className="flex flex-col ">
        <h3 className="pt-10 text-gray-400">Total</h3>
        {/* <p className="text-4xl text-blue-700 mt-4">{totalToRender}</p> */}
        <p className="text-4xl text-blue-700 mt-8">Scan to Pay</p>
      </div>
      <div className="flex justify-center mt-4">
        {src && <Image src={src} width={215} height={215} alt="QR-code" />}
      </div>
      <div>
        <p>{totalDollar} USD</p>
        <div className="flex text-center justify-center">
          <button className="mr-4" onClick={copyToClipboard}>
            <Image
              src="/assets/copy-icon.svg"
              width={24}
              height={24}
              alt="copy-icon"
            />
          </button>
          <p>{purchaseAddress.slice(0, 20)}...</p>
        </div>
      </div>
    </main>
  );
}

export default QRScan;
