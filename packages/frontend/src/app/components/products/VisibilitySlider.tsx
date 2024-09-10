// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useStoreContext } from "@/context/StoreContext";
import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Tag } from "@/types";
import debugLib from "debug";

const VisibilitySlider = ({
  selectedTags,
  editView,
  setSelectedTags,
}: {
  selectedTags: Tag[];
  editView: boolean;
  setSelectedTags: Dispatch<SetStateAction<Tag[]>>;
}) => {
  const { stateManager } = useStoreContext();
  const [selectedOption, setSelectedOption] = useState<number>(1);
  const [selected, setAll] = useState<Tag[]>([]);
  const [pId, setPublishedTagId] = useState<`0x${string}` | null>(null);
  const debug = debugLib("frontend:visibilitySlider");

  useEffect(() => {
    stateManager.manifest
      .get()
      .then(async (shopManifest) => {
        setPublishedTagId(shopManifest.publishedTagId);
      })
      .catch((e) => {
        debug(e);
      });
  }, []);

  useEffect(() => {
    setAll(selectedTags);
  }, [selectedTags]);

  useEffect(() => {
    //default new item to visible.
    if (!editView && pId) {
      markAsVisible();
    }
  }, [editView, pId]);

  useEffect(() => {
    const isVisible =
      pId && selected ? selected.find((tag) => tag.id === pId) : false;
    isVisible ? setSelectedOption(1) : setSelectedOption(2);
  }, [pId, selected]);

  const markAsVisible = () => {
    if (pId) {
      setSelectedTags([...selectedTags, { id: pId, name: "visible" }]);
      setSelectedOption(1);
    }
  };

  const markAsHidden = () => {
    if (pId) {
      const filtered = [...selectedTags].filter((tag) => tag.id !== pId);
      setSelectedTags(filtered);
      setSelectedOption(2);
    }
  };

  return (
    <section>
      <p className="mb-4">visibility</p>
      <div className="slider flex justify-between border rounded-lg bg-white text-center">
        <div
          className={`px-2 py-4 grow ${selectedOption === 1 ? "bg-gray-200" : ""}`}
        >
          <button disabled={selectedOption === 1} onClick={markAsVisible}>
            Visible
          </button>
        </div>
        <div
          className={`px-2 py-4 grow ${selectedOption === 2 ? "bg-gray-200" : ""}`}
        >
          <button disabled={selectedOption === 2} onClick={markAsHidden}>
            Hidden
          </button>
        </div>
        <div
          className={`px-2 py-4 grow ${selectedOption === 3 ? "bg-gray-200" : ""}`}
        >
          <button
            onClick={() => {
              console.log("feature not yet available. use vis/hidden options.");
            }}
          >
            Unavailable
          </button>
        </div>
      </div>
    </section>
  );
};

export default VisibilitySlider;
