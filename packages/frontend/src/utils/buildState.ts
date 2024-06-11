// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later
import {
  ADD_PRODUCT,
  UPDATE_METADATA,
  UPDATE_PRICE,
  ADD_PRODUCT_TAGS,
  REMOVE_PRODUCT_TAG,
  UPDATE_STOCKQTY,
  updateProductAction,
  productAction,
} from "@/reducers/productReducers";
import { ADD_TAG, allTagsAction } from "@/reducers/tagReducers";
import { bytesToHex } from "viem";
import { parseMetadata } from "@/app/utils";
import { IProduct, IStatus, ITag, ItemId, TagId } from "@/types";
import {
  UPDATE_ORDER_ITEM,
  REMOVE_ORDER_ITEM,
  UPDATE_ORDER_STATUS,
  UPDATE_ORDER_HASH,
  SET_ORDER_SIG,
  allOrderActions,
} from "@/reducers/orderReducers";
import {
  SET_ORDER,
  finalizedOrderActions,
} from "@/reducers/finalizedOrderReducers";
import { ADD_KC_PUBKEY, pubKeyAction } from "@/reducers/KCPubKeysReducers";
import { Dispatch } from "react";
import { market } from "@massmarket/client/lib/protobuf/compiled";
import mmproto = market.mass;

