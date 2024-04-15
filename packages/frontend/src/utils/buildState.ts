// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

// @ts-nocheck

import {
  ADD_PRODUCT,
  UPDATE_METADATA,
  UPDATE_PRICE,
  ADD_PRODUCT_TAGS,
  REMOVE_PRODUCT_TAG,
  UPDATE_STOCKQTY,
} from "@/reducers/productReducers";
import { ADD_TAG } from "@/reducers/tagReducers";
import { bytesToHex } from "viem";
import { parseMetadata, decodeMetadata } from "@/app/utils";
import { ItemField } from "@/context/types";
import { IProduct, IStatus } from "@/types/index";
import {
  UPDATE_CART_ITEM,
  REMOVE_CART_ITEM,
  UPDATE_CART_STATUS,
  UPDATE_CART_HASH,
  SET_CART_SIG,
} from "@/reducers/cartReducers";
import { SET_CART } from "@/reducers/finalizedCartReducers";
// TODO: cleanup workspace import madness so that we can get mmproto from dmp-ts-lib/protobuf
// see types.ts for more
enum ManifestUpdateFields {
  resetPublishedTagId = 2,
  ERC20Add = 3,
  ERC20Remove = 4,
}

export const buildState = (
  products,
  allTags,
  events,
  productsDispatch,
  tagsDisaptch,
  setCartItems,
  setErc20Addr,
  setPublishedTagId,
  setFinalizedCarts,
) => {
  events.map((e) => {
    if (e.updateManifest) {
      const um = e.updateManifest;
      const f = um.field;
      if (f == ManifestUpdateFields.ERC20Add) {
        console.log(
          `Adding erc20 ${bytesToHex(um.erc20Addr)} to payment options`,
        );
        setErc20Addr(bytesToHex(um.erc20Addr));
      } else if (f === ManifestUpdateFields.ERC20Remove) {
        console.log(
          `Removing erc20 ${bytesToHex(um.erc20Addr)} from payment options`,
        );
        setErc20Addr(null);
      }

      if (f == ManifestUpdateFields.resetPublishedTagId) {
        console.log(`Resetting published tag id to: ${bytesToHex(um.tagId)}`);
        setPublishedTagId(bytesToHex(um.tagId));
      }
    } else if (e.createItem) {
      const _meta = parseMetadata(e.createItem.metadata);

      //FIXME: ipfs url
      const id = bytesToHex(e.createItem.eventId);
      const item: IProduct = {
        id,
        price: e.createItem.price,
        metadata: _meta,
      };
      productsDispatch({ type: ADD_PRODUCT, payload: { itemId: id, item } });
    } else if (e.updateItem) {
      const id = bytesToHex(e.updateItem.itemId);
      if (e.updateItem.field == ItemField.ITEM_FIELD_METADATA) {
        const _meta = parseMetadata(e.updateItem.metadata);
        productsDispatch({
          type: UPDATE_METADATA,
          payload: {
            itemId: id,
            metadata: _meta,
          },
        });
      } else if (e.updateItem.field == ItemField.ITEM_FIELD_PRICE) {
        productsDispatch({
          type: UPDATE_PRICE,
          payload: {
            itemId: id,
            price: e.updateItem.price,
          },
        });
      }
    } else if (e.createTag) {
      const id = bytesToHex(e.createTag.eventId);
      const tag = { id, text: e.createTag.name };
      tagsDisaptch({ type: ADD_TAG, payload: { tag } });
    } else if (e.addToTag) {
      const itemId = bytesToHex(e.addToTag.itemId);
      const tagId = bytesToHex(e.addToTag.tagId);
      productsDispatch({
        type: ADD_PRODUCT_TAGS,
        payload: {
          itemId: itemId,
          tagId: tagId,
        },
      });
    } else if (e.removeFromTag) {
      const itemId = bytesToHex(e.removeFromTag.itemId);
      const tagId = bytesToHex(e.removeFromTag.tagId);
      productsDispatch({
        type: REMOVE_PRODUCT_TAG,
        payload: {
          itemId: itemId,
          tagId: tagId,
        },
      });
    } else if (e.changeStock) {
      if (e.changeStock.cartId.byteLength) {
        setCartItems({
          type: UPDATE_CART_STATUS,
          payload: {
            cartId: bytesToHex(e.changeStock.cartId),
            status: IStatus.Complete,
          },
        });
        setCartItems({
          type: UPDATE_CART_HASH,
          payload: {
            cartId: bytesToHex(e.changeStock.cartId),
            txHash: bytesToHex(e.changeStock.txHash),
          },
        });
      }
      e.changeStock.itemIds.map((id, i) => {
        const itemId = bytesToHex(id);
        productsDispatch({
          type: UPDATE_STOCKQTY,
          payload: {
            itemId: itemId,
            unitDiff: e.changeStock.diffs[i],
          },
        });
      });
    } else if (e.changeCart) {
      const itemId = bytesToHex(e.changeCart.itemId);
      const _cartId = bytesToHex(e.changeCart.cartId);
      const { quantity } = e.changeCart;
      if (quantity === 0) {
        setCartItems({
          type: REMOVE_CART_ITEM,
          payload: { itemId: itemId, cartId: _cartId },
        });
      } else {
        setCartItems({
          type: UPDATE_CART_ITEM,
          payload: { itemId: itemId, saleQty: quantity, cartId: _cartId },
        });
      }
    } else if (e.cartFinalized) {
      const {
        erc20Addr,
        cartId,
        purchaseAddr,
        salesTax,
        total,
        totalInCrypto,
        eventId,
        subTotal,
      } = e.cartFinalized;
      const cartObj = {
        erc20Addr: bytesToHex(erc20Addr),
        cartId: bytesToHex(cartId),
        purchaseAddress: bytesToHex(purchaseAddr),
        salesTax: salesTax,
        total: total,
        subTotal: subTotal,
        totalInCrypto: totalInCrypto,
      };

      setFinalizedCarts({
        type: SET_CART,
        payload: {
          eventId: bytesToHex(eventId),
          cart: cartObj,
        },
      });
    } else if (e.cartAbandoned) {
      setCartItems({
        type: UPDATE_CART_STATUS,
        payload: {
          cartId: bytesToHex(e.cartAbandoned.cartId),
          status: IStatus.Failed,
        },
      });
    } else if (e.createCart) {
      const cartId = bytesToHex(e.createCart.eventId);
      const signature = bytesToHex(e.signature);
      setCartItems({
        type: SET_CART_SIG,
        payload: {
          cartId,
          signature,
        },
      });
      console.log(`Set signature: ${signature} for cartId: ${cartId}`);
    }
  });
  return { _products: products, _allTags: allTags };
};
