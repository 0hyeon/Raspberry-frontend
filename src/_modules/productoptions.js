import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import {API_URL} from "../config/constants.js";
import axios from "axios";

// actions
export const SET_PRODUCTSOPTIONS ="SET_PRODUCTSOPTIONS";//완료

//actioncreators

const setProductoptions = createAction(SET_PRODUCTSOPTIONS, (productoptions) => ({productoptions}));


// initial
const initialState = {
    productoptions : [],
}


//middle
//메인페이지에서 상품 리스트 불러오기
const setProductOptionsSV = (productname)=>{
    console.log("Action productname 받아오는곳",productname);
    return function(dispatch) {
        // instance.get(`${API_URL}/producsts`)

        axios.post(`${API_URL}/v1/product/productsOptions`,{productname:productname} )
        .then(res=>{
            dispatch(setProductoptions(res.data));
        })
        .catch(err=> console.log(err));
    }
}


export default handleActions (
    {
        [SET_PRODUCTSOPTIONS]: (state, action) =>
        produce(state, (draft)=>{
            draft.productoptions = action.payload.productoptions;
        })

    },
    initialState
);

const actionCreators = {
    setProductOptionsSV,
}

export { actionCreators };
