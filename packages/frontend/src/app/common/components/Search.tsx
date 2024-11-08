// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";

const Search = ({
  setSearchPhrase,
  searchPhrase,
}: {
  setSearchPhrase: Dispatch<SetStateAction<string>>;
  searchPhrase: string;
}) => {
  const handleSearchChange = (e: FormEvent<HTMLInputElement>) => {
    const inputElem = e.target as HTMLInputElement;
    if (!inputElem) return;
    setSearchPhrase(inputElem.value);
  };
  return (
    <div id="transaction-search">
      <form
        className="flex"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {searchPhrase && searchPhrase.length
          ? (
            <img
              src="/assets/arrow-left.svg"
              width={19}
              height={19}
              alt="search-icon"
              className="absolute m-2 mt-4 ml-3"
            />
          )
          : (
            <img
              src="/icons/search-icon.svg"
              width={19}
              height={19}
              alt="search-icon"
              className="absolute m-2 mt-4 ml-3"
            />
          )}
        <input
          className="border-2 border-solid mt-1 p-2 pl-9 w-full rounded"
          id="products"
          name="products"
          placeholder="Search products"
          value={searchPhrase}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchChange(e)}
        />
      </form>
    </div>
  );
};
export default Search;
