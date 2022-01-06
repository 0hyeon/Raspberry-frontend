import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import {API_URL} from "../config/constants.js";
import axios from "axios";

// actions
export const SET_ADDRESS ="SET_ADDRESS";//완료

//actioncreators

const setAddress = createAction(SET_ADDRESS, (setaddress) => (setaddress));


// initial
const initialState = {
    setaddress : [],
}



//OrderPage에서 도서산간지역 배송비 저장을위한 주소저장
const setAddressSV = (address)=>{
    return function(dispatch) {
        dispatch(setAddress(address));
    }
}


export default handleActions (
    {
    
        [SET_ADDRESS]: (state, action) =>
        produce(state, (draft)=>{
            draft.setaddress = action.payload;
        })
    },
    initialState
);

const actionCreators = {
    setAddressSV,
}

export { actionCreators };
