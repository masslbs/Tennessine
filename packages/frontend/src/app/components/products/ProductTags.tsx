// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, {
  useState,
  ChangeEvent,
  useEffect,
  FormEvent,
  Dispatch,
  SetStateAction,
} from "react";
import Image from "next/image";
import TagSection from "./Tag";
import { Tag, TagId } from "@/types";
import { useStoreContext } from "@/context/StoreContext";

const ProductsTags = ({
  selectedTags,
  setError,
  setSelectedTags,
}: {
  selectedTags: Tag[];
  setSelectedTags: Dispatch<SetStateAction<Tag[]>>;
  setError: Dispatch<SetStateAction<null | string>>;
}) => {
  const { stateManager } = useStoreContext();
  const [allTags, setAllTags] = useState(new Map());
  const [isSearchState, setIsSearchState] = React.useState<boolean>(false);
  const [searchResults, setSearchResults] = useState(new Map());
  const [tagName, setTagName] = useState<string>("");
  const [selected, setAllSelected] = useState<Tag[]>([]);

  useEffect(() => {
    const onCreateEvent = (tag: Tag) => {
      allTags.set(tag.id, tag);
      setAllTags(allTags);
    };

    (async () => {
      const tags = new Map();
      for await (const [id, tag] of stateManager.tags.iterator()) {
        tags.set(id, tag);
      }
      setAllTags(tags);

      // Listen to future events
      stateManager.tags.on("create", onCreateEvent);
    })();

    return () => {
      // Cleanup listeners on unmount
      stateManager.items.removeListener("create", onCreateEvent);
    };
  }, []);

  useEffect(() => {
    setAllSelected([...selectedTags]);
  }, [selectedTags]);

  const handleTagClick = () => {
    setIsSearchState(!isSearchState);
  };

  const renderSelectedTags = () => {
    if (!selected) return null;
    return selected.map((tag) => {
      return (
        <TagSection
          key={tag.id}
          tag={tag}
          removeFn={() => handleDeselectTag(tag)}
          handleSelectTag={() => {}}
        />
      );
    });
  };

  const handleSelectTag = async (t: Tag) => {
    const tags = [...selectedTags];
    tags.push(t);
    setSelectedTags(tags);
  };

  const handleDeselectTag = async (t: Tag) => {
    setSelectedTags([...selectedTags].filter((tag) => tag.id !== t.id));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTagName(value);
    if (value[0] === ":") {
      console.log("creating new tag...");
    } else if (!value.length) {
      searchResults.clear();
      setSearchResults(searchResults);
    } else if (value.length) {
      const tagIds: `0x${string}`[] = Array.from([...allTags.keys()]);
      for (const tId of tagIds) {
        const searchTag = allTags.get(tId);
        if (!searchTag) return;
        if (
          value &&
          searchTag.name.toLowerCase().includes(value.toLowerCase())
        ) {
          searchResults.set(searchTag.id, searchTag);
        } else {
          searchResults.delete(searchTag.id);
        }
        setSearchResults(searchResults);
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
    const tags = searchResults.size
      ? Array.from([...searchResults.keys()])
      : Array.from([...allTags.keys()]);
    if (!tags?.length) return null;
    return tags.map((tId: TagId) => {
      return (
        <TagSection
          key={tId}
          handleSelectTag={handleSelectTag}
          tag={allTags.get(tId) as Tag}
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
            searchResults.clear();
            setSearchResults(searchResults);
          }}
          className="self-center absolute right-0 top-0.5 bottom-0"
        >
          <Image
            src="/assets/grey-x-icon.svg"
            alt="grey-x-icon"
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
