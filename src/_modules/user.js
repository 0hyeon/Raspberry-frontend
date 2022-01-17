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
const setUserSV = ()=>{
    const body = {
        session: sessionStorage.getItem('user_id')
    };
    console.log('body.session',body.session);

    return function(dispatch) {
        // instance.get(`${API_URL}/producsts`)
        axios.post(`${API_URL}/v1/user_inform/onLoginData`,body,{
            withCredentials:true
        })
        .then(res=>{
            console.log("onLoginData && dispatch(setUser(res.data));",res.data);
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
        }),
    },
    initialState
);

const actionCreators = {
    setUserSV,
}

export { actionCreators };
