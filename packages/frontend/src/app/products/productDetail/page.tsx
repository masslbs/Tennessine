// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { useState, useEffect } from "react";
// import ModalHeader from "@/app/common/components/ModalHeader";
import Image from "next/image";
import Button from "@/app/common/components/Button";
// import SeeProductActions from "@/app/components/products/SeeProductActions";
import { Item, ItemId, OrderId, Tag, TagId, Order } from "@/types";
import { useStoreContext } from "@/context/StoreContext";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemState } from "@/context/types";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import { useAuth } from "@/context/AuthContext";

const ProductDetail = () => {
  const { stateManager, getOrderId } = useStoreContext();
  const { isMerchantView } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId") as ItemId;
  const [quantity, setQuantity] = useState<number>(0);
  // const [showActions, setShowActions] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [item, setItem] = useState<Item | null>(null);

  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [buttonState, setButton] = useState<"Success" | "Review" | "Update">(
    "Review",
  );
  const [showErrorMessage, setShowErrorMessage] = useState<null | string>(null);
  const [available, setAvailable] = useState<number>(0);
  const [allTags, setAllTags] = useState(new Map());
  const [removeTagId, setRemoveTagId] = useState<null | TagId>(null);
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [currentCartItems, setCurrentCart] = useState<ItemState | null>(null);

  useEffect(() => {
    (async () => {
      const id = await getOrderId();
      setOrderId(id);
      const ci = (await stateManager.orders.get(id)).items;
      setCurrentCart(ci);
      const onChangeItems = (order: Order) => {
        if (order.id === id) {
          setCurrentCart(order.items);
        }
      };
      stateManager.orders.on("changeItems", onChangeItems);
      return () => {
        // Cleanup listeners on unmount
        stateManager.orders.removeListener("changeItems", onChangeItems);
      };
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (itemId) {
        //set item details
        const i = await stateManager.items.get(itemId);
        setItem(i);
        setAvailable(i?.quantity || 0);
        if (!currentCartItems) return;
        //Check if item is already added to cart
        if (itemId in currentCartItems) {
          setAddedToCart(true);
          setQuantity(currentCartItems[itemId]);
        }
      }
    })();
  }, [currentCartItems, itemId]);

  useEffect(() => {
    const onCreateTag = (tag: Tag) => {
      allTags.set(tag.id, tag);
      setAllTags(allTags);
    };

    (async () => {
      const tags = new Map();
      for await (const [id, tag] of stateManager.tags.iterator()) {
        tags.set(id, tag);
        if (tag.name === "remove") {
          setRemoveTagId(id as TagId);
        }
      }
      setAllTags(tags);

      // Listen to future events
      stateManager.tags.on("create", onCreateTag);
    })();

    return () => {
      // Cleanup listeners on unmount
      stateManager.items.removeListener("create", onCreateTag);
    };
  }, []);

  const changeItems = async () => {
    if (!orderId) return;
    try {
      await stateManager.orders.changeItems(orderId, itemId, quantity);
      setButton("Review");
    } catch (error) {
      setShowErrorMessage("There was an error updating cart");
    }
  };

  // const flyoutRef = createRef<HTMLDivElement>();

  // const handleFlyout = (event: MouseEvent) => {
  //   if (
  //     flyoutRef.current &&
  //     !flyoutRef.current.contains(event.target as Node)
  //   ) {
  //     setShowActions(false);
  //   }
  // };
  // useEffect(() => {
  //   document.addEventListener("mousedown", (event: MouseEvent) =>
  //     handleFlyout(event),
  //   );
  //   return () => {
  //     document.removeEventListener("mousedown", (event: MouseEvent) =>
  //       handleFlyout(event),
  //     );
  //   };
  // }, [flyoutRef]);

  const handleDelete = async () => {
    try {
      removeTagId &&
        (await stateManager.items.removeItemFromTag(removeTagId, itemId));
      console.log("successfully removed item");
      router.push("/products");
    } catch (error) {
      setShowErrorMessage("There was an error removing tag from Item.");
    }
  };

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

  const getCtaButton = () => {
    if (!addedToCart) {
      return (
        <Button disabled={!quantity} onClick={changeItems}>
          {(Number(item.price) * quantity).toFixed(2)}
        </Button>
      );
    } else if (buttonState === "Review") {
      return (
        <Button onClick={() => router.push("/checkout")}>Review Sale</Button>
      );
    } else return <Button onClick={changeItems}>Update Sale</Button>;
  };

  return (
    <main className="pt-under-nav h-screen bg-gray-100">
      {showConfirmModal && confirmDelete}
      {/* <ModalHeader /> */}
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
                width={136}
                height={136}
                className="border rounded-lg"
                unoptimized={true}
                style={{ maxHeight: "136px", maxWidth: "136px" }}
              />
            )}
            <div className="flex flex-col">
              <h2 className="text-xl flex items-center pl-4">
                {item.metadata.title}
              </h2>
              <p className=" text-xs flex items-center pl-4">
                {item.metadata.description}
              </p>
            </div>
          </div>
          <section className="flex gap-4 flex-col">
            <div>
              <h5 className="font-sans text-gray-700 my-4">Product Details</h5>
              <div className="flex justify-between py-4 bg-white border rounded-lg p-4">
                <p>Price</p>
                <p>{item.price} usdc</p>
              </div>
            </div>
            {isMerchantView ? (
              <div>
                <h5 className="font-sans  text-gray-700 my-4">
                  Inventory Details
                </h5>
                <div className="flex justify-between py-4 bg-white border rounded-lg p-4">
                  <p>Available</p>
                  <p>{available}</p>
                </div>
              </div>
            ) : null}
            <section className="flex gap-6">
              <div className="">
                <h5 className="text-xs text-primary-gray mb-2">Quantity</h5>
                <input
                  className="border-2 border-solid mt-1 p-2 rounded w-14 h-16"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <div className="">
                <h5 className="text-xs text-primary-gray mb-2">
                  Add to basket
                </h5>
                <div>{getCtaButton()}</div>
              </div>
            </section>
          </section>
        </div>

        {/* <div className="mt-auto bg-white p-4 pb-8 rounded-2xl border border-gray-200">
          <div className="flex my-5">
            <div className="flex flex-col mr-auto">
              <p>total</p>
              <p className="text-xs text-gray-500">{quantity} items</p>
            </div>
            <p>{(Number(item.price) * quantity).toFixed(2)} USDC</p>
          </div>
          <div>{getCtaButton()}</div>
        </div> */}
      </section>
    </main>
  );
};
export default ProductDetail;
