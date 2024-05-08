// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later
import { Dispatch } from "react";
import {
  ADD_PRODUCT,
  UPDATE_METADATA,
  UPDATE_PRICE,
  ADD_PRODUCT_TAGS,
  REMOVE_PRODUCT_TAG,
  UPDATE_STOCKQTY,
  updateProductAction,
  productAction,
} from "../reducers/productReducers";
import { ADD_TAG, allTagsAction } from "../reducers/tagReducers";
import { bytesToHex } from "viem";
import { parseMetadata } from "../app/utils";
import { ItemField } from "../context/types";
import { IProduct, IStatus, ITag, ItemId, TagId } from "../types";
import {
  UPDATE_CART_ITEM,
  REMOVE_CART_ITEM,
  UPDATE_CART_STATUS,
  UPDATE_CART_HASH,
  allCartActions,
} from "../reducers/cartReducers";
import {
  SET_CART,
  finalizedCartActions,
} from "../reducers/finalizedCartReducers";
import { market } from "@massmarket/client/lib/protobuf/compiled";
import mmproto = market.mass;

const ManifestField = mmproto.UpdateManifest.ManifestField;

export const buildState = (
  products: Map<ItemId, IProduct>,
  allTags: Map<TagId, ITag>,
  events: mmproto.IEvent[],
  productsDispatch: Dispatch<updateProductAction | productAction>,
  tagsDisaptch: Dispatch<allTagsAction>,
  setCartItems: Dispatch<allCartActions>,
  setErc20Addr: Dispatch<`0x${string}` | null>,
  setPublishedTagId: Dispatch<TagId>,
  setFinalizedCarts: Dispatch<finalizedCartActions>,
) => {
  events.map((e) => {
    if (e.updateManifest) {
      const um = e.updateManifest;
      const f = um.field;
      if (f == ManifestField.MANIFEST_FIELD_ADD_ERC20 && um.erc20Addr) {
        console.log(
          `Adding erc20 ${bytesToHex(um.erc20Addr)} to payment options`,
        );
        setErc20Addr(bytesToHex(um.erc20Addr));
      } else if (
        f === ManifestField.MANIFEST_FIELD_REMOVE_ERC20 &&
        um.erc20Addr
      ) {
        console.log(
          `Removing erc20 ${bytesToHex(um.erc20Addr)} from payment options`,
        );
        setErc20Addr(null);
      }

      if (f == ManifestField.MANIFEST_FIELD_PUBLISHED_TAG && um.tagId) {
        console.log(`Resetting published tag id to: ${bytesToHex(um.tagId)}`);
        setPublishedTagId(bytesToHex(um.tagId));
      }
    } else if (e.createItem) {
      const _meta = parseMetadata(e.createItem.metadata);
      const id = bytesToHex(e.createItem.eventId);
      const item: IProduct = {
        id,
        price: e.createItem.price,
        metadata: _meta,
      };
      productsDispatch({ type: ADD_PRODUCT, payload: { itemId: id, item } });
    } else if (e.updateItem) {
      const id = bytesToHex(e.updateItem.itemId);
      if (
        e.updateItem.field == ItemField.ITEM_FIELD_METADATA &&
        e.updateItem.metadata
      ) {
        const _meta = parseMetadata(e.updateItem.metadata);
        productsDispatch({
          type: UPDATE_METADATA,
          payload: {
            itemId: id,
            metadata: _meta,
          },
        });
      } else if (
        e.updateItem.field == ItemField.ITEM_FIELD_PRICE &&
        e.updateItem.price
      ) {
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
      const evt = e.changeStock;
      if (evt.cartId && evt.cartId.byteLength && evt.txHash) {
        setCartItems({
          type: UPDATE_CART_STATUS,
          payload: {
            cartId: bytesToHex(evt.cartId),
            status: IStatus.Complete,
          },
        });
        setCartItems({
          type: UPDATE_CART_HASH,
          payload: {
            cartId: bytesToHex(evt.cartId),
            txHash: bytesToHex(evt.txHash),
          },
        });
      }
      evt.itemIds?.length &&
        evt.itemIds.map((id, i) => {
          const itemId = bytesToHex(id);
          productsDispatch({
            type: UPDATE_STOCKQTY,
            payload: {
              itemId: itemId,
              unitDiff: evt.diffs ? evt.diffs[i] : 0,
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
        erc20Addr: erc20Addr ? bytesToHex(erc20Addr) : null,
        cartId: bytesToHex(cartId),
        purchaseAddress: bytesToHex(purchaseAddr),
        salesTax: salesTax || null,
        total: total || null,
        subTotal: subTotal || null,
        totalInCrypto: totalInCrypto || null,
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
    }
  });
  return { _products: products, _allTags: allTags };
};
