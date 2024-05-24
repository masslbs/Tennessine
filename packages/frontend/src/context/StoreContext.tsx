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

import { IProduct, TagId, ItemId, CartId, IStatus, IRelay } from "@/types";
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
import { initialStoreContext } from "../context/initialLoadingState";
import { dummyRelays } from "./dummyData";

import { setMapData, getParsedMapData, setItem, getItem } from "@/utils/level";
// @ts-expect-error FIXME
export const StoreContext = createContext<StoreContent>(initialStoreContext);

export const StoreContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const [cartItems, setCartItems] = useReducer(cartReducer, new Map());
  const [products, setProducts] = useReducer(productReducer, new Map());
  const [allTags, setAllTags] = useReducer(allTagsReducer, new Map());
  const [cartId, setCartId] = useState<CartId | null>(null);
  const [erc20Addr, setErc20Addr] = useState<null | `0x${string}`>(null);
  const [publishedTagId, setPublishedTagId] = useState<null | TagId>(null);
  const [finalizedCarts, setFinalizedCarts] = useReducer(
    finalizedCartReducer,
    new Map(),
  );
  const [db, setDb] = useState(null);

  useEffect(() => {
    (async () => {
      const { Level } = await import("level");
      const db = new Level("./db", { valueEncoding: "json" });
      console.log("here", db);
      // @ts-expect-error FIXME
      setDb(db);
      if (window && db) {
        window.addEventListener("beforeunload", () => {
          console.log("closing db connection");
          db.close();
        });
      }
    })();
  }, []);

  const [relays, setRelays] = useState<IRelay[]>(dummyRelays);
  const { relayClient } = useMyContext();

  useEffect(() => {
    //FIXME: to fix once we intergrate multiple relays
    setRelays(dummyRelays);

    (async () => {
      if (db) {
        const productsLocal = (await getParsedMapData(
          "products",
          db,
        )) as ProductsMap;

        const tagsLocal = (await getParsedMapData("tags", db)) as TagsMap;
        const cartItemsLocal = (await getParsedMapData(
          "cartItems",
          db,
        )) as CartsMap;

        const cartIdLocal = await getItem("cartId", db);
        const erc20AddrLocal = await getItem("erc20Addr", db);
        const publishedTagIdLocal = await getItem("publishedTagId", db);

        if (productsLocal?.size) {
          setProducts({
            type: SET_PRODUCTS,
            payload: {
              itemId: productsLocal.keys().next().value,
              allProducts: productsLocal,
            },
          });
        }
        if (tagsLocal?.size) {
          setAllTags({
            type: SET_ALL_TAGS,
            payload: { allTags: tagsLocal },
          });
        }
        if (cartItemsLocal?.size) {
          setCartItems({
            type: SET_ALL_CART_ITEMS,
            payload: { allCartItems: cartItemsLocal },
          });
        }
        if (cartIdLocal && cartIdLocal !== null) {
          setCartId(cartIdLocal as CartId);
        }
        if (erc20AddrLocal && erc20AddrLocal !== null) {
          setErc20Addr(erc20AddrLocal as `0x${string}`);
        }
        if (publishedTagIdLocal) {
          setPublishedTagId(publishedTagIdLocal as TagId);
        }
      }
    })();

    createState();
  }, [relayClient, db]);

  useEffect(() => {
    try {
      products.size && setMapData("products", products, db);
    } catch (error) {
      console.log(error);
    }
  }, [products]);

  useEffect(() => {
    try {
      allTags.size && setMapData("tags", allTags, db);
    } catch (error) {
      console.log(error);
    }
  }, [allTags]);

  useEffect(() => {
    try {
      cartItems.size && setMapData("cartItems", cartItems, db);
    } catch (error) {
      console.log(error);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      cartId && setItem("cartId", cartId, db);
    } catch (error) {
      console.log(error);
    }
  }, [cartId]);

  useEffect(() => {
    try {
      erc20Addr && setItem("erc20Addr", erc20Addr, db);
    } catch (error) {
      console.log(error);
    }
  }, [erc20Addr]);

  useEffect(() => {
    try {
      publishedTagId && setItem("publishedTagId", publishedTagId, db);
    } catch (error) {
      console.log(error);
    }
  }, [publishedTagId]);

  const createState = async () => {
    try {
      const stream = relayClient && relayClient.createEventStream();
      if (stream) {
        for await (const evt of stream) {
          buildState(
            products,
            allTags,
            evt.events,
            setProducts,
            setAllTags,
            setCartItems,
            setErc20Addr,
            setPublishedTagId,
            setFinalizedCarts,
          );
        }
      }
    } catch (err) {
      console.error("error receiving events", err);
    }
  };

  const addProduct = async (
    product: IProduct,
    selectedTagIds: TagId[] | [],
  ) => {
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

      changeStock([iid], [product.stockQty || 0]);

      selectedTagIds &&
        selectedTagIds.map((id) => {
          addProductToTag(id, iid);
        });
      return { id: iid, error: null };
    } catch (error) {
      console.error({ error });
      const errMsg = error as { message: string };
      return { error: errMsg.message };
    }
  };

  const updateProduct = async (
    itemId: ItemId,
    fields: { price: boolean; metadata: boolean; stockQty?: boolean },
    updatedProduct: IProduct,
    selectedTagIds: TagId[] | [],
  ) => {
    try {
      if (fields.price) {
        const priceAsNum = Number(updatedProduct.price);
        updatedProduct.price = priceAsNum.toFixed(2);
        await relayClient!.updateItem(
          itemId,
          ItemField.ITEM_FIELD_PRICE,
          updatedProduct.price,
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
          : { url: updatedProduct.metadata.image };

        const metadata = {
          title: updatedProduct.metadata.title,
          description: "updating product",
          image: path.url,
        };
        await relayClient!.updateItem(
          itemId,
          ItemField.ITEM_FIELD_METADATA,
          metadata,
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
      const errMsg = error as { message: string };
      return { error: errMsg.message };
    }
  };

  const createTag = async (name: string) => {
    try {
      const _name = name.slice(1);
      const id: TagId = await relayClient!.createTag(_name);
      const tag = { id, text: _name, color: "special" }; // TODO: color: hex?
      setAllTags({ type: ADD_TAG, payload: { tag } });
      return { id, error: null };
    } catch (error) {
      console.log({ error });
      const errMsg = error as { message: string };
      return { error: errMsg.message };
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
      const errMsg = error as { message: string };
      return { error: errMsg.message };
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
      return { id: tagId, error: null };
    } catch (error) {
      console.log({ error });
      const errMsg = error as { message: string };
      return { error: errMsg.message };
    }
  };

  const updateCart = async (itemId?: ItemId, saleQty: number = 0) => {
    const cart_id = !cartId ? await createCart() : cartId;
    try {
      const activeCartItems = (cartId && cartItems.get(cartId)?.items) || {};

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
      return { error: null };
    } catch (error) {
      const errMsg = error as { message: string };
      return {
        error: `${errMsg.message}. Create New Sale in the navigation menu. `,
      };
    }
  };

  const invalidateCart = async (msg: string | null = null) => {
    try {
      console.log(`Invalidating cart: ${msg}`);
      if (!cartId) throw Error(`No ${cartId} found`);
      if (!relayClient) throw Error(`Disconnected from relayClient`);
      await relayClient.abandonCart(cartId);
      setCartItems({
        type: UPDATE_CART_STATUS,
        payload: { cartId: cartId as CartId, status: IStatus.Failed },
      });
      await createCart();
    } catch (error) {
      setCartItems({
        type: UPDATE_CART_STATUS,
        payload: { cartId: cartId as CartId, status: IStatus.Failed },
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
      if (!relayClient) throw Error(`Disconnected from relayClient`);

      const checkout = await relayClient.commitCart(cartId, erc20);
      return {
        requestId: bytesToHex(checkout.requestId),
        cartFinalizedId: bytesToHex(checkout.cartFinalizedId),
        error: null,
      };
    } catch (error) {
      const errMsg = error as { message: string };
      invalidateCart(errMsg.message);
      return { error: errMsg.message };
    }
  };

  const value = {
    products,
    allTags,
    cartItems,
    cartId,
    erc20Addr,
    publishedTagId,
    finalizedCarts,
    relays,
    db,
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
    // @ts-expect-error FIXME
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => useContext(StoreContext);
