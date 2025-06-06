// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { assert } from "@std/assert";
import { formatUnits, parseUnits } from "viem";
import { getLogger } from "@logtape/logtape";

import { randUint64 } from "@massmarket/utils";
import { Listing } from "@massmarket/schema";
import { CodecKey, CodecValue } from "@massmarket/utils/codec";

import DeleteListing from "./DeleteListing.tsx";
import { ListingId, ListingViewState } from "../../../types.ts";
import ErrorMessage from "../../common/ErrorMessage.tsx";
import ValidationWarning from "../../common/ValidationWarning.tsx";
import Button from "../../common/Button.tsx";
import BackButton from "../../common/BackButton.tsx";
import { useStateManager } from "../../../hooks/useStateManager.ts";
import { useRelayClient } from "../../../hooks/useRelayClient.ts";
import { useBaseToken } from "../../../hooks/useBaseToken.ts";
import { getErrLogger } from "../../../utils/mod.ts";

const baseLogger = getLogger(["mass-market", "frontend", "EditListing"]);

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
  // This state is to store the price input value as a string to allow flexibility when typing in decimals
  const [priceInput, setPriceInput] = useState("");
  const [showDeleteScreen, setDeleteScreen] = useState(false);

  const itemId = typeof search.itemId === "number"
    ? Number(search.itemId) as ListingId
    : null;
  const heading = itemId ? "Edit product" : "Add Product";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const logger = baseLogger.with({
    listingId: itemId,
  });
  const logError = getErrLogger(logger, setErrorMsg);

  useEffect(() => {
    if (!stateManager || !itemId || !baseToken) return;
    stateManager.get(["Listings", itemId])
      .then((item: CodecValue | undefined) => {
        if (!item) {
          logError("Error fetching listing. No item found");
          return;
        }
        const l = Listing.fromCBOR(item);
        setListing(l);
        setPriceInput(formatUnits(l.Price, baseToken.decimals));
      })
      .catch((error: unknown) => {
        logError("Error fetching listing", error);
      });
    stateManager.get(["Inventory", itemId])
      .then((item: CodecValue | undefined) => {
        if (item) {
          setStock(Number(item));
        }
      });
  }, [stateManager, itemId, baseToken]);

  async function create(newListing: Listing) {
    assert(stateManager, "State manager is required");
    await stateManager.set(["Listings", newListing.ID], newListing);
    await stateManager.set(["Inventory", newListing.ID], stock);
  }

  async function update(newListing: Listing) {
    assert(stateManager, "State manager is required");
    //compare the edited fields against the original object.
    const listingPath = ["Listings", newListing.ID];
    const oldListingMap = await stateManager.get(listingPath);
    if (!oldListingMap) {
      throw new Error("Listing not found");
    }
    const oldListing = Listing.fromCBOR(oldListingMap);
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
  function scroll() {
    // Deno doesn't support globalThis.scrollTo
    const element = document.getElementById("top");
    element?.scrollIntoView();
  }
  async function onPublish() {
    const newListing = Listing.fromCBOR(listing.asCBORMap());
    if (!newListing.Metadata.Title) {
      setValidationError("Product must include title.");
    } else if (!newListing.Metadata.Description) {
      setValidationError("Product must include description.");
    } else if (!priceInput) {
      setValidationError("Product must include price.");
    } else if (!newListing.Metadata.Images?.length) {
      setValidationError("Product must include image.");
    } else {
      try {
        setPublishing(true);
        if (blobs.length > 0) {
          const newUploads = await Promise.all(
            blobs.map(async (i: FormData) => {
              const { url } = await relayClient!
                .uploadBlob(i);
              return url;
            }),
          );
          const urls = newListing.Metadata.Images.filter((s: string) =>
            !s.includes("data:image")
          );
          newListing.Metadata.Images = [...urls, ...newUploads];
        }
        newListing.Price = parseUnits(priceInput, baseToken.decimals);

        if (itemId) {
          newListing.ID = itemId;
          await update(newListing);
        } else {
          newListing.ID = randUint64();
          await create(newListing);
        }
        logger.debug("listing published");

        navigate({
          to: "/listings", // TODO: the routes should be constants
          search: (prev: Record<string, string>) => ({
            shopId: prev.shopId,
          }),
        });
      } catch (error: unknown) {
        logError("Error publishing listing", error);
      } finally {
        setPublishing(false);
      }
    }
    scroll();
  }

  function isTextArea(
    elem: HTMLInputElement | HTMLTextAreaElement,
  ): elem is HTMLTextAreaElement {
    return "rows" in elem;
  }
  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) {
    // We need to create a deep copy of the class and call setListing, or else react will not recognize it as a state change, and will not re-render the component.
    const newListing = Listing.fromCBOR(
      listing.asCBORMap() as Map<CodecKey, CodecValue>,
    );
    const target = e.target;
    if (field === "ViewState" && !isTextArea(target)) {
      newListing.ViewState = target.checked
        ? ListingViewState.Published
        : ListingViewState.Unspecified;
    } else if (field === "Title") {
      newListing.Metadata.Title = target.value;
    } else if (field === "Description" && isTextArea(target)) {
      newListing.Metadata.Description = target.value;
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
      logError("Error during image upload", error);
    }
  }

  function triggerFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function removeImg(img: string) {
    const newListing = Listing.fromCBOR(
      listing.asCBORMap() as Map<CodecKey, CodecValue>,
    );
    newListing.Metadata.Images = newListing.Metadata!.Images!.filter((
      a: string,
    ) => img !== a);
    setListing(newListing);
  }

  function handlePriceChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    // Only allow numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setPriceInput(value);
    }
  }

  if (showDeleteScreen) {
    return <DeleteListing listing={listing} />;
  }

  return (
    <main
      className="px-5 md:flex justify-center"
      data-testid="edit-listing-screen"
    >
      <section className="md:w-[560px]">
        <BackButton />
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
        <section className="mt-[10px]">
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
                placeholder="Product name"
                className="mt-1 p-2 rounded-md"
                data-testid="title"
                style={{ backgroundColor: "#F3F3F3" }}
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
              <textarea
                value={listing.Metadata.Description}
                placeholder="Product text"
                className="mt-1 p-2 rounded-md min-h-[7rem]"
                data-testid="description"
                style={{ backgroundColor: "#F3F3F3" }}
                name="description"
                onChange={(e) => handleInputChange(e, "Description")}
              />
            </form>
            <form
              className="flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label htmlFor="price">Price</label>
              <input
                type="text"
                value={priceInput}
                placeholder="0.00"
                className="mt-1 p-2 rounded-md"
                data-testid="price"
                style={{ backgroundColor: "#F3F3F3" }}
                name="price"
                // Only allow numbers and a single decimal point
                pattern="^\d*\.?\d*$"
                inputMode="decimal"
                onChange={handlePriceChange}
              />
            </form>
            <form
              className="flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label htmlFor="stock">Units available</label>
              <input
                value={stock}
                className="mt-1 p-2 rounded-md"
                data-testid="stock"
                style={{ backgroundColor: "#F3F3F3" }}
                name="stock"
                onChange={(e) => handleStockChange(e)}
              />
            </form>
            <section className="flex flex-col">
              <p className="mb-2">Product images</p>
              <div className="rounded-md h-32 flex">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="p-5 w-full text-white"
                  style={{ backgroundColor: "#F3F3F3" }}
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
                className="grid grid-cols-3 md:flex md:flex-wrap gap-2 mt-2"
                data-testid="listing-images"
              >
                {listing.Metadata.Images?.map((img: string, i: number) => {
                  return (
                    <div key={i} className="relative">
                      <img
                        src={img}
                        width={105}
                        height={95}
                        data-testid="uploaded-product-image"
                        style={{
                          objectFit: "cover",
                          height: "95px",
                          width: "105px",
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

            <div className="hidden">
              <input
                type="file"
                data-testid="file-upload"
                ref={fileInputRef}
                className="file-input "
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
            <div className="flex gap-2 whitespace-nowrap">
              <Button
                disabled={publishing}
                onClick={onPublish}
                data-testid="save-button"
                custom="w-fit"
              >
                {itemId ? "Update product" : "Create product"}
              </Button>
              {itemId
                ? (
                  <button
                    type="button"
                    className="bg-[#F3F3F3] text-lg text-black px-3 py-2 rounded-md"
                    onClick={() => setDeleteScreen(true)}
                  >
                    Delete product
                  </button>
                )
                : null}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
