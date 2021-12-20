
import { createStore, applyMiddleware } from 'redux';
import reducers from "../_reducers/index";
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';

const store = createStore(
  reducers,
  {},
  composeWithDevTools(applyMiddleware(ReduxThunk, logger))
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
