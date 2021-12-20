import { combineReducers } from "redux";
import { productsReducer } from "./userReducer";
import { idReducer } from "./idReducer";

const rootReducer = combineReducers({
  // user,
  allProducts: productsReducer,
  userLogged:idReducer
});

export default rootReducer;