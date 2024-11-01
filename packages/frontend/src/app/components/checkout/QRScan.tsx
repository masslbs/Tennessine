// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import Image from "next/image";
import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import BackButton from "@/app/common/components/BackButton";

function QRScan({
  imgSrc,
  purchaseAddress,
  erc20Amount,
  symbol,
  goBack,
}: {
  imgSrc: string | null;
  purchaseAddress: string;
  erc20Amount: string | null;
  symbol: string | null;
  goBack: () => void;
}) {
  const [src, setQr] = useState<string | null>(null);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(purchaseAddress!);
  };
  useEffect(() => {
    imgSrc && QRCode.toDataURL(imgSrc).then(setQr);
  }, [imgSrc]);

  return (
    <section>
      <BackButton onClick={goBack} />
      <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
        <div className="rounded-lg p-2 flex flex-col items-center gap-4">
          <Image
            src="/icons/pay-by-qr.svg"
            width={78}
            height={100}
            alt="pay-by-qr"
            unoptimized={true}
          />
          <h1>Pay by QR code</h1>
          <h1>
            {erc20Amount} {symbol}
          </h1>
          {src && <Image src={src} width={215} height={215} alt="QR-code" />}
        </div>
      </section>
      <section className="mt-2 flex flex-col gap-4 bg-white p-5 pb-10 rounded-lg">
        <div className="rounded-lg p-2 flex flex-col items-center gap-4">
          <Image
            src="/icons/pay-by-transfer.svg"
            width={93}
            height={43}
            alt="pay-by-transfer"
            unoptimized={true}
          />
          <h1>Pay by transfer</h1>
          <h1>
            {erc20Amount} {symbol}
          </h1>
          <div className="flex text-center justify-center border-2 p-2 rounded-xl shadow-xl">
            <p>{purchaseAddress.slice(0, 20)}...</p>
            <button className="ml-4" onClick={copyToClipboard}>
              <Image
                src="/icons/copy-icon.svg"
                width={15}
                height={15}
                alt="copy-icon"
              />
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}

export default QRScan;
