// import { response } from "express";
import { LOGGEDIN} from "../_actions/types";



export const initialState = {
  logged: [],
};


export const idReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGGEDIN:
      return { ...state, logged: payload };
    
    default:
      return { ...state};
  }
};