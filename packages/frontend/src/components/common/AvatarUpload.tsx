// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Button from "./Button.tsx";

export default function AvatarUpload({
  setImgBlob,
  logError,
  currentImg = null,
}: {
  setImgBlob: (blob: FormData) => void;
  logError: (msg: string, error: unknown) => void;
  currentImg?: string | null;
}) {
  const [localImg, setLocalImg] = useState<null | string>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentImg) {
      setLocalImg(currentImg);
    }
  }, [currentImg]);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      const fileInput = e.target;
      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        const blob = new FormData();
        blob.append("file", fileInput.files[0]);
        reader.onload = function (e) {
          const r = e.target as FileReader;
          const url = r.result;
          typeof url == "string" && setLocalImg(url);
          setImgBlob(blob);
        };

        reader.readAsDataURL(fileInput.files[0]);
      }
    } catch (error) {
      logError("Error uploading image", error);
    }
  };

  return (
    <section>
      <div className="flex gap-4">
        <button
          onClick={triggerFileInput}
          style={{ backgroundColor: "transparent", padding: 0 }}
          type="button"
        >
          {localImg
            ? (
              <div className="overflow-hidden rounded-full w-12 h-12">
                <img
                  src={localImg}
                  width={50}
                  height={50}
                  alt="upload"
                  className="w-12 h-12"
                />
              </div>
            )
            : (
              <div className="bg-background-gray rounded-full px-[7px] py-[10px]">
                <img
                  src="/icons/picture-upload.svg"
                  width={27}
                  height={21}
                  alt="upload"
                  className="w-auto h-auto"
                />
              </div>
            )}
        </button>
        <Button onClick={triggerFileInput}>Upload New</Button>
        <div className="hidden">
          <input
            data-testid="file-upload"
            type="file"
            ref={fileInputRef}
            className="file-input"
            accept="image/*"
            onChange={handleUpload}
          />
        </div>
      </div>
    </section>
  );
}
