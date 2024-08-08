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
import { bytesToHex, hexToBytes } from "viem";
import {
  Item,
  TagId,
  ItemId,
  Status,
  Relay,
  Order,
  KeyCard,
  ShopManifest,
  Tag,
} from "@/types";
import { useMyContext } from "./MyContext";
import { StoreContent, OrderId } from "@/context/types";
import {
  productReducer,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  ADD_PRODUCT_TAGS,
  REMOVE_PRODUCT_TAG,
  UPDATE_PRICE,
  UPDATE_METADATA,
  UPDATE_STOCKQTY,
} from "@/reducers/productReducers";
import { allTagsReducer, ADD_TAG } from "@/reducers/tagReducers";
import {
  CLEAR_ORDER,
  REMOVE_ORDER_ITEM,
  UPDATE_ORDER_ITEM,
  UPDATE_ORDER_STATUS,
  orderReducer,
  OrderState,
  CLEAR_ALL_ORDERS,
} from "@/reducers/orderReducers";
import {
  acceptedCurrencyReducer,
  UPDATE_SYMBOL,
} from "@/reducers/acceptedCurrencyReducers";
import { finalizedOrderReducer } from "@/reducers/finalizedOrderReducers";
import { initialStoreContext } from "../context/initialLoadingState";
import { dummyRelays } from "./dummyData";
import { pubKeyReducer } from "@/reducers/KCPubKeysReducers";
import { hardhat, sepolia, mainnet } from "viem/chains";
import { StateManager } from "@massmarket/stateManager";
// @ts-expect-error FIXME
export const StoreContext = createContext<StoreContent>(initialStoreContext);

