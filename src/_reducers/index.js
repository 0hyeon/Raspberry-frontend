import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { productsReducer } from "./userReducer";
import { idReducer } from "./idReducer";
import product from "../_modules/product"
import user from "../_modules/user";
import setaddress from "../_modules/setaddress";
import productoptions from "../_modules/productoptions";
import productoptionDetails from "../_modules/productoptionDetails";
import orderresult from "../_modules/orderresult";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

export const history = createBrowserHistory();

const rootReducer = combineReducers({
  // user,
  allProducts: productsReducer,
  userLogged:idReducer,
  products: product,
  user:user,
  setaddress:setaddress,
  productoptions:productoptions,
  productoptionDetails:productoptionDetails,
  orderresult:orderresult,
  router: connectRouter(history),
});

const middlewares = [thunk.withExtraArgument({history: history})];
// 지금이 어느 환경인 지 알려줘요. (개발환경, 프로덕션(배포)환경 ...)
const env = process.env.NODE_ENV;

// 개발환경에서는 로거라는 걸 하나만 더 써볼게요.
if (env === "development") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;


const enhancer = composeEnhancers(
  applyMiddleware(...middlewares)
);


let store = (initialStore) => createStore(rootReducer, enhancer);

export default store();