import React, { useEffect, useState } from 'react';
import "./App.css";
// import Login from './components/Login';
//import Main from './components/Main';

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

// const ProductPage = loadable(() => import('./components/Products'))
import ProductPage from './components/Products';
// const CartPage = loadable(() => import('./components/CartPage'))
import CartPage from './components/CartPage';
// const Login = loadable(() => import('./components/Login'))
import Login from './components/Login';
// const PassWordEmail = loadable(() => import('./components/PassWordEmail'))
import PassWordEmail from './components/PassWordEmail';
// const Registration = loadable(() => import('./components/Register'))
import Registration from './components/Register';
// const AdminPage = loadable(() => import('./components/AdminPage'))
import AdminPage from './components/AdminPage';
// const AdminLogin = loadable(() => import('./components/AdminLogin'))
import AdminLogin from './components/AdminLogin';
// const Admin = loadable(() => import('./components/Admin'))
import Admin from './components/Admin';
// const ProductsUpdate = loadable(() => import('./components/ProductsUpdate'))
import ProductsUpdate from './components/ProductsUpdate';
// const Search = loadable(() => import('./components/Search'))
import Search from './components/Search';
// const OrderPage = loadable(() => import('./components/OrderPage'))
import OrderPage from './components/OrderPage';
// const OrderPageMulti = loadable(() => import('./components/OrderPageMulti'))
import OrderPageMulti from './components/OrderPageMulti';
// const OrderResult = loadable(() => import('./components/OrderResult'))
import OrderResult from './components/OrderResult';
// const Order = loadable(() => import('./components/Order'))
import Order from './components/Order';
// const NewPage = loadable(() => import('./components/NewPage'))
import NewPage from './components/NewPage';
import DressesSkirts from './components/DressesSkirts';
import Tops from './components/Tops';
import Bottoms from './components/Bottoms';
import OuterWear from './components/OuterWear';
// const Qna = loadable(() => import('./components/Qna'))
import Qna from './components/Qna';
import ReviewList from './components/ReviewList';
// const QnaWrite = loadable(() => import('./components/QnaWrite'))
import QnaWrite from './components/QnaWrite';
import ReviewWrite from './components/ReviewWrite';
// const QnaDescription = loadable(() => import('./components/QnaDescription'))
import QnaDescription from './components/QnaDescription';
// const QnaUpdate = loadable(() => import('./components/QnaUpdate'))
import QnaUpdate from './components/QnaUpdate';
// const Footer = loadable(() => import('./components/Footer'))
import Footer from './components/Footer';
// const OrderWait = loadable(() => import('./components/OrderWait'))
import OrderWait from './components/OrderWait';
// const OrderSuccess = loadable(() => import('./components/OrderSuccess'))
import OrderSuccess from './components/OrderSuccess';
// const AGREEMENT = loadable(() => import('./components/AGREEMENT'))
import AGREEMENT from './components/AGREEMENT';
// const PRIVACYPOLICY = loadable(() => import('./components/PRIVACYPOLICY'))
import PRIVACYPOLICY from './components/PRIVACYPOLICY';
// const OrderDelivery = loadable(() => import('./components/OrderDelivery'))
import OrderDelivery from './components/OrderDelivery';
// const OrderFnish = loadable(() => import('./components/OrderFnish'))
import OrderFnish from './components/OrderFnish';
// const AdminQnaComment = loadable(() => import('./components/AdminQnaComment'))
import AdminQnaComment from './components/AdminQnaComment';
// const QnaAnsAdmin = loadable(() => import('./components/QnaAnsAdmin'))
import QnaAnsAdmin from './components/QnaAnsAdmin';
// const AdminBanner = loadable(() => import('./components/AdminBanner'))
import AdminBanner from './components/AdminBanner';
// const AdminBannerList = loadable(() => import('./components/AdminBannerList'))
import AdminBannerList from './components/AdminBannerList';
// const SearchCopmonent = loadable(() => import('./components/search/SearchCopmonent'))
const Main = loadable(() => import('./components/Main'));
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
    //console.log(issession);
    if(sessionStorage.getItem('user_id') === null){
    // sessionStorage 에 user_id 라는 key 값으로 저장된 값이 없다면
      // console.log('isLogin ?? :: ', isLogin)
      setIsLogin(false)
    } else {
    // sessionStorage 에 user_id 라는 key 값으로 저장된 값이 있다면
    // 로그인 상태 변경
      setIsLogin(true)
      // console.log('isLogin ?? :: ', isLogin)
      
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
    // console.log(scrollFlag)
    
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
    // console.log(isScrolled);
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
            <Route exact={true} path="/OrderPage/:id">
              <OrderPage />
            </Route>
            <Route exact={true} path="/OrderPageMulti">
              <OrderPageMulti />
            </Route>
            <Route exact={true} path="/OrderResult">
              <OrderResult />
            </Route>
            <Route exact={true} path={["/Order","/ModifyAddress/:index"]}>
              <Order />
            </Route>
            <Route exact={true} path="/NewPage">
              <NewPage />
            </Route>
            <Route exact={true} path="/DressesSkirts">
              <DressesSkirts />
            </Route>
            <Route exact={true} path="/OuterWear">
              <OuterWear />
            </Route>
            <Route exact={true} path="/Tops">
              <Tops />
            </Route>
            <Route exact={true} path="/Bottoms">
              <Bottoms />
            </Route>
            <Route exact={true} path="/Qna">
              <Qna />
            </Route>
            <Route exact={true} path="/Qna/:id">
              <QnaDescription />
            </Route>
            <Route exact={true} path="/QnaAnsAdmin/:id">
              <QnaAnsAdmin />
            </Route>
            <Route exact={true} path="/QnaWrite">
              <QnaWrite />
            </Route>
            <Route exact={true} path="/QnaWrite/:id">
              <QnaWrite />
            </Route>
            <Route exact={true} path="/ReviewList">
              <ReviewList />
            </Route>
            <Route exact={true} path="/ReviewWrite">
              <ReviewWrite />
            </Route>
            <Route exact={true} path="/ReviewWrite/:id">
              <ReviewWrite />
            </Route>
            <Route exact={true} path="/QnaUpdate/:id">
              <QnaUpdate />
            </Route>
            <Route exact={true} path="/OrderWait">
              <OrderWait />
            </Route>
            <Route exact={true} path={["/OrderSuccess","/updateOrderStatus/:index"]}>
              <OrderSuccess />
            </Route>
            <Route exact={true} path={["/OrderDelivery","/updateSongJang/:index"]}>
              <OrderDelivery />
            </Route>
            <Route exact={true} path={["/OrderFnish","/updateOrderStatus2/:index"]}>
              <OrderFnish />
            </Route>
            <Route exact={true} path="/AdminQnaComment">
              <AdminQnaComment />
            </Route>
            <Route exact={true} path="/AGREEMENT">
              <AGREEMENT />
            </Route>
            <Route exact={true} path="/PRIVACYPOLICY">
              <PRIVACYPOLICY />
            </Route>
            <Route exact={true} path="/AdminBanner">
              <AdminBanner />
            </Route>
            <Route exact={true} path="/AdminBannerList">
              <AdminBannerList />
            </Route>
            {/* <Route exact path="/SearchCopmonent/:word" component={SearchCopmonent}></Route> */}
          </Switch>
          <Footer /> 
        </div>
      </ConnectedRouter>
    </React.Fragment>
  )
}
 
export default withRouter(App);