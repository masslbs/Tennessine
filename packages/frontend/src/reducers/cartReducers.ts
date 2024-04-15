// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { IStatus, CartId, ItemId } from "@/types/index";

export const REMOVE_CART_ITEM = "REMOVE_CART_ITEM";
export const CLEAR_CART = "CLEAR_CART";
export const UPDATE_CART_ITEM = "UPDATE_CART_ITEM";
export const SET_ALL_CART_ITEMS = "SET_ALL_CART_ITEMS";
export const UPDATE_CART_STATUS = "UPDATE_CART_STATUS";
export const UPDATE_CART_HASH = "UPDATE_CART_HASH";
export const SET_CART_SIG = "SET_CART_SIG";

type cartAction = {
  type: "REMOVE_CART_ITEM";
  payload: { cartId: CartId; itemId: ItemId };
};
type updateCartAction = {
  type: "UPDATE_CART_ITEM";
  payload: { cartId: CartId; itemId: ItemId; saleQty: number };
};
type clearAction = {
  type: "CLEAR_CART";
  payload: { cartId: CartId };
};
type setAllITems = {
  type: "SET_ALL_CART_ITEMS";
  payload: {
    allCartItems: Map<CartId, { [key: ItemId]: number }>;
  };
};
type statusUpdate = {
  type: "UPDATE_CART_STATUS";
  payload: {
    cartId: CartId;
    status: IStatus;
  };
};
type hashUpdate = {
  type: "UPDATE_CART_HASH";
  payload: {
    cartId: CartId;
    txHash: `0x${string}`;
  };
};
type sigUpdate = {
  type: "SET_CART_SIG";
  payload: {
    cartId: CartId;
    signature: `0x${string}`;
  };
};

type ItemState = { [key: ItemId]: number };
type CartState = {
  items: ItemState;
  status?: IStatus;
  txHash?: `0x${string}`;
  signature?: `0x${string}`;
};

export type allCartActions =
  | cartAction
  | clearAction
  | updateCartAction
  | setAllITems
  | statusUpdate
  | hashUpdate
  | sigUpdate;

export const cartReducer = (
  state: Map<CartId, CartState>,
  action: allCartActions,
): Map<CartId, CartState> => {
  const _state = new Map(state);
  switch (action.type) {
    case UPDATE_CART_ITEM:
      _state.set(
        action.payload.cartId,
        cartStateReducer(
          _state.get(action.payload.cartId) || { items: {} },
          action,
        ),
      );
      return _state;
    case SET_ALL_CART_ITEMS:
      return action.payload.allCartItems as Map<CartId, CartState>;
    case UPDATE_CART_STATUS:
    case REMOVE_CART_ITEM:
    case UPDATE_CART_HASH:
    case CLEAR_CART:
    case SET_CART_SIG:
      _state.set(
        action.payload.cartId,
        cartStateReducer(
          _state.get(action.payload.cartId) || { items: {} },
          action,
        ),
      );
      return _state;
    default:
      return _state;
  }
};
function cartStateReducer(
  state: CartState,
  action:
    | cartAction
    | updateCartAction
    | statusUpdate
    | hashUpdate
    | clearAction
    | sigUpdate,
): CartState {
  switch (action.type) {
    case UPDATE_CART_ITEM:
    case REMOVE_CART_ITEM:
      return {
        ...state,
        items: cartItemReducer({ ...state.items }, action),
      };
    case UPDATE_CART_STATUS:
      return {
        ...state,
        status: action.payload.status,
      };
    case UPDATE_CART_HASH:
      return {
        ...state,
        txHash: action.payload.txHash,
      };
    case CLEAR_CART:
      return {
        ...state,
        items: {},
      };
    case SET_CART_SIG:
      return {
        ...state,
        signature: action.payload.signature,
      };
    default:
      return { ...state };
  }
}
function cartItemReducer(
  state: ItemState,
  action: cartAction | updateCartAction | statusUpdate,
): ItemState {
  switch (action.type) {
    case UPDATE_CART_ITEM:
      return {
        ...state,
        [action.payload.itemId]: action.payload.saleQty,
      };
    case REMOVE_CART_ITEM:
      delete state[action.payload.itemId];
      return { ...state };
    default:
      return { ...state };
  }
}
