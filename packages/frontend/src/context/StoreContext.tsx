// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import { bytesToHex } from "viem";

import { IProduct, TagId, ItemId, CartId, IStatus } from "@/types/index";
import { useMyContext } from "./MyContext";
import {
  StoreContent,
  ItemField,
  ProductsMap,
  TagsMap,
  CartsMap,
} from "@/context/types";
import {
  productReducer,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  ADD_PRODUCT_TAGS,
  REMOVE_PRODUCT_TAG,
  SET_PRODUCTS,
  UPDATE_PRICE,
  UPDATE_METADATA,
  UPDATE_STOCKQTY,
} from "@/reducers/productReducers";
import { allTagsReducer, ADD_TAG, SET_ALL_TAGS } from "@/reducers/tagReducers";
import { buildState } from "@/utils/buildState";
import {
  CLEAR_CART,
  REMOVE_CART_ITEM,
  UPDATE_CART_ITEM,
  UPDATE_CART_STATUS,
  SET_ALL_CART_ITEMS,
  cartReducer,
} from "@/reducers/cartReducers";
import { finalizedCartReducer } from "@/reducers/finalizedCartReducers";

export const StoreContext = createContext<StoreContent>({
  products: new Map(),
  allTags: new Map(),
  cartItems: new Map(),
  cartId: `0x`,
  erc20Addr: `0x`,
  publishedTagId: `0x`,
  finalizedCarts: new Map(),
  updateCart: () =>
    new Promise(() => {
      return { error: null };
    }),
  addProduct: () =>
    new Promise(() => {
      return { error: null };
    }),
  updateProduct: () =>
    new Promise(() => {
      return { error: null };
    }),
  createState: () => {},
  createTag: () =>
    new Promise(() => {
      return `0x`;
    }),
  addProductToTag: () =>
    new Promise(() => {
      return {
        tagId: `0x`,
        itemId: `0x`,
      };
    }),
  removeProductFromTag: () =>
    new Promise(() => {
      return {
        tagId: `0x`,
        itemId: `0x`,
      };
    }),
  commitCart: () =>
    new Promise(() => {
      return {
        cartFinalizedId: `0x`,
        requestId: `0x`,
      };
    }),
  invalidateCart: () => {},
  setErc20Addr: () => {},
  setPublishedTagId: () => {},
  setCartId: () => {},
});

