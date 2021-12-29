import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import {API_URL} from "../config/constants.js";
import axios from "axios";

// actions
export const SET_USER ="SET_USER";//완료

//actioncreators

const setUser = createAction(SET_USER, (user) => (user));


// initial
const initialState = {
    user : [],
}


//middle
//메인페이지에서 상품 리스트 불러오기
const setUserSV = ()=>{
    const body = {
        session: sessionStorage.getItem('user_id')
    };
    return function(dispatch) {
        // instance.get(`${API_URL}/producsts`)
        axios.post(`${API_URL}/user_inform/onLoginData`,body,{
            withCredentials:true
        })
        .then(res=>{
            console.log(res);
            dispatch(setUser(res.data));
        })
        .catch(err=> console.log(err));
    }
}


export default handleActions (
    {
        [SET_USER]: (state, action) =>
        produce(state, (draft)=>{
            draft.user = action.payload.user;
        })

    },
    initialState
);

const actionCreators = {
    setUserSV,
}

export { actionCreators };
