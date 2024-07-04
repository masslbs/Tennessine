export const ADD_ACCEPTED_CURR = "ADD_ACCEPTED_CURR";
export type TokenAddr = `0x${string}`;
export type AcceptedCurrencyActions = {
  type: "ADD_ACCEPTED_CURR";
  payload: { tokenAddr: TokenAddr };
};

export const acceptedCurrencyReducer = (
  state: TokenAddr[],
  action: AcceptedCurrencyActions,
): TokenAddr[] => {
  switch (action.type) {
    case ADD_ACCEPTED_CURR:
      return [...state, action.payload.tokenAddr];
    default:
      return state;
  }
};
