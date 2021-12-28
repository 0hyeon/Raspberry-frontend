import React, { useEffect, useState } from 'react';
import "./App.css";
// import Login from './components/Login';
import Main from './components/Main';
// import Registration from './components/Register';
// import Admin from './components/Admin';
import Banners from './components/Banners';
import Navbar from "./components/Navbar";
// import PassWordEmail from "./components/PassWordEmail";
// import ProductPage from "./components/Products";
// import AdminLogin from "./components/AdminLogin";
// import AdminPage from "./components/AdminPage";
// import ProductsUpdate from "./components/ProductsUpdate";
// import CartPage from "./components/CartPage";
import { Button,Divider } from "antd";
import { DownloadOutlined,CaretRightOutlined,PauseCircleOutlined} from "@ant-design/icons";
import 'antd-mobile/dist/antd-mobile.css';
import { Switch, Route, Link, useHistory,withRouter } from "react-router-dom";

import loadable from '@loadable/component'
import { ConnectedRouter } from "connected-react-router";
import { history } from "./_reducers/index";
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
// const SearchCopmonent = loadable(() => import('./components/search/SearchCopmonent'))
function App () {
  // const history = useHistory();
 // 로그인 상태 관리
  const [isLogin, setIsLogin] = useState(false)
  const [isAdmin, setAdmin] = useState(false)
 
  const [scrollFlag, setScrollFlag] = useState(false); 
  const [bgstart,setbgstart ] = useState(true); 
  const [issession,setsession ] = useState(null); 
  
  
  let Session = console.log( sessionStorage.getItem('user_id') );
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
      if(sessionStorage.getItem('user_id') == 'admin'){//관리자계정일시 
        console.log('isAdmin ?? :: ', isAdmin)
        setAdmin(true)
      }else{
        console.log('isAdmin ?? :: ', isAdmin)
      }
    }
   
    let headerStyle = document.getElementsByClassName("menuBar")[0];
    let headerStyle2 = document.getElementById("Logo_style");
    if(scrollFlag){
      // headerStyle.style.backgroundColor = "inherit";
      headerStyle.style.position = "fixed";
      headerStyle.style.color = "#000";
      headerStyle.style.transition = "all 1s linears 0s";
      headerStyle2.style.display = "none";
      headerStyle.style.backgroundColor = "inherit";
      headerStyle.style.top = "0";
      headerStyle.style.transition = "0.5s";
      
    }else{
      // headerStyle.style.backgroundColor = "#000";
      headerStyle.style.color = "#fff";
      headerStyle.style.position = "fixed";
      headerStyle2.style.display = "block";
      headerStyle2.style.top = "0";

      if(window.innerWidth > 767){
        headerStyle.style.backgroundColor = "rgb(0, 0, 0,0.7)";
      }else{
        headerStyle.style.backgroundColor = "#fff";
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
              {/* 관리자계정일시 */}
              {isAdmin ? 
                <Button
                  size="large"
                  onClick={function () {
                    history.push("/Admin");
                  }}
                  icon={<DownloadOutlined />}
                >
                  상품 업로드
                </Button> : null
              }
              <Divider />
              {isAdmin ? 
                // Main 컴포넌트 호출 시 isLogin 이라는 props 값을 전달
                
                <Button
                  size="large"
                  onClick={function () {
                    history.push("/Banners");
                  }}
                  icon={<DownloadOutlined />}
                >
                  메인배너 업로드
                </Button> 
                : 
                null
              }
              
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
            {/* <Route exact path="/SearchCopmonent/:word" component={SearchCopmonent}></Route> */}
          </Switch>
        </div>
      </ConnectedRouter>
    </React.Fragment>
  )
}
 
export default withRouter(App);