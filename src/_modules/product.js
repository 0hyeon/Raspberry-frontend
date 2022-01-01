import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import {API_URL} from "../config/constants.js";
import axios from "axios";

// actions
export const SET_PRODUCTS ="SET_PRODUCTS";//완료

//actioncreators

const setProducts = createAction(SET_PRODUCTS, (products) => (products));


// initial
const initialState = {
    products : [],
}


//middle
//메인페이지에서 상품 리스트 불러오기
const setProductSV = ()=>{
    return function(dispatch) {
        // instance.get(`${API_URL}/producsts`)
        axios.get(`${API_URL}/v1/product/products`)
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
            draft.products = action.payload.products;
        })

    },
    initialState
);

const actionCreators = {
    setProductSV,
}

export { actionCreators };
