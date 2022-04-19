import { ADD_TO_CART, GET_CART_ITEM, SET_PRODUCTS,SELECTED_PRODUCT, REMOVE_SELECTED_PRODUCT, DECIDE_TO_CART, CART_ITEM, REQUEST_LODING,REQUEST_LODING2,FETCH_TO_CART,ADD_ITEM,DELETE_ITEM,INCREMENT,DECREMENT,TOTALPRICE,LOGGEDIN,REMOVE_FROM_CART
} from "./types";


export const fetchCartItem = (cart) => {
  return {
    type: FETCH_TO_CART,
    payload: cart,
  };
};
// 장바구니 가능한지 useEffect 
export const addToCart = (cartItem3) => {
  return {
    type: ADD_TO_CART,
    payload: cartItem3,
  };
};

export const decideToCart = (cartItem2) => {
  return {
    type: DECIDE_TO_CART,
    payload: cartItem2,
  };
};
//장바구니 갯수 가져오기
export const canAddToCart = (cart) => {
  return {
    type: GET_CART_ITEM,
    payload: cart,
  };
};

// store값 가져오기 
export const setProducts = (products) => {
  return {
    type: SET_PRODUCTS,
    payload: products,
  };
};

export const selectedProduct = (setproduct) => {
  return {
    type: SELECTED_PRODUCT,
    payload: setproduct,
  };
};
export const setCartItem = ({cartItem}) => {
  return {
    type: CART_ITEM,
    payload: cartItem,
  };
};
export const setRequestLoding = (comments) => {
  return {
    type: REQUEST_LODING,
    payload: comments
  };
};
export const setRequestLoding2 = (comments2) => {
  return {
    type: REQUEST_LODING2,
    payload: comments2
  };
};
export const removeSelectedProduct = (setproduct) => {
  return {
    type: REMOVE_SELECTED_PRODUCT,
    payload: setproduct
  };
};

export const addCart = (cartItem) => {
  return {
      type: ADD_ITEM,
      payload: cartItem,
  };
};

export const deleteCart = (cartItem) => {
  return {
      type: DELETE_ITEM,
      payload: cartItem,
  };
};

export const increment = (cartItem) => {
  return {
      type: INCREMENT,
      payload: cartItem,
  };
};

export const decrement = (cartItem) => {
  return {
      type: DECREMENT,
      payload: cartItem,
  };
};
export const totalprice = (total) => {
  return {
      type: TOTALPRICE,
      payload: total,
  };
};
export const loggedin = (logged) => {
  return {
      type: LOGGEDIN,
      payload: logged,
  };
};
export const removefromcart = (itemID) => {
  return {
      type: REMOVE_FROM_CART,
      payload: {
        id: itemID,
      },
  };
};