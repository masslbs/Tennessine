// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

export const SET_CART = "SET_CART";
export type EventId = `0x${string}`;

export type FinalizedCartState = {
  erc20Addr: `0x${string}` | null;
  cartId: `0x${string}`;
  purchaseAddress: `0x${string}`;
  salesTax: string | null;
  total: string | null;
  totalInCrypto: string | null;
};

export type finalizedCartActions = {
  type: "SET_CART";
  payload: { cart: FinalizedCartState; eventId: EventId };
};

export const finalizedCartReducer = (
  state: Map<EventId, FinalizedCartState>,
  action: finalizedCartActions,
): Map<EventId, FinalizedCartState> => {
  const _state = new Map(state);

  switch (action.type) {
    case SET_CART:
      _state.set(action.payload.eventId, action.payload.cart);
      return _state;
    default:
      return state;
  }
};
