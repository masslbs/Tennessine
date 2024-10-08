// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { ChangeEvent, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useStoreContext } from "@/context/StoreContext";
import ProductsTags from "@/app/components/products/ProductTags";
import { useRouter, useSearchParams } from "next/navigation";
import { Tag, ItemId, Item, TagId } from "@/types";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import VisibilitySlider from "@/app/components/products/VisibilitySlider";
import SecondaryButton from "@/app/common/components/SecondaryButton";
import { useMyContext } from "@/context/MyContext";
import debugLib from "debug";
import ValidationWarning from "@/app/common/components/ValidationWarning";

const AddProductView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId") as ItemId | "new";
  const editView = itemId !== "new";
  const { stateManager } = useStoreContext();
  const { relayClient } = useMyContext();
  const [productInView, setProductInView] = useState<Item | null>(null);
  const [imgSrc, setImg] = useState<string>("");
  const [imgAsBlob, setBlob] = useState<FormData | null>(null);
  const [price, setPrice] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [units, setUnits] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const debug = debugLib("frontend:products:edit");

  useEffect(() => {
    if (editView && itemId) {
      stateManager.items
        .get(itemId)
        .then((item) => {
          setProductInView(item);
          setTitle(item.metadata.title);
          setPrice(item.price);
          setImg(item.metadata.image);
          setDescription(item.metadata.description);
          setUnits(item.quantity);
        })
        .catch((e) => {
          setErrorMsg("Error while updating image.");
          debug(e);
        });
    }
  }, []);

  useEffect(() => {
    const selected: Tag[] = [];

    if (productInView) {
      for (const id of productInView!.tags) {
        stateManager.tags
          .get(id)
          .then((tag: Tag) => {
            selected.push(tag);
          })
          .catch((e) => debug(e));
      }
      setSelectedTags(selected);
    }
  }, [productInView]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hed = editView && productInView ? "Edit product" : "Add Product";

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onBack = () => {
    router.push(`/products`);
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const fileInput = e.target;
      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        const blob = new FormData();
        blob.append("file", fileInput.files[0]);

        reader.onload = function (e) {
          const r = e.target as FileReader;
          const url = r.result;
          typeof url == "string" && setImg(url);
          setBlob(blob);
        };

        reader.readAsDataURL(fileInput.files[0]);
        //manually reset value for subsequent uploads in the same session.
        e.target.value = "";
      }
    } catch (error) {
      debug(error);
    }
  };

  const removeImg = () => {
    setImg("");
  };

  const create = async (newItem: Partial<Item>) => {
    try {
      const { id } = await stateManager!.items.create(newItem);
      await stateManager!.items.changeStock([id], [units]);
      if (selectedTags.length) {
        selectedTags.map(async (t) => {
          await stateManager!.items.addItemToTag(t.id, id);
        });
      }
    } catch (error) {
      setErrorMsg("Error while creating listing.");
      debug(error);
    }
  };

  const update = async (newItem: Partial<Item>) => {
    try {
      //compare the edited fields against the original object.
      const diff: Partial<Item> = {
        id: itemId as ItemId,
      };
      if (newItem.price !== productInView!.price) {
        diff["price"] = newItem.price;
      }
      if (newItem.metadata !== productInView!.metadata) {
        diff["metadata"] = newItem.metadata;
      }
      //checking for diff in selected tags
      const newTags = selectedTags.filter(
        ({ id }) => !productInView!.tags.includes(id),
      );
      if (newTags.length) {
        newTags.map(async ({ id }) => {
          await stateManager!.items.addItemToTag(id, itemId as ItemId);
        });
      }
      //checking for any removed tags
      const selectTagIds = selectedTags.map((t) => t.id);
      const removedTags = productInView?.tags.filter(
        (id: TagId) => !selectTagIds.includes(id),
      );
      if (removedTags?.length) {
        removedTags.map(async (id: TagId) => {
          await stateManager!.items.removeItemFromTag(id, itemId as ItemId);
        });
      }
      if (Object.keys(diff).length === 1) return;
      await stateManager!.items.update(diff);
      if (units !== productInView?.quantity) {
        await stateManager!.items.changeStock(
          [itemId as ItemId],
          [units - productInView!.quantity],
        );
      }
    } catch (error) {
      setErrorMsg("Error while updating listing.");
      debug(error);
    }
  };

  const onPublish = async () => {
    if (!price) {
      setValidationError("Product must include price.");
    } else if (!title) {
      setValidationError("Product must include title.");
    } else if (!imgSrc) {
      setValidationError("Product must include image.");
    } else if (productInView && !productInView.id) {
      setValidationError("Product id is missing.");
    } else {
      try {
        const path = imgAsBlob
          ? await relayClient!.uploadBlob(imgAsBlob)
          : { url: imgSrc };
        const newItem = {
          price: Number(price).toFixed(2),
          metadata: {
            title,
            description,
            image: path.url,
          },
        };
        editView && productInView
          ? await update(newItem)
          : await create(newItem);
        router.push(`/products`);
      } catch (error) {
        debug(`Error while saving item:${error}`);
        setErrorMsg("Error while saving item");
      }
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const _price = e.target.value;
    if (_price && !Number(_price)) {
      setPrice("");
    } else {
      setPrice(_price);
    }
  };

  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    const units = e.target.value;
    if (units && !Number(units)) {
      setUnits(0);
    } else {
      setUnits(Number(e.target.value) || 0);
    }
  };

  return (
    <div className="h-screen inset-0 flex items-end justify-center z-40 text-sm bg-gray-100">
      <div
        className={`bg-gray-100 rounded-2xl w-full h-full min-w-full relative pb-10`}
      >
        <div id="header" className="flex relative m-4 gap-2">
          <Image
            src={"/assets/back-button.svg"}
            width={12}
            height={12}
            alt="back-button"
            unoptimized={true}
            style={{ maxHeight: "64px", maxWidth: "64px" }}
          />
          <button onClick={onBack} className="text-primary-gray">
            back
          </button>
          <div className="flex justify-center w-full">
            <header className="pr-6">{hed}</header>
          </div>
        </div>
        <ValidationWarning
          warningMessage={validationError}
          onClose={() => {
            setValidationError(null);
          }}
        />
        <ErrorMessage
          errorMessage={errorMsg}
          onClose={() => {
            setErrorMsg(null);
          }}
        />
        <section id="content" className="m-4">
          <div className="flex">
            <div className="flex gap-3 items-center">
              <Image
                src={"/assets/chevron-right.svg"}
                width={9}
                height={15}
                alt="chevron-right"
              />
              <h2>{hed}</h2>
            </div>
            <div className="ml-auto">
              <SecondaryButton onClick={onPublish}>
                {editView ? "update" : "publish"}
              </SecondaryButton>
            </div>
          </div>
          <section className="mt-6 flex flex-col gap-4">
            <form
              className="flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label htmlFor="title">Title</label>
              <input
                value={title}
                className="border-2 border-solid mt-1 p-3 rounded-2xl"
                data-testid="title"
                name="title"
                onChange={(e) => handleTitleChange(e)}
              />
            </form>
            <form
              className="flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label htmlFor="description">description</label>
              <input
                value={description}
                className="border-2 border-solid mt-1 p-3 rounded-2xl"
                data-testid="description"
                name="description"
                onChange={(e) => handleDescriptionChange(e)}
              />
            </form>
            <div className="flex flex-col">
              <p className="mb-2">Product pics</p>
              {imgSrc ? (
                <div className="p-4 bg-white border-2 border-solid rounded-2xl">
                  <div className="relative w-fit p-2 mb-2">
                    <div className="p-4 border-2 w-fit rounded-2xl">
                      <Image
                        src={imgSrc}
                        width={50}
                        height={50}
                        alt="uploaded-product-image"
                        unoptimized={true}
                        style={{ maxHeight: "64px", maxWidth: "64px" }}
                      />
                    </div>
                    <Image
                      src="/assets/circle-remove.svg"
                      width={24}
                      height={24}
                      alt="remove"
                      className="absolute top-0 right-0"
                      onClick={removeImg}
                    />
                  </div>
                  <div className="border-t border-gray-300 border-0">
                    <button onClick={removeImg}>
                      <p className="text-blue-700 mt-2">Remove</p>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-solid rounded-2xl bg-primary-gray">
                  <button
                    onClick={triggerFileInput}
                    className="p-5 w-full text-white"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Image
                        src={"/assets/upload-image.svg"}
                        width={20}
                        height={20}
                        alt="back-button"
                        unoptimized={true}
                        style={{ maxHeight: "64px", maxWidth: "64px" }}
                      />
                      <p>Upload image</p>
                      <p className="text-gray-400 text-xs ">
                        {"upload JPG or PNG <10MB"}
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <form
                className="flex flex-col w-40"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <label htmlFor="price">price</label>
                <input
                  value={price}
                  className="border-2 border-solid mt-1 p-3 rounded-2xl"
                  data-testid="price"
                  name="price"
                  onChange={(e) => handlePriceChange(e)}
                />
              </form>
              <form
                className="flex flex-col w-40"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <label htmlFor="units">units</label>
                <input
                  value={units}
                  className="border-2 border-solid mt-1 p-3 rounded-2xl"
                  data-testid="units"
                  name="units"
                  onChange={(e) => handleStockChange(e)}
                />
              </form>
            </div>

            <div className="hidden">
              <input
                type="file"
                data-testid="file-upload"
                ref={fileInputRef}
                className="file-input"
                accept="image/*"
                onChange={handleUpload}
              />
            </div>
            <section id="tags">
              <div className="flex mb-4">
                <p>Tags</p>
              </div>
              <ProductsTags
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                setError={setErrorMsg}
              />
            </section>
            <VisibilitySlider
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              editView={editView}
            />
          </section>
        </section>
      </div>
    </div>
  );
};
export default AddProductView;
