// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useRef,
  useState,
} from "react";

export default function AvatarUpload({
  setImgBlob,
}: {
  setImgBlob: Dispatch<SetStateAction<FormData | null>>;
}) {
  const [localImg, setLocalImg] = useState<null | string>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
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
      console.error(error);
    }
  };

  return (
    <section>
      <div className="flex">
        <button onClick={triggerFileInput}>
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
              <div className="bg-background-gray rounded-full p-3">
                <img
                  src={"/icons/picture-upload.svg"}
                  width={27}
                  height={21}
                  alt="upload"
                  className="w-auto h-auto"
                />
              </div>
            )}
        </button>
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
