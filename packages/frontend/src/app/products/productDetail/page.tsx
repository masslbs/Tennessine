// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { useState, useEffect, createRef } from "react";
import ModalHeader from "@/app/common/components/ModalHeader";
import Image from "next/image";
import Button from "@/app/common/components/Button";
import SeeProductActions from "@/app/components/products/SeeProductActions";
import { IProduct } from "@/types/index";
import { useStoreContext } from "@/context/StoreContext";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemState } from "@/context/types";
import ErrorMessage from "@/app/common/components/ErrorMessage";

const ProductDetail = () => {
  const { products, updateCart, cartItems, cartId, addProductToTag, allTags } =
    useStoreContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId");
  const [quantity, setQuantity] = useState<number>(0);
  const [showActions, setShowActions] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [item, setItem] = useState<IProduct>(products.get(itemId));

  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [buttonState, setButton] = useState<"Success" | "Review" | "Update">(
    "Review",
  );
  const [showErrorMessage, setShowErrorMessage] = useState<null | string>(null);
  const [available, setAvailable] = useState<number>(0);

  const flyoutRef = createRef();

  const handleFlyout = (event) => {
    if (flyoutRef.current && !flyoutRef.current.contains(event.target)) {
      setShowActions(false);
    }
  };

  //FIXME: kind of a hacky way of removing items for now.
  const findRemoveTagId = () => {
    for (const [key, value] of allTags.entries()) {
      if (value.text && value.text === "remove") {
        return key;
      }
    }
    setShowErrorMessage("Create a :remove tag first.");
    return null;
  };

  const handleDelete = async () => {
    const tagId = findRemoveTagId();
    const res = tagId ? await addProductToTag(tagId, itemId) : null;
    if (!res || res.error) {
      setShowErrorMessage(res.error);
    } else {
      console.log("successfully removed item");
      router.push("/products");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", (event) => handleFlyout(event));
    return () => {
      document.removeEventListener("mousedown", (event) => handleFlyout(event));
    };
  }, [flyoutRef]);

  useEffect(() => {
    const itemsInCurrentCart: ItemState =
      cartId && cartItems.get(cartId)?.items;
    if (itemId && itemsInCurrentCart?.[itemId]) {
      setAddedToCart(true);
    }
  }, [cartItems, item]);

  useEffect(() => {
    const _item = products.get(itemId);
    setItem(_item);
    setAvailable(_item?.stockQty);
    const qty = _item ? cartItems.get(cartId)?.items?.[itemId] || 0 : 0;
    setQuantity(qty);
  }, [itemId]);

  const increment = () => {
    setQuantity(quantity + 1);
    setAvailable(available - 1);

    setButton("Update");
  };
  const decrement = () => {
    setQuantity(quantity - 1);
    setAvailable(available + 1);
    setButton("Update");
  };
  const openConfirmModal = () => {
    setShowActions(false);
    setShowConfirmModal(true);
  };

  const rightIcon = showActions ? (
    <div ref={flyoutRef}>
      <SeeProductActions
        showConfirmModal={openConfirmModal}
        isOpen={showActions}
        itemId={itemId}
      />
    </div>
  ) : (
    <button
      onClick={() => {
        setShowActions(true);
      }}
    >
      <Image
        src="/assets/see-more-icon.svg"
        alt="see-more-icon"
        width={24}
        height={24}
      />
    </button>
  );

  const confirmDelete = (
    <div
      id="confirm-modal-container"
      className="absolute h-4/6 w-full flex justify-center items-center"
    >
      <div
        id="confirm-modal"
        className="w-72 h-64 bg-white text-center px-6 py-2 flex items-center justify-center rounded-2xl flex-col border"
      >
        <p>Are you sure you want to remove this product from your store?</p>
        <div id="buttons" className="flex text-sm gap-2 mt-4">
          <button
            className="border-4 p-2 rounded-lg"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-blue-900 p-3 text-white rounded-lg"
          >
            Im sure
          </button>
        </div>
      </div>
    </div>
  );

  if (!item) return null;

  const onUpdate = () => {
    setButton("Success");
    setTimeout(() => {
      setButton("Review");
    }, 1000);
  };

  const getCtaButton = () => {
    if (!addedToCart) {
      return (
        <Button
          disabled={!quantity}
          onClick={async () => {
            const res = await updateCart(item.id, quantity);
            if (res?.error) {
              setShowErrorMessage(res.error);
            } else {
              onUpdate();
            }
          }}
        >
          Add to cart
        </Button>
      );
    } else if (buttonState === "Review") {
      return <Button onClick={() => router.push("/cart")}>Review Sale</Button>;
    } else if (buttonState === "Success") {
      return (
        <button className="flex justify-center bg-green-600 w-full text-white px-4 py-4 rounded-md">
          <Image
            src="/assets/checkmark.svg"
            alt="checkmark-icon"
            width={24}
            height={24}
          />
        </button>
      );
    } else
      return (
        <Button
          onClick={async () => {
            const res = await updateCart(item.id, quantity);
            if (res?.error) {
              setShowErrorMessage(res.error);
            } else {
              onUpdate();
            }
          }}
        >
          Update Sale
        </Button>
      );
  };

  return (
    <main className="pt-under-nav h-screen bg-gray-100">
      {showConfirmModal && confirmDelete}
      <ModalHeader
        headerText="Products"
        goBack={() => {
          router.back();
        }}
        rightIcon={rightIcon}
      />
      <section className="h-[45rem] flex flex-col">
        <ErrorMessage
          errorMessage={showErrorMessage}
          onClose={() => {
            setShowErrorMessage(null);
            router.push("/products");
          }}
        />
        <div className="m-4">
          <div className="flex">
            {item.metadata.image && (
              <Image
                src={item.metadata.image}
                alt="product-detail-image"
                width={98}
                height={98}
                className="border rounded-lg"
                unoptimized={true}
                style={{ maxHeight: "98px", maxWidth: "98px" }}
              />
            )}
            <p className="text-xl flex items-center pl-4">
              {item.metadata.title}
            </p>
          </div>
          <section className="flex gap-4 flex-col">
            <div>
              <h5 className="font-sans text-gray-700 my-4">Product Details</h5>
              <div className="flex justify-between py-4 bg-white border rounded-lg p-4">
                <p>Price</p>
                <p>{item.price} usdc</p>
              </div>
            </div>
            <div>
              <h5 className="font-sans  text-gray-700 my-4">
                Inventory Details
              </h5>
              <div className="flex justify-between py-4 bg-white border rounded-lg p-4">
                <p>Available</p>
                <p>{available}</p>
              </div>
            </div>
            <div className="flex justify-between">
              <h5 className="font-sans text-gray-700 my-4">Quantity</h5>
              <div
                id="qty-button"
                className="flex bg-white px-4 h-12 rounded gap-3 border"
              >
                {quantity === 0 ? (
                  <button onClick={decrement} disabled={true}>
                    <Image
                      src={`/assets/minus-disabled.svg`}
                      width={24}
                      height={24}
                      alt="minus-icon"
                    />
                  </button>
                ) : (
                  <button onClick={decrement}>
                    <Image
                      src={`/assets/minus-active.svg`}
                      width={24}
                      height={24}
                      alt="minus-icon"
                    />
                  </button>
                )}
                <p className="flex items-center">{quantity}</p>
                {available === 0 ? (
                  <button onClick={increment} disabled={true}>
                    <Image
                      src={`/assets/plus-disabled.svg`}
                      width={24}
                      height={24}
                      alt="add-icon"
                    />
                  </button>
                ) : (
                  <button onClick={increment}>
                    <Image
                      src={`/assets/plus-active.svg`}
                      width={24}
                      height={24}
                      alt="add-icon"
                    />
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
        <div className="mt-auto bg-white p-4 pb-8 rounded-2xl border border-gray-200">
          <div className="flex my-5">
            <div className="flex flex-col mr-auto">
              <p>total</p>
              <p className="text-xs text-gray-500">{quantity} items</p>
            </div>
            <p>{(Number(item.price) * quantity).toFixed(2)} USDC</p>
          </div>
          <div>{getCtaButton()}</div>
        </div>
      </section>
    </main>
  );
};
export default ProductDetail;