export const StoreContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const [orderItems, setOrderItems] = useReducer(orderReducer, new Map());
  const [products, setProducts] = useReducer(productReducer, new Map());
  const [allTags, setAllTags] = useReducer(allTagsReducer, new Map());
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [erc20Addr, setErc20Addr] = useState<null | `0x${string}`>(null);
  const [publishedTagId, setPublishedTagId] = useState<null | TagId>(null);
  const [finalizedOrders] = useReducer(finalizedOrderReducer, new Map());
  const [shopManifest, setShopManifest] = useState<ShopManifest | null>(null);
  const [acceptedCurrencies, setAcceptedCurrencies] = useReducer(
    acceptedCurrencyReducer,
    new Map(),
  );
  const [pubKeys] = useReducer(pubKeyReducer, []);
  const [relays, setRelays] = useState<Relay[]>(dummyRelays);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const { relayClient, getTokenInformation, shopId } = useMyContext();
  const [stateManager, setStateManager] = useState<StateManager | null>(null);

  const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME!;
  const usedChainId: number =
    chainName === "sepolia"
      ? sepolia.id
      : chainName === "hardhat"
        ? hardhat.id
        : mainnet.id;

  useEffect(() => {
    if (relayClient) {
      (async () => {
        const { Level } = await import("level");
        const dbName = shopId?.slice(0, 7);
        console.log("using level db:", { dbName });
        const db = new Level(`./${dbName}`, {
          valueEncoding: "json",
        });

        const listingStore = db.sublevel<string, Item>("listingStore", {
          valueEncoding: "json",
        });
        const tagStore = db.sublevel<string, Tag>("tagStore", {
          valueEncoding: "json",
        });
        const shopManifestStore = db.sublevel<string, ShopManifest>(
          "shopManifestStore",
          {
            valueEncoding: "json",
          },
        );
        const orderStore = db.sublevel<string, Order>("orderStore", {
          valueEncoding: "json",
        });

        const keycardStore = db.sublevel<string, KeyCard>("keycardStore", {
          valueEncoding: "json",
        });
        const stateManager = new StateManager(
          relayClient,
          listingStore,
          tagStore,
          shopManifestStore,
          orderStore,
          keycardStore,
        );
        setStateManager(stateManager);

        stateManager.manifest.on("create", async () => {
          console.log("create manifest");
          const shopManifest = await stateManager.manifest.get();

          setShopManifest(shopManifest);
        });

        //on page refresh, retrieve stored data
        const savedShopManifest = await stateManager.manifest.get();
        setShopManifest(savedShopManifest);

        if (window && db) {
          window.addEventListener("beforeunload", () => {
            console.log("closing db connection");
            db.close();
          });
        }
      })();
    }
  }, [relayClient]);

  useEffect(() => {
    (async () => {
      const currencies = Array.from([...acceptedCurrencies.keys()]);
      const _cur = currencies.filter((a) => !acceptedCurrencies.get(a));
      _cur.map(async (address) => {
        const { symbol } = await getTokenInformation(address);

        setAcceptedCurrencies({
          type: UPDATE_SYMBOL,
          payload: { tokenAddr: address, symbol },
        });
      });
    })();
  }, [acceptedCurrencies]);

  const verify = async (
    _orderItems: Map<OrderId, OrderState>,
    _pubKeys: `0x${string}`[],
  ) => {
    console.log(_orderItems, _pubKeys);
    // const addresses = _pubKeys.map((k) => {
    //   return Address.fromPublicKey(hexToBytes(k)).toString();
    // });
    // const keysArr: `0x${string}`[] = _orderItems.size
    //   ? Array.from([..._orderItems.keys()])
    //   : [];
    // for (const _orderId of keysArr) {
    //   const _order = _orderItems.get(_orderId) as OrderState;
    //   if (_order && _order.status !== Status.Failed) {
    //     const sig = _order.signature as `0x${string}`;
    //     const retrievedAdd = await relayClient!.recoverSignedAddress(
    //       _orderId,
    //       sig,
    //     );
    //     if (addresses.includes(retrievedAdd.toLowerCase())) {
    //       console.log("inside inclue", _orderId);
    //       setOrderId(_orderId);
    //     }
    //   }
    // }
  };

  const addProduct = async (product: Item, selectedTagIds: TagId[] | []) => {
    try {
      const path = await relayClient!.uploadBlob(product.blob as FormData);
      const metadata = {
        title: product.metadata.title,
        description: product.metadata.description,
        image: path.url as string,
      };

      const priceAsNum = Number(product.price);
      product.price = priceAsNum.toFixed(2);
      const iid = await relayClient!.createItem({
        price: product.price,
        metadata: new TextEncoder().encode(JSON.stringify(metadata)),
      });
      const productId = bytesToHex(iid);
      product.id = productId;
      product.tags = selectedTagIds;
      product.metadata = metadata;
      productId &&
        setProducts({
          type: ADD_PRODUCT,
          payload: { itemId: productId, item: product },
        });
      changeStock([iid], [product.quantity || 0]);

      selectedTagIds &&
        selectedTagIds.map((id) => {
          addProductToTag(id, productId);
        });
      return { id: productId, error: null };
    } catch (error) {
      console.error({ error });
      const errMsg = error as { message: string };
      return { error: errMsg.message };
    }
  };

  const updateProduct = async (
    itemId: ItemId,
    fields: { price: boolean; metadata: boolean; quantity?: boolean },
    updatedProduct: Item,
    selectedTagIds: TagId[] | [],
  ) => {
    try {
      const itemIdBytes = hexToBytes(itemId);
      if (fields.price) {
        const priceAsNum = Number(updatedProduct.price);
        updatedProduct.price = priceAsNum.toFixed(2);
        await relayClient!.updateItem({
          itemId: itemIdBytes,
          price: updatedProduct.price,
        });
        setProducts({
          type: UPDATE_PRICE,
          payload: {
            itemId,
            price: updatedProduct.price,
          },
        });
      }
      if (fields.metadata) {
        const hasEmbeddedImage =
          updatedProduct.metadata.image.includes("data:image");
        const path = hasEmbeddedImage
          ? await relayClient!.uploadBlob(updatedProduct.blob as FormData)
          : { url: updatedProduct.metadata.image };

        const metadata = {
          title: updatedProduct.metadata.title,
          description: updatedProduct.metadata.description,
          image: path.url,
        };
        await relayClient!.updateItem({
          itemId: itemIdBytes,
          metadata: new TextEncoder().encode(JSON.stringify(metadata)),
        });
        setProducts({
          type: UPDATE_METADATA,
          payload: {
            itemId,
            metadata: metadata,
          },
        });
      }
      if (fields.quantity) {
        //calculate unit difference
        const previousUnit = products.get(itemId)?.quantity || 0;
        const diff = Number(updatedProduct.quantity) - Number(previousUnit);
        changeStock([itemIdBytes], [diff]);
        setProducts({
          type: UPDATE_STOCKQTY,
          payload: {
            itemId: itemId,
            unitDiff: diff,
          },
        });
      }

      updatedProduct.tags = selectedTagIds;

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
      const id: TagId = bytesToHex(
        await relayClient!.createTag({ name: _name }),
      );
      const tag = { id, name }; // TODO: color: hex?
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
      await relayClient!.updateTag({
        tagId: hexToBytes(tagId),
        addItemId: hexToBytes(itemId),
      });
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
      await relayClient!.updateTag({
        tagId: hexToBytes(tagId),
        removeItemId: hexToBytes(itemId),
      });
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

  const updateOrder = async (itemId?: ItemId, saleQty: number = 0) => {
    const order_id = !orderId ? await createOrder() : orderId;
    try {
      const activeOrderItems =
        (orderId && orderItems.get(orderId)?.items) || {};

      if (!itemId) {
        //Clear order and set every item in order to quantity 0
        const itemIds = Object.keys(activeOrderItems) as ItemId[];
        for (const id of itemIds) {
          await relayClient!.updateOrder({
            orderId: hexToBytes(order_id),
            changeItems: { itemId: hexToBytes(id), quantity: 0 },
          });
        }
        setOrderItems({ type: CLEAR_ORDER, payload: { orderId: order_id } });
      } else if (saleQty === 0) {
        //delete it from orderItems
        await relayClient!.updateOrder({
          order: hexToBytes(order_id),
          changeItems: { itemId: hexToBytes(itemId), quantity: saleQty },
        });
        setOrderItems({
          type: REMOVE_ORDER_ITEM,
          payload: {
            itemId,
            orderId: order_id,
          },
        });
      } else {
        //update item sale qty
        await relayClient!.updateOrder({
          orderId: hexToBytes(order_id),
          changeItems: { itemId: hexToBytes(itemId), quantity: saleQty },
        });
        // const difference = (activeOrderItems?.[itemId] || 0) - Number(saleQty);
        // updateUnitChnage(itemId, difference);

        setOrderItems({
          type: UPDATE_ORDER_ITEM,
          payload: {
            orderId: order_id,
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

  const invalidateOrder = async (msg: string | null = null) => {
    try {
      console.log(`Invalidating order: ${msg}`);
      if (!orderId) throw Error(`No ${orderId} found`);
      if (!relayClient) throw Error(`Disconnected from relayClient`);
      // await relayClient.updateOrder({
      //   orderId: hexToBytes(orderId),
      //   orderCancelled: { timestamp: Date.now() },
      // });
      setOrderItems({
        type: UPDATE_ORDER_STATUS,
        payload: { orderId: orderId as OrderId, status: Status.Failed },
      });
      setOrderItems({
        type: CLEAR_ALL_ORDERS,
      });
      await createOrder();
    } catch (error) {
      setOrderItems({
        type: UPDATE_ORDER_STATUS,
        payload: { orderId: orderId as OrderId, status: Status.Failed },
      });
      await createOrder();
    }
  };

  const createOrder = async () => {
    const orderId = bytesToHex(await relayClient!.createOrder());
    console.log(`new orderId set to ${orderId}`);
    setOrderId(orderId);
    return orderId;
  };

  const changeStock = async (itemIds: Uint8Array[], diffs: number[]) => {
    await relayClient!.changeStock({ itemIds, diffs });
  };

  const commitOrder = async () => {
    try {
      if (!relayClient) throw Error(`Disconnected from relayClient`);
      if (!selectedCurrency) throw Error(`No currency selected.`);
      const checkout = await relayClient.commitOrder({
        orderId: hexToBytes(orderId as OrderId),
        currency: {
          tokenAddr: hexToBytes(selectedCurrency!),
          chainId: usedChainId,
        },
        payeeName: "default",
      });
      return {
        requestId: bytesToHex(checkout.requestId),
        orderFinalizedId: bytesToHex(checkout.orderFinalizedId),
        error: null,
      };
    } catch (error) {
      const errMsg = error as { message: string };
      invalidateOrder(errMsg.message);
      return { error: errMsg.message };
    }
  };

  const value = {
    products,
    allTags,
    orderItems,
    orderId,
    erc20Addr,
    publishedTagId,
    finalizedOrders,
    relays,
    shopManifest,
    addProduct,
    updateProduct,
    createTag,
    addProductToTag,
    removeProductFromTag,
    updateOrder,
    commitOrder,
    invalidateOrder,
    setErc20Addr,
    setPublishedTagId,
    setOrderId,
    setShopManifest,
    acceptedCurrencies,
    selectedCurrency,
    setSelectedCurrency,
    stateManager,
  };

  return (
    // @ts-expect-error FIXME
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => useContext(StoreContext);
