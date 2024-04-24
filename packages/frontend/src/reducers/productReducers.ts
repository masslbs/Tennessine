// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

// @ts-nocheck
import { IProduct, Metadata, ItemId, TagId } from "@/types";

export const ADD_PRODUCT = "ADD_PRODUCT";
// export const REMOVE_PRODUCT = "REMOVE_PRODUCT";
export const SET_PRODUCTLIST = "SET_PRODUCTLIST";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const UPDATE_METADATA = "UPDATE_METADATA";
export const UPDATE_PRICE = "UPDATE_PRICE";
export const ADD_PRODUCT_TAGS = "ADD_PRODUCT_TAGS";
export const REMOVE_PRODUCT_TAG = "REMOVE_PRODUCT_TAG";
export const SET_PRODUCTS = "SET_PRODUCTS";
export const UPDATE_STOCKQTY = "UPDATE_STOCKQTY";

export type productAction =
  | {
      type: "ADD_PRODUCT" | "SET_PRODUCTLIST" | "UPDATE_PRODUCT";

      payload: { itemId: ItemId; item: IProduct };
    }
  | {
      type: "SET_PRODUCTS";
      payload: { itemId: ItemId; allProducts: Map<ItemId, IProduct> };
    };

export type updateProductAction = {
  type:
    | "UPDATE_METADATA"
    | "UPDATE_PRICE"
    | "ADD_PRODUCT_TAGS"
    | "REMOVE_PRODUCT_TAG"
    | "UPDATE_STOCKQTY";
  payload: {
    itemId: ItemId;
    metadata?: Metadata;
    price?: string;
    tagId?: TagId;
    unitDiff?: number;
  };
};
export const productReducer = (
  state: Map<`0x${string}`, IProduct>,
  action: productAction | updateProductAction
) => {
  const _state = new Map(state);
  const itemId = action.payload.itemId;
  const updateItem = _state.get(itemId) as IProduct;

  switch (action.type) {
    case ADD_PRODUCT:
    case UPDATE_PRODUCT:
      _state.set(itemId, { ...action.payload.item });
      return _state;
    case SET_PRODUCTS:
      return action.payload.allProducts;
    case UPDATE_METADATA:
    case UPDATE_PRICE:
    case ADD_PRODUCT_TAGS:
    case REMOVE_PRODUCT_TAG:
    case UPDATE_STOCKQTY:
      _state.set(itemId, productItemReducer(updateItem!, action));
      return _state;
    default:
      return state;
  }
};

const productTagReducer = (
  state: TagId[],
  action: productAction | updateProductAction
) => {
  switch (action.type) {
    case REMOVE_PRODUCT_TAG:
      return [...state.filter((ele: TagId) => ele !== action.payload.tagId)];
    case ADD_PRODUCT_TAGS:
      return [...state, action.payload.tagId];
    default:
      return state;
  }
};

const productItemReducer = (
  state: IProduct,
  action: productAction | updateProductAction
) => {
  switch (action.type) {
    case UPDATE_METADATA:
      return {
        ...state,
        metadata: action.payload.metadata,
      };
    case UPDATE_STOCKQTY:
      const prevUnit = state?.stockQty ? state.stockQty : 0;
      return {
        ...state,
        stockQty: Number(prevUnit) + Number(action.payload.unitDiff),
      };
    case REMOVE_PRODUCT_TAG:
    case ADD_PRODUCT_TAGS:
      return {
        ...state,
        tagIds: productTagReducer(state.tagIds ? state.tagIds : [], action),
      };
    case UPDATE_PRICE:
      return {
        ...state,
        price: action.payload.price,
      };
    default:
      return state;
  }
};

export const EDIT_TITLE = "EDIT_TITLE";
export const EDIT_IMG = "EDIT_IMG";
export const EDIT_PRICE = "EDIT_PRICE";
export const EDIT_UNIT = "EDIT_UNIT";
export const UPLOAD_IMG = "UPLOAD_IMG";

export const initialState = {
  metadata: { title: "", image: "" },
  price: null,
  stockQty: null,
  blob: null,
};

type NewProductAction = {
  type: "EDIT_TITLE" | "EDIT_IMG" | "EDIT_PRICE" | "EDIT_UNIT" | "UPLOAD_IMG";
  payload: {
    img: string;
    blob: Blob | null;
    price?: string;
    unit?: number;
  };
};

export const newProductReducer = (state, action: NewProductAction) => {
  switch (action.type) {
    case EDIT_TITLE:
    case EDIT_IMG:
      return {
        ...state,
        metadata: updateNewProductReducer(state.metadata, action),
      };
    case EDIT_PRICE:
      return { ...state, price: action.payload.price };
    case EDIT_UNIT:
      return { ...state, stockQty: action.payload.unit };
    case UPLOAD_IMG:
      return { ...state, blob: action.payload.blob };
    default:
      return { ...state };
  }
};

export const updateNewProductReducer = (
  state: Metadata,
  action: EDIT_IMG | EDIT_TITLE
) => {
  switch (action.type) {
    case EDIT_IMG:
      return { ...state, image: action.payload.img };
    case EDIT_TITLE:
      return { ...state, title: action.payload.title };
    default:
      return { ...state };
  }
};
