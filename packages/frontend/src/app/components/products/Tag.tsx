// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React from "react";
import Image from "next/image";
import { Tag } from "@/types";

const TagSection = ({
  tag,
  removeFn,
  handleSelectTag,
}: {
  handleSelectTag: (t: Tag) => void;
  tag: Tag;
  removeFn?: () => Promise<void>;
}) => {
  if (!tag?.id) return null;

  return (
    <div
      id="tag"
      data-testid="tagSection"
      className={`w-fit flex text-sm rounded p-1`}
      // style={{ backgroundColor: `#${hex}` }}
      onClick={() => handleSelectTag(tag as Tag)}
    >
      <p className="mr-1">{tag.name}</p>
      {removeFn ? (
        <Image
          src="/icons/close-icon.svg"
          alt="close-icon"
          width={10}
          height={10}
          onClick={removeFn}
        />
      ) : null}
    </div>
  );
};

export default TagSection;
