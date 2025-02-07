// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { assert, formatUnitsFromString, logger } from "@massmarket/utils";

import { Listing, ListingId, ListingViewState } from "../../../types.js";
import ErrorMessage from "../../common/ErrorMessage.jsx";
import ValidationWarning from "../../common/ValidationWarning.jsx";
import { useBaseToken } from "../../../hooks/useBaseToken.js";
import Button from "../../common/Button.jsx";
import { useClientWithStateManager } from "../../../hooks/useClientWithStateManager.js";
import BackButton from "../../common/BackButton.jsx";

const namespace = "frontend:edit-product";
const errlog = logger(namespace, "error");

type Image = {
  blob: null | FormData;
  url: string;
};

export default function EditProduct() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });

  const itemId = search.itemId as ListingId | "new";
  const editView = itemId !== "new";

  const { clientStateManager } = useClientWithStateManager();
  const { baseToken } = useBaseToken();
  const [productInView, setProductInView] = useState<Listing | null>(null);
  const [price, setPrice] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [units, setUnits] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [viewState, setViewState] = useState(
    ListingViewState.LISTING_VIEW_STATE_UNSPECIFIED,
  );
  const [images, setImages] = useState<Image[]>([]);
  const [publishing, setPublishing] = useState(false);

  const hed = editView ? "Edit product" : "Add Product";
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editView && itemId && baseToken.decimals) {
      clientStateManager!
        .stateManager!.listings.get(itemId)
        .then((item: Listing) => {
          setProductInView(item);
          setTitle(item.metadata.title);
          const price = formatUnitsFromString(item.price, baseToken.decimals);
          setPrice(price);
          setImages(
            item.metadata.images.map((img: string) => {
              return { blob: null, url: img };
            }),
          );
          setDescription(item.metadata.description);
          setUnits(item.quantity);
          setViewState(item.viewState);
        })
        .catch((e: unknown) => {
          assert(e instanceof Error, "Error is not an instance of Error");
          setErrorMsg("Error fetching listing");
          errlog("Error fetching listing", e);
        });
    }
  }, [baseToken]);

  async function create(newItem: Partial<Listing>) {
    try {
      const { id } = await clientStateManager!.stateManager!.listings
        .create(
          newItem,
          baseToken.decimals,
        );
      await clientStateManager!.stateManager!.listings.changeInventory(
        id,
        units,
      );
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error creating listing", error);
      setErrorMsg("Error creating listing");
    }
  }

  async function update(newItem: Partial<Listing>) {
    try {
      //compare the edited fields against the original object.
      const diff: Partial<Listing> = {
        id: itemId as ListingId,
        viewState,
      };
      if (
        newItem.price !==
          Number(
            formatUnitsFromString(productInView!.price, baseToken!.decimals),
          ).toFixed(2)
      ) {
        diff["price"] = newItem.price;
      }
      if (newItem.metadata !== productInView!.metadata) {
        diff["metadata"] = newItem.metadata;
      }

      if (Object.keys(diff).length === 1) return;
      await clientStateManager!.stateManager!.listings.update(
        diff,
        baseToken!.decimals,
      );
      if (units !== productInView?.quantity) {
        await clientStateManager!.stateManager!.listings.changeInventory(
          itemId as ListingId,
          units - productInView!.quantity,
        );
      }
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error updating listing", error);
      setErrorMsg("Error updating listing");
    }
  }

  async function onPublish() {
    if (!price) {
      setValidationError("Product must include price.");
    } else if (!title) {
      setValidationError("Product must include title.");
    } else if (!images.length) {
      setValidationError("Product must include image.");
    } else if (productInView && !productInView.id) {
      setValidationError("Product id is missing.");
    } else {
      try {
        setPublishing(true);
        const uploaded = await Promise.all(
          images.map(async (i: Image) => {
            if (i.blob) {
              const { url } = await clientStateManager!.relayClient!
                .uploadBlob(i.blob);
              return url;
            } else {
              return i.url;
            }
          }),
        );
        const newItem = {
          price: Number(price).toFixed(2),
          metadata: {
            title,
            description,
            images: uploaded,
          },
          viewState,
        };
        editView && productInView
          ? await update(newItem)
          : await create(newItem);
        setPublishing(false);
        navigate({
          to: "/listings",
          search: (prev: Record<string, string>) => ({
            shopId: prev.shopId,
          }),
        });
      } catch (error: unknown) {
        assert(error instanceof Error, "Error is not an instance of Error");
        errlog("Error publishing listing", error);
        setErrorMsg("Error publishing listing");
      }
    }
  }

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  function handleDescriptionChange(e: ChangeEvent<HTMLInputElement>) {
    setDescription(e.target.value);
  }

  function handlePriceChange(e: ChangeEvent<HTMLInputElement>) {
    const _price = e.target.value;
    if (_price && !Number(_price)) {
      setPrice("");
    } else {
      setPrice(_price);
    }
  }

  function handleStockChange(e: ChangeEvent<HTMLInputElement>) {
    const units = e.target.value;
    if (units && !Number(units)) {
      setUnits(0);
    } else {
      setUnits(Number(e.target.value) || 0);
    }
  }

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    try {
      const fileInput = e.target;
      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        const blob = new FormData();
        blob.append("file", fileInput.files[0]);

        reader.onload = function (e) {
          const r = e.target as FileReader;
          const url = r.result;
          typeof url == "string" && setImages([...images, { blob, url }]);
        };

        reader.readAsDataURL(fileInput.files[0]);
        //manually reset value for subsequent uploads in the same session.
        e.target.value = "";
      }
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error during image upload", error);
      setErrorMsg("Error during image upload");
    }
  }

  function triggerFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function removeImg(img: { blob: null | FormData; url: string }) {
    setImages(images.filter((i: Image) => img.url !== i.url));
  }

  return (
    <main className="pt-4 px-3 pt-under-nav">
      <ValidationWarning
        warning={validationError}
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
      <BackButton href="/listings" />
      <section>
        <div className="flex">
          <h2>{hed}</h2>
        </div>
        <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label htmlFor="title">Product name</label>
            <input
              value={title}
              className="border-2 border-solid mt-1 p-3 rounded-md bg-background-gray"
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
            <label htmlFor="description">Product description</label>
            <input
              value={description}
              className="border-2 border-solid mt-1 p-3 rounded-md bg-background-gray"
              data-testid="description"
              name="description"
              onChange={(e) => handleDescriptionChange(e)}
            />
          </form>
          <section className="flex flex-col">
            <p className="mb-2">Product pics</p>
            <div className="border-2 border-solid rounded-md bg-background-gray h-32 flex">
              <button
                onClick={triggerFileInput}
                className="p-5 w-full text-white bg-white"
              >
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={"/icons/images.svg"}
                    width={25}
                    height={25}
                    alt="upload-picture"
                    className="w-auto h-auto"
                  />
                  <p className="text-gray-400 text-xs ">
                    {"upload JPG or PNG <10MB"}
                  </p>
                </div>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 justify-start">
              {images.map((img: Image, i: number) => {
                return (
                  <div key={i} className="relative mb-2">
                    <img
                      src={img.url}
                      width={105}
                      height={95}
                      alt="uploaded-product-image"
                      style={{
                        maxHeight: "95px",
                        maxWidth: "105px",
                        minHeight: "95px",
                        minWidth: "105px",
                      }}
                      className="rounded-md"
                    />
                    <div className="p-1 bg-black absolute top-1 right-2 rounded-full">
                      <img
                        src="/icons/remove-icon.svg"
                        width={8}
                        height={8}
                        alt="remove"
                        onClick={() => removeImg(img)}
                        className="w-auto h-auto"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
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
                className="border-2 border-solid mt-1 p-3 rounded-md bg-background-gray"
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
                className="border-2 border-solid mt-1 p-3 rounded-md bg-background-gray"
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
        </section>
        <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
          <div className="flex gap-2 items-center">
            <input
              id="published"
              name="published"
              type="checkbox"
              className="form-checkbox h-4 w-4"
              checked={viewState ===
                ListingViewState.LISTING_VIEW_STATE_PUBLISHED}
              onChange={(e) => {
                const { checked } = e.target;
                setViewState(
                  checked
                    ? ListingViewState.LISTING_VIEW_STATE_PUBLISHED
                    : ListingViewState.LISTING_VIEW_STATE_UNSPECIFIED,
                );
              }}
            />
            <label htmlFor="published">Publish product</label>
          </div>
          <Button disabled={publishing} onClick={onPublish}>
            {editView ? "Update product" : "Create product"}
          </Button>
        </section>
      </section>
    </main>
  );
}
