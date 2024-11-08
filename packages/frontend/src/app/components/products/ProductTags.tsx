// // SPDX-FileCopyrightText: 2024 Mass Labs
// //
// // SPDX-License-Identifier: GPL-3.0-or-later

// "use client";

// import React, {
//   useState,
//   ChangeEvent,
//   useEffect,
//   FormEvent,
//   Dispatch,
//   SetStateAction,
// } from "react";
// import TagSection from "./Tag";
// import { Tag, TagId } from "@/types";
// import { useStoreContext } from "@/context/StoreContext";
// import debugLib from "debug";
// import Button from "@/app/common/components/Button";
// import Chevron from "@/app/common/components/Chevron";

// const ProductsTags = ({
//   selectedTags,
//   setError,
//   setSelectedTags,
// }: {
//   selectedTags: Tag[];
//   setSelectedTags: Dispatch<SetStateAction<Tag[]>>;
//   setError: Dispatch<SetStateAction<null | string>>;
// }) => {
//   const { stateManager } = useStoreContext();
//   const [allTags, setAllTags] = useState([]);
//   const [isSearchState, setIsSearchState] = React.useState<boolean>(false);
//   const [searchResults, setSearchResults] = useState(new Map());
//   const [tagName, setTagName] = useState<string>("");
//   const [selected, setAllSelected] = useState<Tag[]>([]);
//   const [tagDropdownOpen, setToggleOpen] = useState<boolean>(false);
//   const debug = debugLib("frontend:productTags");

//   useEffect(() => {
//     const setAllTagsFn = async () => {
//       const tags = [];
//       for await (const [id, tag] of stateManager.tags.iterator()) {
//         tags.push({ label: tag.name, value: id });
//       }
//       setAllTags(tags);
//     };

//     const onCreateEvent = async () => {
//       await setAllTagsFn();
//     };

//     setAllTagsFn()
//       .then()
//       .catch((e) => {
//         debug(e);
//       });

//     // Listen to future events
//     stateManager.tags.on("create", onCreateEvent);

//     return () => {
//       // Cleanup listeners on unmount
//       stateManager.items.removeListener("create", onCreateEvent);
//     };
//   }, []);

//   useEffect(() => {
//     setAllSelected([...selectedTags]);
//   }, [selectedTags]);

//   const handleTagClick = () => {
//     setIsSearchState(!isSearchState);
//   };

//   const renderSelectedTags = () => {
//     if (!selected) return null;
//     return selected.map((tag) => {
//       return (
//         <TagSection
//           key={tag.id}
//           tag={tag}
//           removeFn={() => handleDeselectTag(tag)}
//           handleSelectTag={() => {}}
//         />
//       );
//     });
//   };

//   const handleSelectTag = async (t: Tag) => {
//     const tags = [...selectedTags];
//     tags.push(t);
//     setSelectedTags(tags);
//   };

//   const handleDeselectTag = async (t: Tag) => {
//     setSelectedTags([...selectedTags].filter((tag) => tag.id !== t.id));
//   };

//   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const { value } = event.target;
//     setTagName(value);
//     if (value[0] === ":") {
//       console.log("creating new tag...");
//     } else if (!value.length) {
//       searchResults.clear();
//       setSearchResults(searchResults);
//     } else if (value.length) {
//       const tagIds: `0x${string}`[] = Array.from([...allTags.keys()]);
//       for (const tId of tagIds) {
//         const searchTag = allTags.get(tId);
//         if (!searchTag) return;
//         if (
//           value &&
//           searchTag.name.toLowerCase().includes(value.toLowerCase())
//         ) {
//           searchResults.set(searchTag.id, searchTag);
//         } else {
//           searchResults.delete(searchTag.id);
//         }
//         setSearchResults(searchResults);
//       }
//     }
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       await stateManager!.tags.create(tagName);
//       setTagName("");
//     } catch (error) {
//       debug(error);
//       setError("Error creating tag");
//     }
//   };

//   const renderAllTags = () => {
//     const selectedTagIds = selected.map((t) => t.id);

//     if (!allTags?.length) return null;

//     return allTags.map((t) => {
//       // Filtering out selected tags from rendering in this section
//       if (selectedTagIds.includes(t.value)) return null;
//       return (
//         <a
//           key={t.label}
//           href="#"
//           data-testid={t.label}
//           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//           role="menuitem"
//           // onClick={() => handleOptionClick(option)}
//         >
//           {t.label}
//         </a>
//       );
//     });
//   };

//   const tagField = isSearchState ? (
//     <div>
//       <form
//         data-testid="tagForm"
//         className="relative"
//         onSubmit={(e: FormEvent<HTMLFormElement>) => {
//           e.preventDefault();
//           handleSubmit(e);
//         }}
//       >
//         <input
//           className="border-2 border-solid mt-1 px-4 py-3 w-full rounded"
//           id="tagInput"
//           name="tagInput"
//           data-testid="tagInput"
//           placeholder="Search your store"
//           value={tagName}
//           onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
//         />
//         <div
//           onClick={(e) => {
//             e.preventDefault();
//             setIsSearchState(false);
//             setTagName("");
//             searchResults.clear();
//             setSearchResults(searchResults);
//           }}
//           className="self-center absolute right-0 top-0.5 bottom-0"
//         >
//           <img
//             src="/icons/close-icon.svg"
//             alt="close-icon"
//             width={10}
//             height={10}
//             className="mr-2"
//           />
//         </div>
//       </form>
//     </div>
//   ) : (
//     <button
//       className="border border-gray-300 py-3 px-4 mt-1 flex rounded bg-white"
//       onClick={() => handleTagClick()}
//       data-testid="add-tag-btn"
//     >
//       <p className="text-blue-700 flex items-center">Add keyword tag(s)</p>
//     </button>
//   );
//   console.log({ allTags });
//   return (
//     <section>
//       <div className="flex flex-row flex-wrap gap-4">
//         {renderSelectedTags()}
//       </div>
//       <section>
//         <div className="text-left">
//           <button
//             data-testid="dropdown"
//             type="button"
//             className="flex items-center w-full rounded-md border shadow-sm px-4 py-2 bg-background-gray"
//             onClick={() => setToggleOpen(!tagDropdownOpen)}
//           >
//             <p className="mr-2">Select</p>
//             <div className="ml-auto align-center">
//               <Chevron open={tagDropdownOpen} hex={"#000"} />
//             </div>
//           </button>

//           {tagDropdownOpen && (
//             <div className="bg-white border-2 border-solid p-2 ">
//               <div
//                 className="py-1"
//                 role="menu"
//                 aria-orientation="vertical"
//                 aria-labelledby="options-menu"
//               >
//                 {renderAllTags()}
//               </div>
//             </div>
//           )}
//         </div>
//       </section>
//       <section>
//         <form
//           className="flex grow gap-2 mt-2"
//           onSubmit={(e) => e.preventDefault()}
//         >
//           <input
//             className="border-2 border-solid mt-1 p-2 rounded-md bg-background-gray"
//             data-testid="storeName"
//             name="storeName"
//             value={tagName}
//             onChange={(e) => setTagName(e.target.value)}
//           />
//           <Button
//             // disabled={!tagName.length}
//             disabled={true}
//             onClick={(e) => handleSubmit(e)}
//           >
//             Create
//           </Button>
//         </form>
//       </section>
//     </section>
//   );
// };

// export default ProductsTags;
