// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

export const ADD_ACCEPTED_CURR = "ADD_ACCEPTED_CURR";
export const UPDATE_SYMBOL = "UPDATE_SYMBOL";
export const SET_ALL_CURRENCIES = "SET_ALL_CURRENCIES";

export type TokenAddr = `0x${string}`;
export type AcceptedCurrencyActions =
  | {
      type: "ADD_ACCEPTED_CURR";
      payload: { tokenAddr: TokenAddr };
    }
  | {
      type: "UPDATE_SYMBOL";
      payload: { tokenAddr: TokenAddr; symbol: string };
    }
  | {
      type: "SET_ALL_CURRENCIES";
      payload: {
        currencies: Map<TokenAddr, null | string>;
      };
    };

export const acceptedCurrencyReducer = (
  state: Map<TokenAddr, null | string>,
  action: AcceptedCurrencyActions,
): Map<TokenAddr, null | string> => {
  const _state = new Map(state);

  switch (action.type) {
    case ADD_ACCEPTED_CURR:
      return _state.set(action.payload.tokenAddr, null);
    case UPDATE_SYMBOL:
      return _state.set(action.payload.tokenAddr, action.payload.symbol);
    case SET_ALL_CURRENCIES:
      return action.payload.currencies;
    default:
      return state;
  }
};
