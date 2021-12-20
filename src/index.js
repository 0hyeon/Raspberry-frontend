import React from 'react';
import { hydrate, render } from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter,HashRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from "./_store/store"
import ScrollToTop from './components/ScrollRestoration';

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  hydrate(<Provider store={ store }>
    {/* <React.StrictMode> */}
      <HashRouter>
      <ScrollToTop />
        <App />
      </HashRouter>
    {/* </React.StrictMode> */}
  </Provider>, rootElement);
} else {
  render(<Provider store={ store }>
    {/* <React.StrictMode> */}
      <HashRouter>
      <ScrollToTop />
        <App />
      </HashRouter>
    {/* </React.StrictMode> */}
  </Provider>, rootElement);
}

// ReactDOM.render(
//   <Provider store={ store }>
//     {/* <React.StrictMode> */}
//       <BrowserRouter>
//       <ScrollToTop />
//         <App />
//       </BrowserRouter>
//     {/* </React.StrictMode> */}
//   </Provider>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
