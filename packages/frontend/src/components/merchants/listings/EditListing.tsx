// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { formatUnits, parseUnits } from "viem";

import { assert, logger, randUint64 } from "@massmarket/utils";
import { Listing } from "@massmarket/schema";
import { CodecKey, CodecValue } from "@massmarket/utils/codec";

import { ListingId, ListingViewState } from "../../../types.ts";
import ErrorMessage from "../../common/ErrorMessage.tsx";
import ValidationWarning from "../../common/ValidationWarning.tsx";
import Button from "../../common/Button.tsx";
import BackButton from "../../common/BackButton.tsx";
import { useStateManager } from "../../../hooks/useStateManager.ts";
import { useRelayClient } from "../../../hooks/useRelayClient.ts";
import { useBaseToken } from "../../../hooks/useBaseToken.ts";

const namespace = "frontend:edit-product";
const errlog = logger(namespace, "error");
const debug = logger(namespace, "debug");

export default function EditProduct() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const { stateManager } = useStateManager();
  const { relayClient } = useRelayClient();
  const { baseToken } = useBaseToken();

  const [listing, setListing] = useState<Listing>(new Listing());
  const [stock, setStock] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [blobs, setBlobs] = useState<FormData[]>([]);
  const [publishing, setPublishing] = useState(false);

  const itemId = typeof search.itemId === "number"
    ? Number(search.itemId) as ListingId
    : null;
  const heading = itemId ? "Edit product" : "Add Product";
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!stateManager || !itemId) return;
    stateManager.get(["Listings", itemId])
      .then((item: CodecValue | undefined) => {
        if (!item) {
          setErrorMsg("Error fetching listing");
          errlog("Error fetching listing. No item found");
          return;
        }
        setListing(Listing.fromCBOR(item as Map<CodecKey, CodecValue>));
      })
      .catch((e: unknown) => {
        assert(e instanceof Error, "Error is not an instance of Error");
        setErrorMsg("Error fetching listing");
        errlog("Error fetching listing", e);
      });
    stateManager.get(["Inventory", itemId])
      .then((item: CodecValue | undefined) => {
        if (item) {
          setStock(Number(item));
        }
      });
  }, [stateManager, itemId]);

  async function create(newListing: Listing) {
    assert(stateManager, "State manager is required");
    await stateManager.set(["Listings", newListing.ID], newListing);
    await stateManager.set(["Inventory", newListing.ID], stock);
  }

  async function update(newListing: Listing) {
    assert(stateManager, "State manager is required");
    //compare the edited fields against the original object.
    const listingPath = ["Listings", newListing.ID];
    const oldListing = Listing.fromCBOR(
      await stateManager.get(listingPath) as Map<CodecKey, CodecValue>,
    );
    if (oldListing === undefined) {
      throw new Error("Listing not found");
    }
    if (newListing.Price !== oldListing.Price) {
      await stateManager.set([...listingPath, "Price"], newListing.Price);
    }
    if (newListing.Metadata !== oldListing!.Metadata) {
      await stateManager.set(
        [...listingPath, "Metadata"],
        newListing.Metadata.asCBORMap(),
      );
    }
    if (newListing.ViewState !== oldListing!.ViewState) {
      await stateManager.set(
        [...listingPath, "ViewState"],
        newListing.ViewState,
      );
    }

    await stateManager.set(["Inventory", newListing.ID], stock);
  }

  async function onPublish() {
    const newListing = Listing.fromCBOR(
      listing.asCBORMap() as Map<CodecKey, CodecValue>,
    );
    if (!newListing.Metadata.Title) {
      setValidationError("Product must include title.");
    } else if (!newListing.Metadata.Description) {
      setValidationError("Product must include description.");
    } else if (!newListing.Price) {
      setValidationError("Product must include price.");
    } else if (!newListing.Metadata.Images?.length) {
      setValidationError("Product must include image.");
    } else if (!stock) {
      setValidationError("Update the number of stock.");
    } else {
      try {
        setPublishing(true);
        if (blobs.length > 0) {
          const uploaded = await Promise.all(
            blobs.map(async (i: FormData) => {
              const { url } = await relayClient!
                .uploadBlob(i);
              return url;
            }),
          );
          newListing.Metadata.Images = uploaded;
        }

        if (itemId) {
          newListing.ID = itemId;
          await update(newListing);
        } else {
          newListing.ID = randUint64();
          await create(newListing);
        }
        debug("listing published");

        navigate({
          to: "/listings", // TODO: the routes should be constants
          search: (prev: Record<string, string>) => ({
            shopId: prev.shopId,
          }),
        });
      } catch (error: unknown) {
        assert(error instanceof Error, "Error is not an instance of Error");
        errlog("Error publishing listing", error);
        setErrorMsg("Error publishing listing.");
      } finally {
        setPublishing(false);
      }
    }
  }

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement>,
    field: string,
  ) {
    // We need to create a deep copy of the class and call setListing, or else react will not recognize it as a state change, and will not re-render the component.
    const newListing = Listing.fromCBOR(
      listing.asCBORMap() as Map<CodecKey, CodecValue>,
    );
    if (field === "Price") {
      newListing.Price = parseUnits(e.target.value, baseToken.decimals);
    } else if (field === "ViewState") {
      newListing.ViewState = e.target.checked
        ? ListingViewState.Published
        : ListingViewState.Unspecified;
    } else if (field === "Title") {
      newListing.Metadata.Title = e.target.value;
    } else if (field === "Description") {
      newListing.Metadata.Description = e.target.value;
    } else {
      throw new Error(`Unknown field: ${field}`);
    }
    setListing(newListing);
  }

  function handleStockChange(e: ChangeEvent<HTMLInputElement>) {
    const stock = e.target.value;
    if (stock && !Number(stock)) {
      setStock(0);
    } else {
      setStock(Number(e.target.value) || 0);
    }
  }

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    try {
      const fileInput = e.target;
      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        const blob = new FormData();
        blob.append("file", fileInput.files[0]);
        setBlobs([...blobs, blob]);

        reader.onload = function (e) {
          const r = e.target as FileReader;
          const url = r.result;
          if (typeof url === "string") {
            const images = listing.Metadata.Images ?? [];
            images.push(url);
            const newListing = Listing.fromCBOR(
              listing.asCBORMap() as Map<CodecKey, CodecValue>,
            );
            newListing.Metadata.Images = images;
            setListing(newListing);
          }
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

  function removeImg(img: string) {
    listing.Metadata.Images = listing.Metadata!.Images!.filter((a: string) =>
      img !== a
    );
    setListing(listing);
  }
  return (
    <main
      className="pt-4 px-3 pt-under-nav md:flex justify-center"
      data-testid="edit-listing-screen"
    >
      <section className="md:w-[560px]">
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
        <section className="mt-3">
          <div className="flex">
            <h2>{heading}</h2>
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
                value={listing.Metadata.Title}
                className="border-2 border-solid mt-1 p-3 rounded-md bg-background-gray"
                data-testid="title"
                name="title"
                onChange={(e) => handleInputChange(e, "Title")}
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
                value={listing.Metadata.Description}
                className="border-2 border-solid mt-1 p-3 rounded-md bg-background-gray"
                data-testid="description"
                name="description"
                onChange={(e) => handleInputChange(e, "Description")}
              />
            </form>
            <section className="flex flex-col">
              <p className="mb-2">Product pics</p>
              <div className="border-2 border-solid rounded-md bg-background-gray h-32 flex">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="p-5 w-full text-white"
                  style={{ backgroundColor: "white" }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src="/icons/images.svg"
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
              <div
                className="flex flex-wrap gap-2 mt-2 justify-start"
                data-testid="listing-images"
              >
                {listing.Metadata.Images?.map((img: string, i: number) => {
                  return (
                    <div key={i} className="relative mb-2">
                      <img
                        src={img}
                        width={105}
                        height={95}
                        data-testid="uploaded-product-image"
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
                  type="number"
                  step="any"
                  value={formatUnits(listing.Price, baseToken.decimals)}
                  className="border-2 border-solid mt-1 p-3 rounded-md bg-background-gray"
                  data-testid="price"
                  name="price"
                  onChange={(e) => handleInputChange(e, "Price")}
                />
              </form>
              <form
                className="flex flex-col w-40"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <label htmlFor="stock">stock</label>
                <input
                  value={stock}
                  className="border-2 border-solid mt-1 p-3 rounded-md bg-background-gray"
                  data-testid="stock"
                  name="stock"
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
                checked={listing.ViewState ===
                  ListingViewState.Published}
                onChange={(e) => handleInputChange(e, "ViewState")}
              />
              <label htmlFor="published">Publish product</label>
            </div>
            <Button
              disabled={publishing}
              onClick={onPublish}
              data-testid="save-button"
            >
              {itemId ? "Update product" : "Create product"}
            </Button>
          </section>
        </section>
      </section>
    </main>
  );
}