export const buildState = (
  products: Map<ItemId, IProduct>,
  allTags: Map<TagId, ITag>,
  events: mmproto.IEvent[],
  productsDispatch: Dispatch<updateProductAction | productAction>,
  tagsDisaptch: Dispatch<allTagsAction>,
  setOrderItems: Dispatch<allOrderActions>,
  setErc20Addr: Dispatch<`0x${string}` | null>,
  setPublishedTagId: Dispatch<TagId>,
  setFinalizedOrders: Dispatch<finalizedOrderActions>,
  setPubKeys: Dispatch<pubKeyAction>,
  walletAddress?: `0x${string}` | null,
) => {
  events.map((e) => {
    if (e.storeManifest) {
      const sm = e.storeManifest;
      setPublishedTagId(bytesToHex(sm.publishedTagId));
    } else if (e.updateStoreManifest) {
      const um = e.updateStoreManifest;
      if (um.addErc20Addr) {
        console.log(
          `Adding erc20 ${bytesToHex(um.addErc20Addr)} to payment options`,
        );
        setErc20Addr(bytesToHex(um.addErc20Addr));
      } else if (um.removeErc20Addr) {
        console.log(
          `Removing erc20 ${bytesToHex(um.removeErc20Addr)} from payment options`,
        );
        setErc20Addr(null);
      }

      if (um.publishedTagId) {
        console.log(
          `Resetting published tag id to: ${bytesToHex(um.publishedTagId)}`,
        );
        setPublishedTagId(bytesToHex(um.publishedTagId));
      }
    } else if (e.createItem) {
      const _meta = parseMetadata(e.createItem.metadata!);
      const id = bytesToHex(e.createItem.eventId!);
      const item: IProduct = {
        id,
        price: e.createItem.price!,
        metadata: _meta,
      };
      productsDispatch({ type: ADD_PRODUCT, payload: { itemId: id, item } });
    } else if (e.updateItem) {
      const ui = e.updateItem;
      const id = bytesToHex(ui.itemId!);
      if (ui.metadata) {
        const _meta = parseMetadata(ui.metadata);
        productsDispatch({
          type: UPDATE_METADATA,
          payload: {
            itemId: id,
            metadata: _meta,
          },
        });
      } else if (ui.price) {
        productsDispatch({
          type: UPDATE_PRICE,
          payload: {
            itemId: id,
            price: ui.price,
          },
        });
      }
    } else if (e.createTag) {
      const id = bytesToHex(e.createTag.eventId!);
      const tag = { id, text: e.createTag.name! };
      tagsDisaptch({ type: ADD_TAG, payload: { tag } });
    } else if (e.updateTag) {
      const ut = e.updateTag;
      const tagId = bytesToHex(ut.tagId!);
      if (ut.addItemId) {
        const itemId = bytesToHex(ut.addItemId!);
        productsDispatch({
          type: ADD_PRODUCT_TAGS,
          payload: {
            itemId: itemId,
            tagId: tagId,
          },
        });
      }
      if (ut.removeItemId) {
        const itemId = bytesToHex(ut.removeItemId!);
        productsDispatch({
          type: REMOVE_PRODUCT_TAG,
          payload: {
            itemId: itemId,
            tagId: tagId,
          },
        });
      }
      if (ut.rename || ut.deleted) {
        throw new Error(`not yet handling tag renames or deltes`);
      }
    } else if (e.changeStock) {
      const evt = e.changeStock;
      if (evt.orderId && evt.orderId.byteLength && evt.txHash) {
        setOrderItems({
          type: UPDATE_ORDER_STATUS,
          payload: {
            orderId: bytesToHex(evt.orderId),
            status: IStatus.Complete,
          },
        });
        setOrderItems({
          type: UPDATE_ORDER_HASH,
          payload: {
            orderId: bytesToHex(evt.orderId),
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
    } else if (e.createOrder) {
      const orderId = bytesToHex(e.createOrder.eventId!);
      const signature = bytesToHex(e.signature!);
      setOrderItems({
        type: SET_ORDER_SIG,
        payload: {
          orderId,
          signature,
        },
      });
    } else if (e.updateOrder) {
      const uo = e.updateOrder;
      const eventId = uo.eventId;
      const _orderId = bytesToHex(uo.orderId!);

      if (uo.changeItems) {
        const ci = uo.changeItems;
        const itemId = bytesToHex(ci.itemId!);
        const quantity = ci.quantity!;
        if (quantity === 0) {
          setOrderItems({
            type: REMOVE_ORDER_ITEM,
            payload: { itemId: itemId, orderId: _orderId },
          });
        } else {
          setOrderItems({
            type: UPDATE_ORDER_ITEM,
            payload: { itemId: itemId, saleQty: quantity, orderId: _orderId },
          });
        }
      }
      if (uo.itemsFinalized) {
        console.log(uo.itemsFinalized);
        const {
          erc20Addr,
          orderHash,
          purchaseAddr,
          salesTax,
          total,
          totalInCrypto,
          subTotal,
        } = uo.itemsFinalized;
        const orderObj = {
          erc20Addr: erc20Addr ? bytesToHex(erc20Addr) : null,
          orderId: bytesToHex(orderHash),
          //purchaseAddress: bytesToHex(purchaseAddr!),
          salesTax: salesTax || null,
          total: total || null,
          subTotal: subTotal || null,
          totalInCrypto: totalInCrypto || null,
        };

        setFinalizedOrders({
          type: SET_ORDER,
          payload: {
            eventId: bytesToHex(eventId!),
            order: orderObj,
          },
        });
      }
    } else if (e.orderAbandoned) {
      setOrderItems({
        type: UPDATE_ORDER_STATUS,
        payload: {
          orderId: bytesToHex(e.orderAbandoned.orderId!),
          status: IStatus.Failed,
        },
      });
    } else if (e.newKeyCard) {
      const userWalletAddr = bytesToHex(e.newKeyCard.userWalletAddr!);
      const cardPublicKey = bytesToHex(e.newKeyCard.cardPublicKey!);
      if (
        walletAddress &&
        walletAddress.toLowerCase() == userWalletAddr.toLowerCase()
      ) {
        setPubKeys({
          type: ADD_KC_PUBKEY,
          payload: {
            cardPublicKey,
          },
        });
      }
    } else {
      console.log(e);
      throw new Error(`Unhandled event type: ${e.union}`);
    }
  });
  return { _products: products, _allTags: allTags };
};
