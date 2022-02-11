import React, { useEffect, useState } from 'react';
import "./App.css";
// import Login from './components/Login';
import Main from './components/Main';
// import Registration from './components/Register';
// import Admin from './components/Admin';
import Banners from './components/Banners';
import Navbar from "./components/Navbar";
import 'antd-mobile/dist/antd-mobile.css';
import { Switch, Route,withRouter } from "react-router-dom";

import loadable from '@loadable/component'
import { ConnectedRouter } from "connected-react-router";
import { history } from "./_reducers/index";
import ReCAPTCHA from "react-google-recaptcha"
const ProductPage = loadable(() => import('./components/Products'))
const CartPage = loadable(() => import('./components/CartPage'))
const Login = loadable(() => import('./components/Login'))
const PassWordEmail = loadable(() => import('./components/PassWordEmail'))
const Registration = loadable(() => import('./components/Register'))
const AdminPage = loadable(() => import('./components/AdminPage'))
const AdminLogin = loadable(() => import('./components/AdminLogin'))
const Admin = loadable(() => import('./components/Admin'))
const ProductsUpdate = loadable(() => import('./components/ProductsUpdate'))
const Search = loadable(() => import('./components/Search'))
const OrderPage = loadable(() => import('./components/OrderPage'))
const OrderPageMulti = loadable(() => import('./components/OrderPageMulti'))
const OrderResult = loadable(() => import('./components/OrderResult'))
const Order = loadable(() => import('./components/Order'))
const NewPage = loadable(() => import('./components/NewPage'))
const DRESSESSKIRTS = loadable(() => import('./components/DRESSESSKIRTS'))
const Qna = loadable(() => import('./components/Qna'))
const QnaWrite = loadable(() => import('./components/QnaWrite'))
const QnaDescription = loadable(() => import('./components/QnaDescription'))
const QnaUpdate = loadable(() => import('./components/QnaUpdate'))
// const SearchCopmonent = loadable(() => import('./components/search/SearchCopmonent'))
function App () {
  // const history = useHistory();
 // 로그인 상태 관리
  const [isLogin, setIsLogin] = useState(false)
 
  const [scrollFlag, setScrollFlag] = useState(false); 
  const [bgstart,setbgstart ] = useState(true); 
  const [issession,setsession ] = useState(null); 
  
  
  let Session = sessionStorage.getItem('user_id');
  useEffect(() => {
    setsession(Session);
    console.log(issession);
    if(sessionStorage.getItem('user_id') === null){
    // sessionStorage 에 user_id 라는 key 값으로 저장된 값이 없다면
      console.log('isLogin ?? :: ', isLogin)
      setIsLogin(false)
    } else {
    // sessionStorage 에 user_id 라는 key 값으로 저장된 값이 있다면
    // 로그인 상태 변경
      setIsLogin(true)
      console.log('isLogin ?? :: ', isLogin)
      
    }
    let headerStyle = document.getElementsByClassName("menuBar")[0];
    let headerStyle2 = document.getElementById("Logo_style");
    if(scrollFlag){//밑으로 내릴때
      
      // headerStyle.style.backgroundColor = "inherit";
      headerStyle.style.position = "fixed";
      headerStyle.style.color = "#fff";
      headerStyle.style.transition = "all 1s linears 0s";
      // headerStyle2.style.display = "none";
      // headerStyle.style.backgroundColor = "inherit";
      headerStyle.style.top = "0";
      headerStyle.style.transition = "0.5s";
      // headerStyle2.style.backgroundColor = "inherit";
      
    }else{//올릴때 
      // headerStyle.style.backgroundColor = "#000";
      // headerStyle.style.color = "#fff";
      headerStyle.style.color = "#000";
      headerStyle.style.position = "fixed";
      headerStyle2.style.display = "block";
      headerStyle2.style.top = "0";
      // headerStyle.style.backgroundColor = "inherit";

      if(window.innerWidth > 767){
        // headerStyle.style.backgroundColor = "rgb(0, 0, 0,0.7)";
      }else{
        // headerStyle.style.backgroundColor = "#fff";
      }
    }

    window.addEventListener("scroll", handleScroll);
    console.log(scrollFlag)
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    
  },[scrollFlag]);
  
  const throttle = (callback,delay) => {
    let timer;
    return () => {
      if(timer) return;
      timer = setTimeout(()=>{
        callback();
        timer = null;
      },delay);
    };
  };

  const updateScroll = () => {
    const { scrollY } = window;
    const isScrolled = scrollY !== 0;
    setScrollFlag(isScrolled);
    console.log(isScrolled);
  };
  
  const handleScroll = throttle(updateScroll, 1000);
  
  //ReCAPTCHA 함수
  function onChange(value) {
    console.log('Captcha value:', value);
  }

  return (
    <React.Fragment>
      <ConnectedRouter history={history}>
          <div className="backGround_Image">
          <Navbar /> 
          {/* {bgstart ?<audio autoplay controls src="http://localhost:8000/uploads/leemoojin.mp3" type="audio/mp3" />:null} */}

          {/* 헤더영역 */}
          {/* <div id="header">
            <div id="header-area">
              <Link to="/">
                <img src="/images/raspberrylogo.png" alt="로고" id="Logo_style"/>
              </Link>
            </div>
          </div> */}
          <Switch>
            <Route exact={true} path="/">
              <Main />
              {/* <ReCAPTCHA
                sitekey="6LfEpUceAAAAAL1phNo3x8s8n7sXD0BeNvKZFyhX"
                // size="invisible"
                onChange={onChange}
              /> */}
            </Route>
            <Route exact={true} path="/Registration">
              <Registration />
            </Route>
            <Route exact={true} path="/Admin">
              <Admin />
            </Route>
            <Route exact={true} path="/Banners">
              <Banners />
            </Route>
            <Route exact={true} path="/PassWordEmail">
              <PassWordEmail />
            </Route>
            <Route exact={true} path="/Login">
              <Login />
            </Route>
            <Route exact={true} path="/Products/:id">
              <ProductPage name= { Session } />
            </Route>
            <Route exact={true} path="/CartPage">
              <CartPage name= { Session } />
            </Route>
            <Route exact={true} path="/AdminLogin">
              <AdminLogin />
            </Route>
            <Route exact={true} path="/AdminPage">
              <AdminPage />
            </Route>
            <Route exact={true} path="/ProductsUpdate/:id">
              <ProductsUpdate />
            </Route>
            <Route exact={true} path="/Search">
              <Search />
            </Route>
            <Route exact={true} path="/OrderPage">
              <OrderPage />
            </Route>
            <Route exact={true} path="/OrderPageMulti">
              <OrderPageMulti />
            </Route>
            <Route exact={true} path="/OrderResult">
              <OrderResult />
            </Route>
            <Route exact={true} path="/Order">
              <Order />
            </Route>
            <Route exact={true} path="/NewPage">
              <NewPage />
            </Route>
            <Route exact={true} path="/DRESSESSKIRTS">
              <DRESSESSKIRTS />
            </Route>
            <Route exact={true} path="/Qna">
              <Qna />
            </Route>
            <Route exact={true} path="/Qna/:id">
              <QnaDescription />
            </Route>
            <Route exact={true} path="/QnaWrite">
              <QnaWrite />
            </Route>
            <Route exact={true} path="/QnaWrite/:id">
              <QnaWrite />
            </Route>
            <Route exact={true} path="/QnaUpdate/:id">
              <QnaUpdate />
            </Route>
            {/* <Route exact path="/SearchCopmonent/:word" component={SearchCopmonent}></Route> */}
          </Switch>
        </div>
      </ConnectedRouter>
    </React.Fragment>
  )
}
 
export default withRouter(App);