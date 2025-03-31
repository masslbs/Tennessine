// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { assert, logger, randUint64 } from "@massmarket/utils";
import { Listing } from "@massmarket/schema";

import { ListingId, ListingViewState } from "../../../types.ts";
import ErrorMessage from "../../common/ErrorMessage.tsx";
import ValidationWarning from "../../common/ValidationWarning.tsx";
import Button from "../../common/Button.tsx";
import BackButton from "../../common/BackButton.tsx";
import { useStateManager } from "../../../hooks/useStateManager.ts";
import { useRelayClient } from "../../../hooks/useRelayClient.ts";

const namespace = "frontend:edit-product";
const errlog = logger(namespace, "error");
const debug = logger(namespace, "debug");

type Image = {
  blob: null | FormData;
  url: string;
};

export default function EditProduct() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const { stateManager } = useStateManager();
  const { relayClient } = useRelayClient();
  const [listing, setListing] = useState<Listing>(new Listing());
  const [units, setUnits] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [blobs, setBlobs] = useState<FormData[]>([]);
  const [publishing, setPublishing] = useState(false);

  const itemId = search.itemId ? Number(search.itemId) as ListingId : "new";
  const editView = itemId !== "new";
  const hed = editView ? "Edit product" : "Add Product";
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!stateManager) return;
    if (editView && itemId) {
      stateManager.get(["Listings", itemId])
        .then((item: Map<string, unknown> | undefined) => {
          if (!item) {
            setErrorMsg("Error fetching listing");
            errlog("Error fetching listing", "No item found");
            return;
          }
          setListing(Listing.fromCBOR(item));
        })
        .catch((e: unknown) => {
          assert(e instanceof Error, "Error is not an instance of Error");
          setErrorMsg("Error fetching listing");
          errlog("Error fetching listing", e);
        });
    }
  }, [stateManager]);

  async function create(newListing: Listing) {
    try {
      await stateManager.set(
        ["Listings", newListing.ID],
        newListing.asCBORMap(),
      );
      await stateManager!.increment([
        "Inventory",
        newListing.ID,
      ], units);
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error creating listing", error);
      throw error;
    }
  }

  async function update(newListing: Listing) {
    try {
      //compare the edited fields against the original object.
      const oldListing = await stateManager.get(["Listings", newListing.ID]);
      if (
        newListing.Price !== oldListing.Price
      ) {
        await stateManager.set([
          "Listings",
          newListing.ID,
          "Price",
        ], newListing.Price);
      }
      if (newListing.Metadata !== oldListing!.Metadata) {
        await stateManager.set([
          "Listings",
          newListing.ID,
          "Metadata",
        ], newListing.Metadata.asCBORMap());
      }
      if (newListing.ViewState !== oldListing!.ViewState) {
        await stateManager.set([
          "Listings",
          newListing.ID,
          "ViewState",
        ], newListing.ViewState);
      }

      const prevQty = await stateManager.get([
        "Inventory",
        newListing.ID,
      ]);

      if (prevQty > units) {
        await stateManager.decrement([
          "Inventory",
          newListing.ID,
        ], prevQty - units);
      } else if (prevQty < units) {
        await stateManager.increment([
          "Inventory",
          newListing.ID,
        ], units - prevQty);
      }
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error updating listing", error);
      throw error;
    }
  }

  async function onPublish() {
    const newListing = Listing.fromCBOR(listing.asCBORMap());
    if (!newListing.Metadata.Title) {
      setValidationError("Product must include title.");
    } else if (!newListing.Metadata.Description) {
      setValidationError("Product must include description.");
    } else if (!newListing.Price) {
      setValidationError("Product must include price.");
    } else if (!newListing.Metadata.Images?.length) {
      setValidationError("Product must include image.");
    } else if (!units) {
      setValidationError("Update the number of units.");
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

        if (editView) {
          newListing.ID = itemId;
        } else {
          newListing.ID = randUint64();
        }

        editView ? await update(newListing) : await create(newListing);

        setPublishing(false);
        debug("listing published");
        navigate({
          to: "/listings",
          search: (prev: Record<string, string>) => ({
            shopId: prev.shopId,
          }),
        });
      } catch (error: unknown) {
        assert(error instanceof Error, "Error is not an instance of Error");
        errlog("Error publishing listing", error);
        setErrorMsg("Error publishing listing.");
      }
    }
  }

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement>,
    field: string,
  ) {
    const newListing = Listing.fromCBOR(listing.asCBORMap());
    if (field === "Price") {
      newListing.Price = Number(e.target.value);
    } else if (field === "ViewState") {
      newListing.ViewState = e.target.checked
        ? ListingViewState.Published
        : ListingViewState.Unspecified;
    } else {
      newListing.Metadata[field] = e.target.value;
    }
    setListing(newListing);
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
        setBlobs([...blobs, blob]);

        reader.onload = function (e) {
          const r = e.target as FileReader;
          const url = r.result;
          if (typeof url === "string") {
            const newListing = Listing.fromCBOR(listing.asCBORMap());
            const images = newListing.Metadata.Images ?? [];
            images.push(url);
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
    listing.Metadata.Images = listing.Metadata.Images.filter((a: string) =>
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
              <div className="flex flex-wrap gap-2 mt-2 justify-start">
                {listing.Metadata.Images?.map((img: string, i: number) => {
                  return (
                    <div key={i} className="relative mb-2">
                      <img
                        src={img}
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
                  value={listing.Price}
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
                checked={listing.ViewState ===
                  ListingViewState.Published}
                onChange={(e) => handleInputChange(e, "ViewState")}
              />
              <label htmlFor="published">Publish product</label>
            </div>
            <Button disabled={publishing} onClick={onPublish}>
              {editView ? "Update product" : "Create product"}
            </Button>
          </section>
        </section>
      </section>
    </main>
  );
}
