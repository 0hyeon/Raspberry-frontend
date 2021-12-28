import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import instance from "../config/Request";
import {API_URL} from "../config/constants.js";

// actions
export const SET_PRODUCTS ="SET_PRODUCTS";//완료

//actioncreators

const setProducts = createAction(SET_PRODUCTS, (products) => (products));


// initial
const initialState = {
    product_list : [],
}


//middle
//메인페이지에서 상품 리스트 불러오기
const setProductSV = ()=>{
    return function(dispatch) {
        instance.get(`${API_URL}/producsts`)
        .then(res=>{
            
            dispatch(setProducts(res.data));
        })
        .catch(err=> console.log(err));
    }
}


export default handleActions (
    {
        [SET_PRODUCTS]: (state, action) =>
        produce(state, (draft)=>{
            draft.product_list = action.payload.product_list;
        })

    },
    initialState
);

const actionCreators = {
    setProductSV,
}

export { actionCreators };
