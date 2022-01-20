import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

// actions
export const SET_CARTITEM ="SET_CARTITEM";//완료
export const SET_INCREMENT ="SET_INCREMENT";//완료

//actioncreators

const setCartItem = createAction(SET_CARTITEM, (cartItem) => ({cartItem}));
const setCartItemIncrement = createAction(SET_INCREMENT, (cartItem) => ({cartItem}));


// initial
const initialState = {
    cartItem: [],
}


//middle
//메인페이지에서 상품 리스트 불러오기
const setCartItemSV = (DATA)=>{
    return function(dispatch) {
        // dispatch(setCartItem({DATA}));
        dispatch(setCartItem(DATA));
    }
}
const setCartItemIncrementSV = (DATA)=>{
    return function(dispatch) {
        console.log("DATA",DATA.it_Detail_quanity+1);
        // dispatch(setCartItem({DATA}));
        // const plus3 = draft.cartList.cartList.find((item) => item.id === action.payload.id)
        // if(plus3){
        //     plus3.it_Detail_quanity +=1
        // }
        let DATA = DATA.it_Detail_quanity+1
        dispatch(setCartItemIncrement(DATA));
    }
}

export default handleActions (
    {
        [SET_CARTITEM]: (state, action) =>
        produce(state, (draft)=>{
            draft.cartItem = action.payload.cartItem;
        }),
        
        [SET_INCREMENT]: (state, action) =>
        produce(state, (draft)=>{
           
            console.log('draft.cartItem',draft.cartList);
            draft.cartItem = action.payload.cartItem;
        })

    },
    initialState
);

const actionCreators = {
    setCartItemSV,
    setCartItemIncrementSV
}

export { actionCreators };
