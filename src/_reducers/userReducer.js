// import { response } from "express";
import { ADD_TO_CART, SET_PRODUCTS,SELECTED_PRODUCT,REMOVE_SELECTED_PRODUCT, DECIDE_TO_CART, CART_ITEM, REQUEST_LODING,REQUEST_LODING2,FETCH_TO_CART, INCREMENT, DECREMENT,TOTALPRICE} from "../_actions/types";
export const initialState = {
  products: [],
  cartItem: [],
  cartItem2: [],
  cartItem3: [],
  setproduct: [],
  total:0,
  loading:false
};
export const productsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_PRODUCTS:
      return { ...state, products: payload };
    case CART_ITEM:
      return { 
        ...state, 
        cartItem: payload,
      };
    case DECIDE_TO_CART:
 
      return { 
        ...state, 
        cartItem2: payload,
      };
    case ADD_TO_CART:
      return { ...state, cartItem3: payload };
    case REQUEST_LODING:
      return { ...state, loading : true };
    case REQUEST_LODING2:
      return { ...state, loading : false };
    case SELECTED_PRODUCT:
      return { ...state, setproduct: payload };
    case REMOVE_SELECTED_PRODUCT:
      return { ...state, setproduct: payload };
    case TOTALPRICE:
      return { 
        ...state, 
        total: state.total +  payload
      };
    case INCREMENT:
      const plus3 = state.cartItem.cartItem.find((item) => item.id === payload.id)
      if(plus3){
        plus3.it_Detail_quanity +=1
      }
      return {
        ...state, 
        cartItem:[...state.cartItem]
      }
    case DECREMENT:
      const minus = state.cartItem.cartItem.find((item) => item.id === payload.id)

      if( minus && minus.it_Detail_quanity  > 1){
        return {
          ...state, item:payload.it_Detail_quanity -= 1
        }
      }else{
        return {
          ...state
        }
      }

    default:
      return { ...state};
  }
};