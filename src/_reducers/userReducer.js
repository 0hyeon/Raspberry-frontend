// import { response } from "express";
import { produce } from "immer";
import { ADD_TO_CART, SET_PRODUCTS,SELECTED_PRODUCT,REMOVE_SELECTED_PRODUCT, DECIDE_TO_CART, CART_ITEM, REQUEST_LODING,REQUEST_LODING2,FETCH_TO_CART, INCREMENT, DECREMENT,TOTALPRICE,REMOVE_FROM_CART} from "../_actions/types";
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
    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItem: state.cartItem.filter((item) => item.id !== payload.id),
      };
    case INCREMENT:
      const inCart = state.cartItem.find((item) => item.id == payload.id ? true : false);
      // if(plus3){
      //   return state.cartItem.cartItem.map((item)=>
      //     item.id == payload.id
      //     ? {...item, it_Detail_quanity:item.it_Detail_quanity + 1 }
      //     :item
      //   )
      // }
      return {
        ...state,
        cartItem: inCart				//카트에 해당되는 물품 있다면
          ? state.cartItem.map((item) =>
              item.id === payload.id
                ? { ...item, it_Detail_quanity: item.it_Detail_quanity + 1 }	//해당물품 수량 +1
                : item
            )
          : null,	//없다면 카트에 새로추가
      };
      
      // return [...prev, { ...clickedItem, amount: 1 }];
      // return [
      //   ...state, {...payload,it_Detail_quanity:1}
      // ]
    case DECREMENT:
      // const minus = state.cartItem.find((item) => item.id === payload.id)
      const inCart2 = state.cartItem.find((item) => item.id == payload.id ? true : false);
      return {
        ...state,
        cartItem: inCart2				//카트에 해당되는 물품 있다면
          ? state.cartItem.map((item) =>
              item.id === payload.id
                ? { ...item, it_Detail_quanity: item.it_Detail_quanity - 1 }	//해당물품 수량 +1
                : item
            )
          : null,	//없다면 카트에 새로추가
      };

    default:
      return { ...state};
  }
};