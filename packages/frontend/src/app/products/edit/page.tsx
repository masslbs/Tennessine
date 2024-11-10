// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { assert, formatUnitsFromString, logger } from "@massmarket/utils";

import { Listing, ListingId, ListingViewState, Tag, TagId } from "@/types";
import { useStoreContext } from "@/context/StoreContext";
import { useUserContext } from "@/context/UserContext";
// import ProductsTags from "@/app/components/products/ProductTags";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import Button from "@/app/common/components/Button";
import SecondaryButton from "@/app/common/components/SecondaryButton";
import ValidationWarning from "@/app/common/components/ValidationWarning";
import BackButton from "@/app/common/components/BackButton";

const namespace = "frontend:edit-product";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

const AddProductView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId") as ListingId | "new";
  const editView = itemId !== "new";
  const { getBaseTokenInfo } = useStoreContext();
  const { clientWithStateManager } = useUserContext();

  const [productInView, setProductInView] = useState<Listing | null>(null);
  const [price, setPrice] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [units, setUnits] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [viewState, setViewState] = useState(
    ListingViewState.LISTING_VIEW_STATE_UNSPECIFIED,
  );
  const [deleteConfirmation, setDeleteConfirm] = useState(false);
  const [baseDecimal, setBaseDecimal] = useState<null | number>(null);
  const [images, setImages] = useState<
    { blob: null | FormData; url: string }[]
  >([]);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    getBaseTokenInfo().then((res: [string, number]) => {
      res && setBaseDecimal(res[1]);
    });
  }, []);

  useEffect(() => {
    if (editView && itemId) {
      getBaseTokenInfo().then((res: [string, number]) => {
        clientWithStateManager!
          .stateManager!.listings.get(itemId)
          .then((item) => {
            setProductInView(item);
            setTitle(item.metadata.title);
            const price = formatUnitsFromString(item.price, res?.[1] || 0);
            setPrice(price);
            setImages(
              item.metadata.images.map((img) => {
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
      });
    }
  }, []);

  useEffect(() => {
    const selected: Tag[] = [];

    if (productInView) {
      for (const id of productInView!.tags) {
        clientWithStateManager!.stateManager!.tags.get(id).then((tag: Tag) => {
          selected.push(tag);
        });
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
  };

  const removeImg = (img: { blob: null | FormData; url: string }) => {
    setImages(images.filter((i) => img.url !== i.url));
  };

  const handleDelete = async () => {
    try {
      await clientWithStateManager!.stateManager!.listings.update({
        id: productInView!.id,
        viewState: ListingViewState.LISTING_VIEW_STATE_DELETED,
      });
      router.push("/products");
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error deleting listing", error);
      setErrorMsg("Error deleting listing");
    }
  };

  const create = async (newItem: Partial<Listing>) => {
    try {
      const { id } = await clientWithStateManager!.stateManager!.listings
        .create(
          newItem,
          baseDecimal!,
        );
      await clientWithStateManager!.stateManager!.listings.changeInventory(
        id,
        units,
      );
      if (selectedTags.length) {
        selectedTags.map(async (t) => {
          await clientWithStateManager!.stateManager!.listings.addListingToTag(
            t.id,
            id,
          );
        });
      }
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error creating listing", error);
      setErrorMsg("Error creating listing");
    }
  };

  const update = async (newItem: Partial<Listing>) => {
    try {
      //compare the edited fields against the original object.
      const diff: Partial<Listing> = {
        id: itemId as ListingId,
        viewState,
      };
      if (
        newItem.price !==
          Number(
            formatUnitsFromString(productInView!.price, baseDecimal!),
          ).toFixed(2)
      ) {
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
          await clientWithStateManager!.stateManager!.listings.addListingToTag(
            id,
            itemId as ListingId,
          );
        });
      }
      //checking for any removed tags
      const selectTagIds = selectedTags.map((t) => t.id);
      const removedTags = productInView?.tags.filter(
        (id: TagId) => !selectTagIds.includes(id),
      );
      if (removedTags?.length) {
        removedTags.map(async (id: TagId) => {
          await clientWithStateManager!.stateManager!.listings
            .removeListingFromTag(
              id,
              itemId as ListingId,
            );
        });
      }
      if (Object.keys(diff).length === 1) return;
      await clientWithStateManager!.stateManager!.listings.update(
        diff,
        baseDecimal!,
      );
      if (units !== productInView?.quantity) {
        await clientWithStateManager!.stateManager!.listings.changeInventory(
          itemId as ListingId,
          units - productInView!.quantity,
        );
      }
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error updating listing", error);
      setErrorMsg("Error updating listing");
    }
  };

  const onPublish = async () => {
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
          images.map(async (i) => {
            if (i.blob) {
              const { url } = await clientWithStateManager!.relayClient!
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
        router.push(`/products`);
      } catch (error: unknown) {
        assert(error instanceof Error, "Error is not an instance of Error");
        errlog("Error publishing listing", error);
        setErrorMsg("Error publishing listing");
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
    <main className="pt-under-nav h-screen px-4 mt-3">
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
      <BackButton href="/products" />
      <section className={`mt-2 ${deleteConfirmation ? "hidden" : ""}`}>
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
                className="p-5 w-full text-white"
              >
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={"/icons/picture.svg"}
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
              {images.map((img, i) => {
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
          <section id="tags">
            <div className="flex">
              <p>Tags</p>
            </div>
            {
              /* <ProductsTags
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              setError={setErrorMsg}
            /> */
            }
          </section>
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
          {editView
            ? (
              <div className="flex gap-1">
                <Button
                  disabled={publishing}
                  custom="w-full"
                  onClick={onPublish}
                >
                  Update
                </Button>
                <SecondaryButton
                  custom="w-full"
                  onClick={() => setDeleteConfirm(true)}
                >
                  Delete product
                </SecondaryButton>
              </div>
            )
            : (
              <Button disabled={publishing} onClick={onPublish}>
                create product
              </Button>
            )}
        </section>
      </section>
      <section className={`mt-2 ${!deleteConfirmation ? "hidden" : ""}`}>
        <h2>Delete Product</h2>
        <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
          <p>Are you sure you would like to delete the following product?</p>
          <p>{productInView?.metadata?.title}</p>
          <Button onClick={handleDelete} custom={"w-44"}>
            Delete Product
          </Button>
        </section>
      </section>
    </main>
  );
};
export default AddProductView;
