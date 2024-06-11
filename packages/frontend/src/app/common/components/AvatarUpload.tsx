// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { Dispatch, SetStateAction, useRef, ChangeEvent } from "react";
import Image from "next/image";

const AvatarUpload = ({
  setImgSrc,
}: {
  img: string | null;
  setImgSrc: Dispatch<SetStateAction<string | null>>;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const fileInput = e.target;
      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
          const img = e.target?.result;
          typeof img == "string" && setImgSrc(img);
        };

        reader.readAsDataURL(fileInput.files[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section>
      <div className="flex justify-center mt-6">
        <button onClick={triggerFileInput}>
          <Image
            src="/assets/upload-button.svg"
            width={52}
            height={52}
            alt="upload"
          />
        </button>
        <div className="hidden">
          <input
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
};

export default AvatarUpload;
