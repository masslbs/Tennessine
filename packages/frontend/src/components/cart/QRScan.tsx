// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import BackButton from "../common/BackButton.tsx";

export default function QRScan({
  imgSrc,
  purchaseAddress,
  displayedAmount,
  goBack,
}: {
  imgSrc: string;
  purchaseAddress: string;
  displayedAmount: string;
  goBack: () => void;
}) {
  const [src, setQr] = useState<string | null>(null);
  function copyToClipboard() {
    navigator.clipboard.writeText(purchaseAddress!);
  }
  useEffect(() => {
    imgSrc && QRCode.toDataURL(imgSrc).then(setQr);
  }, [imgSrc]);

  return (
    <section className="md:flex justify-center">
      <section className="md:w-[560px] px-4 md:px-0">
        <BackButton onClick={goBack} />
        <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
          <div className="rounded-lg p-2 flex flex-col items-center gap-4">
            <img
              src="/icons/pay-by-QR.svg"
              width={78}
              height={100}
              alt="pay-by-qr"
            />
            <h1>Pay by QR code</h1>
            <h1>{displayedAmount}</h1>
            {src && <img src={src} width={161} height={161} alt="QR-code" />}
          </div>
        </section>
        <section className="mt-2 flex flex-col gap-4 bg-white p-5 pb-10 rounded-lg">
          <div className="rounded-lg p-2 flex flex-col items-center gap-4">
            <img
              src="/icons/pay-by-transfer.svg"
              width={93}
              height={43}
              alt="pay-by-transfer"
            />
            <h1>Pay by transfer</h1>
            <h1>{displayedAmount}</h1>
            <div className="flex items-center p-[10px] rounded-xl bg-background-gray">
              <p className="font-light">{purchaseAddress.slice(0, 20)}...</p>
              <button
                className="ml-4 p-0"
                onClick={copyToClipboard}
                type="button"
                style={{ backgroundColor: "transparent" }}
              >
                <img
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
    </section>
  );
}