export const StoreContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>
) => {
  const [cartItems, setCartItems] = useReducer(cartReducer, new Map());
  const [products, setProducts] = useReducer(productReducer, new Map());
  const [allTags, setAllTags] = useReducer(allTagsReducer, new Map());
  const [cartId, setCartId] = useState<CartId | null>(null);
  const [erc20Addr, setErc20Addr] = useState<null | `0x${string}`>(null);
  const [publishedTagId, setPublishedTagId] = useState<null | `0x${string}`>(
    null
  );
  const [finalizedCarts, setFinalizedCarts] = useReducer(
    finalizedCartReducer,
    new Map()
  );
  const { relayClient } = useMyContext();

  useEffect(() => {
    const localStorageProducts = getStateFromLocalStorage(
      "products"
    ) as ProductsMap;
    const localStorageTags = getStateFromLocalStorage("tags") as TagsMap;

    const cartItemsLocal = getStateFromLocalStorage("cartItems") as CartsMap;
    const cartIdLocal = JSON.parse(localStorage.getItem("cartId")) as CartId;
    const erc20AddrLocal = JSON.parse(
      localStorage.getItem("erc20Addr")
    ) as `0x${string}`;

    const publishedTagIdLocal = JSON.parse(
      localStorage.getItem("publishedTagId")
    ) as `0x${string}`;
    if (publishedTagIdLocal) {
      setPublishedTagId(publishedTagIdLocal);
    }
    if (localStorageProducts?.size) {
      setProducts({
        type: SET_PRODUCTS,
        payload: {
          itemId: localStorageProducts.keys().next().value,
          allProducts: localStorageProducts,
        },
      });
    }
    if (localStorageTags?.size) {
      setAllTags({
        type: SET_ALL_TAGS,
        payload: { allTags: localStorageTags },
      });
    }

    if (cartItemsLocal?.size) {
      setCartItems({
        type: SET_ALL_CART_ITEMS,
        payload: { allCartItems: cartItemsLocal },
      });
    }
    if (cartIdLocal && cartIdLocal !== null) {
      setCartId(cartIdLocal);
    }
    if (erc20AddrLocal && erc20AddrLocal !== null) {
      setErc20Addr(erc20AddrLocal);
    }
    if (publishedTagId && publishedTagId !== null) {
      setPublishedTagId(publishedTagId);
    }

    createState();
  }, [relayClient]);

  useEffect(() => {
    console.log(`updating products with ${products.size} items`);
    saveToLocalStorage("products", products);
  }, [products]);

  useEffect(() => {
    saveToLocalStorage("tags", allTags);
  }, [allTags]);

  useEffect(() => {
    saveToLocalStorage("cartItems", cartItems);
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("cartId", JSON.stringify(cartId));
  }, [cartId]);

  useEffect(() => {
    localStorage.setItem("erc20Addr", JSON.stringify(erc20Addr));
  }, [erc20Addr]);

  useEffect(() => {
    localStorage.setItem("publishedTagId", JSON.stringify(publishedTagId));
  }, [publishedTagId]);

  const getStateFromLocalStorage = (key: "products" | "tags" | "cartItems") => {
    const state = localStorage.getItem(key);
    if (state) {
      return new Map(JSON.parse(state));
    } else return null;
  };

  const createState = () => {
    try {
      relayClient &&
        relayClient.addListener("event", (evt) => {
          buildState(
            products,
            allTags,
            evt.request.events,
            setProducts,
            setAllTags,
            setCartItems,
            setErc20Addr,
            setPublishedTagId,
            setFinalizedCarts
          );
          evt.done();
        });
    } catch (err) {
      console.error("error receiving events", err);
    }
  };

  const addProduct = async (product: IProduct, selectedTagIds: TagId[]) => {
    try {
      const path = await relayClient!.uploadBlob(product.blob as Blob);
      const metadata = {
        title: product.metadata.title,
        description: "adding product",
        image: path.url,
      };
      const priceAsNum = Number(product.price);
      product.price = priceAsNum.toFixed(2);
      const iid = await relayClient!.createItem(product.price, metadata);
      product.id = iid;
      product.tagIds = selectedTagIds;
      product.metadata = metadata;
      iid &&
        setProducts({
          type: ADD_PRODUCT,
          payload: { itemId: product.id, item: product },
        });

      changeStock([iid], [product.stockQty]);

      selectedTagIds &&
        selectedTagIds.map((id) => {
          addProductToTag(id, iid);
        });
      return iid;
    } catch (error) {
      console.error({ error });
      return { error: error.message };
    }
  };

  const updateProduct = async (
    itemId: ItemId,
    fields: { price: boolean; metadata: boolean; stockQty: boolean },
    updatedProduct: IProduct,
    selectedTagIds: TagId[]
  ) => {
    try {
      if (fields.price) {
        const priceAsNum = Number(updatedProduct.price);
        updatedProduct.price = priceAsNum.toFixed(2);
        await relayClient!.updateItem(
          itemId,
          ItemField.ITEM_FIELD_PRICE,
          updatedProduct.price
        );
        setProducts({
          type: UPDATE_PRICE,
          payload: {
            itemId: itemId,
            price: updatedProduct.price,
          },
        });
      }
      if (fields.metadata) {
        const hasEmbeddedImage =
          updatedProduct.metadata.image.includes("data:image");
        const path = hasEmbeddedImage
          ? await relayClient!.uploadBlob(updatedProduct.blob as Blob)
          : updatedProduct.metadata.image;

        const metadata = {
          title: updatedProduct.metadata.title,
          description: "updating product",
          image: hasEmbeddedImage ? path.url : path,
        };
        await relayClient!.updateItem(
          itemId,
          ItemField.ITEM_FIELD_METADATA,
          metadata
        );
        setProducts({
          type: UPDATE_METADATA,
          payload: {
            itemId: itemId,
            metadata: metadata,
          },
        });
      }
      if (fields.stockQty) {
        //calculate unit difference
        const previousUnit = products.get(itemId)?.stockQty || 0;
        const diff = Number(updatedProduct.stockQty) - Number(previousUnit);
        changeStock([itemId], [diff]);
        setProducts({
          type: UPDATE_STOCKQTY,
          payload: {
            itemId: itemId,
            unitDiff: diff,
          },
        });
      }

      updatedProduct.tagIds = selectedTagIds;

      setProducts({
        type: UPDATE_PRODUCT,
        payload: { itemId: itemId, item: updatedProduct },
      });
      return { error: null };
    } catch (error) {
      console.log({ error });
      return { error: error.message };
    }
  };

  const createTag = async (name: string) => {
    try {
      const _name = name.slice(1);
      const id: TagId = await relayClient!.createTag(_name);
      const tag = { id, text: _name, color: "special" }; // TODO: color: hex?
      setAllTags({ type: ADD_TAG, payload: { tag } });
      return id;
    } catch (error) {
      console.log({ error });
      return { error: error.message };
    }
  };

  const addProductToTag = async (tagId: TagId, itemId: ItemId) => {
    try {
      await relayClient!.addItemToTag(tagId, itemId);
      setProducts({
        type: ADD_PRODUCT_TAGS,
        payload: {
          itemId,
          tagId,
        },
      });
      return { error: null };
    } catch (error) {
      console.log({ error });
      return { error: error.message };
    }
  };

  const removeProductFromTag = async (tagId: TagId, itemId: ItemId) => {
    try {
      await relayClient!.removeFromTag(tagId, itemId);
      setProducts({
        type: REMOVE_PRODUCT_TAG,
        payload: {
          itemId,
          tagId,
        },
      });
      return tagId;
    } catch (error) {
      console.log({ error });
    }
  };

  const updateCart = async (itemId: ItemId, saleQty: number) => {
    const cart_id = !cartId ? await createCart() : cartId;
    try {
      const activeCartItems = cartId && cartItems.get(cartId)?.items;

      if (!itemId) {
        //Clear cart and set every item in cart to quantity 0
        const itemIds = Object.keys(activeCartItems);
        for (const itemId of itemIds) {
          await relayClient!.changeCart(cart_id, itemId as ItemId, 0);
        }
        setCartItems({ type: CLEAR_CART, payload: { cartId: cart_id } });
      } else if (saleQty === 0) {
        //delete it from cartItems
        await relayClient!.changeCart(cart_id, itemId, saleQty);
        setCartItems({
          type: REMOVE_CART_ITEM,
          payload: {
            itemId,
            cartId: cart_id,
          },
        });
      } else {
        //update item sale qty
        await relayClient!.changeCart(cart_id, itemId, saleQty);
        // const difference = (activeCartItems?.[itemId] || 0) - Number(saleQty);
        // updateUnitChnage(itemId, difference);

        setCartItems({
          type: UPDATE_CART_ITEM,
          payload: {
            cartId: cart_id,
            itemId,
            saleQty,
          },
        });
      }
    } catch (error) {
      // invalidateCart(error.message);
      return {
        error: `${error.message}. Create New Sale in the navigation menu. `,
      };
    }
  };

  const invalidateCart = async (msg: string = null) => {
    try {
      console.log(`Invalidating cart: ${msg}`);

      await relayClient.abandonCart(cartId);
      setCartItems({
        type: UPDATE_CART_STATUS,
        payload: { cartId: cartId, status: IStatus.Failed },
      });
      await createCart();
    } catch (error) {
      setCartItems({
        type: UPDATE_CART_STATUS,
        payload: { cartId: cartId, status: IStatus.Failed },
      });
      await createCart();
    }
  };

  const createCart = async () => {
    const cartId = await relayClient!.createCart();
    setCartId(cartId);
    return cartId;
  };

  const changeStock = async (itemIds: ItemId[], diffs: number[]) => {
    await relayClient!.changeStock(itemIds, diffs);
  };

  const commitCart = async (isERC20Checkout: boolean) => {
    try {
      const erc20 = erc20Addr && isERC20Checkout ? erc20Addr : null;
      if (isERC20Checkout && !erc20Addr) {
        return { error: "no erc20 address found." };
      } else if (!cartId) {
        return { error: "no cart set" };
      }
      if (erc20) {
        console.log("committing cart with erc20");
      }
      const checkout = await relayClient.commitCart(cartId, erc20);
      return {
        requestId: bytesToHex(checkout.requestId),
        cartFinalizedId: bytesToHex(checkout.cartFinalizedId),
      };
    } catch (error) {
      invalidateCart(error.message);
      return { error: error.message };
    }
  };

  const saveToLocalStorage = (
    key: string,
    map: CartsMap | TagsMap | ProductsMap
  ) => {
    const mapArray = Array.from(map.entries());
    localStorage.setItem(key, JSON.stringify(mapArray));
  };

  const value = {
    products,
    allTags,
    cartItems,
    cartId,
    erc20Addr,
    publishedTagId,
    finalizedCarts,
    addProduct,
    updateProduct,
    createState,
    createTag,
    addProductToTag,
    removeProductFromTag,
    updateCart,
    commitCart,
    invalidateCart,
    setErc20Addr,
    setPublishedTagId,
    setCartId,
  };

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => useContext(StoreContext);
