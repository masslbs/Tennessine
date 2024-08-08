// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, {
  useReducer,
  useState,
  ChangeEvent,
  useEffect,
  FormEvent,
  Dispatch,
  SetStateAction,
} from "react";
import Image from "next/image";
import TagSection from "./Tag";
import { Tag, TagId, ItemId } from "@/types";
import { useStoreContext } from "@/context/StoreContext";
import {
  searchReducer,
  TURN_ON_SEARCH_VIS,
  TURN_OFF_SEARCH_VIS,
  ALL_TAGS,
} from "@/reducers/tagReducers";

const ProductsTags = ({
  selectedTags,
  itemId,
  setError,
  setSelectedTags,
}: {
  selectedTags: TagId[];
  setSelectedTags: Dispatch<SetStateAction<TagId[]>>;
  itemId: ItemId | null;
  setError: Dispatch<SetStateAction<null | string>>;
}) => {
  const { allTags, stateManager } = useStoreContext();
  const [isSearchState, setIsSearchState] = React.useState<boolean>(false);
  const [searchResults, searchDispatch] = useReducer(searchReducer, new Map());
  const [tagName, setTagName] = useState<string>("");
  const [selected, setAll] = useState<TagId[]>([]);
  if (!allTags) return null;

  useEffect(() => {
    setAll([...selectedTags]);
  }, [selectedTags]);

  const handleTagClick = () => {
    setIsSearchState(!isSearchState);
  };

  const renderSelectedTags = () => {
    if (!selected) return null;

    return selected.map((t) => {
      const tag = allTags.get(t) as Tag;
      if (!tag) return null;
      return (
        <TagSection
          key={tag.id}
          tag={tag}
          removeFn={() => handleDeselectTag(tag)}
        />
      );
    });
  };

  const handleSelectTag = async (t: Tag) => {
    //if updating product
    if (itemId) {
      try {
        await stateManager.items.addItemToTag(t.id, itemId);
      } catch (error) {
        setError("Error while updating product");
      }
    } else {
      //creating new item
      setSelectedTags([...selectedTags, t.id]);
    }
  };

  const handleDeselectTag = async (t: Tag) => {
    //if updating product
    if (itemId) {
      try {
        await stateManager.items.removeItemFromTag(t.id, itemId);
      } catch (error) {
        setError("Error while removing item from tag");
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTagName(value);
    //FIXME:search
    if (value[0] === ":") {
      console.log("creating new tag...");
    } else if (!value.length) {
      searchDispatch({ type: ALL_TAGS });
      return;
    } else {
      const tagIds: `0x${string}`[] = Array.from([...allTags.keys()]);

      for (const tId of tagIds) {
        const searchTag = allTags.get(tId);
        if (!searchTag) return;
        if (
          value &&
          searchTag.name.toLowerCase().includes(value.toLowerCase())
        ) {
          searchDispatch({
            type: TURN_ON_SEARCH_VIS,
            payload: { tag: searchTag as Tag },
          });
        } else {
          searchDispatch({
            type: TURN_OFF_SEARCH_VIS,
            payload: { tag: searchTag as Tag },
          });
        }
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    tagName.length && tagName[0] === ":"
      ? await stateManager.tags.create(tagName)
      : setError("to create a tag name, begin the tag name with :");
    setTagName("");
  };

  const renderAllTags = () => {
    const tagsToRender = searchResults.size ? searchResults : allTags;
    const t = Array.from([...tagsToRender.keys()]);
    if (!t?.length) return null;
    return t.map((t: TagId) => {
      //do not display already selected tags
      if (selectedTags.includes(t)) return;
      return (
        <TagSection
          key={t}
          onClick={() => handleSelectTag(allTags.get(t) as Tag)}
          tag={allTags.get(t) as Tag}
        />
      );
    });
  };

  const tagField = isSearchState ? (
    <div>
      <form
        className="relative"
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <input
          className="border-2 border-solid mt-1 px-4 py-3 w-full rounded"
          id="fname"
          name="fname"
          placeholder="Search your store"
          value={tagName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
        />
        <div
          onClick={(e) => {
            e.preventDefault();
            setIsSearchState(false);
            setTagName("");
            searchDispatch({ type: ALL_TAGS });
          }}
          className="self-center absolute right-0 top-0.5 bottom-0"
        >
          <Image
            src="/assets/grey-x-icon.svg"
            alt="checkmark-icon"
            width={20}
            height={20}
            className="mr-2"
          />
        </div>
      </form>
    </div>
  ) : (
    <div
      className="border border-gray-300 py-3 px-4 mt-1 flex rounded bg-white"
      onClick={() => handleTagClick()}
    >
      <Image
        src="/assets/add-icon.svg"
        alt="checkmark-icon"
        width={24}
        height={24}
        className="mr-2"
      />
      <p className="text-blue-700 flex items-center">Add keyword tag(s)</p>
    </div>
  );

  return (
    <section>
      <div className="flex flex-row flex-wrap gap-4">
        {renderSelectedTags()}
      </div>
      {tagField}
      {isSearchState ? (
        <div className="border p-4 mt-4 bg-white rounded">
          <p className="text-gray-400 text-xs mb-4">Recent keyword tags</p>
          <div className="flex flex-row flex-wrap gap-4">{renderAllTags()}</div>
        </div>
      ) : null}
    </section>
  );
};

export default ProductsTags;
