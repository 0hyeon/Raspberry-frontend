import React, { useEffect, useState } from 'react';
import Logout from '../components/Logout';
import { Menu, Grid } from 'antd';
import { BrowserRouter as Router, Route, Switch, Link,useHistory } from 
"react-router-dom";
import { ShoppingCartOutlined, SearchOutlined } from "@ant-design/icons";
// import BGM from '../pogo.mp3';
// import BGM from '../DOORAGS.mp3';
import BGM from '../only_thing_i_ever_get_for_christmas.mp3';
import ReactAudioPlayer from 'react-audio-player';
import axios from 'axios';
import {API_URL} from '../config/constants'
import { useDispatch, useSelector,connect } from "react-redux";
import {setCartItem,setRequestLoding2} from "../_actions/userAction";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const { useBreakpoint } = Grid;

const RightMenu = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const user = useSelector(state => state.allProducts)
  const { md } = useBreakpoint();
  const loginState = useSelector(state => state.userLogged.logged)
  const [isLogin, setIsLogin] = useState(false)
  const [isAdmin, setAdmin] = useState(false)

  let Session = sessionStorage.getItem('user_id');
  const fetchCartItem = async () => {
    let body = {
      seSsionId: Session
      // heyt: session_redux
    }
    // dispatch(setRequestLoding())//loding true로 장바구니 랜더링
    await axios
      .post(`${API_URL}/v1/cart/setCartItem`, body)
      .then(function(result){
        // const products = result.data.products;
        // setProducts(products);
        // dispatch(setRequestLoding())//loding true로 장바구니 랜더링
        dispatch(setCartItem(result.data));
        // dispatch(setRequestLoding())//loding true로 장바구니 랜더링
        // console.log(result.data);
        // console.log(result.data.cartItem);
        // console.log('state : ',state);
    })
    .catch((err) => {
        console.log("Err: ", err);
        dispatch(setRequestLoding2())//loding true로 장바구니 랜더링
    });
    
    // dispatch(setProducts(result.data));
};
  if(user.cartItem == undefined){
    // fetchCartItem();
  }
  
  useEffect( () => {
    if(sessionStorage.getItem('user_id') == null){
    // sessionStorage 에 user_id 라는 key 값으로 저장된 값이 없다면
      // console.log('isLogin ?? :: ', isLogin)
      setIsLogin(false)
    } else {
    // sessionStorage 에 user_id 라는 key 값으로 저장된 값이 있다면
    // 로그인 상태 변경
      setIsLogin(true)
      // console.log('isLogin ?? :: ', isLogin)
      if(sessionStorage.getItem('user_id') == 'admin'){//관리자계정일시 
        // console.log('isAdmin ?? :: ', isAdmin)
        setAdmin(true)
      }else{
        // console.log('isAdmin ?? :: ', isAdmin)
      }
    }
    
  },[state])


  if(user.cartItem == undefined ){// 0개일때 
    return (
      
      <Menu mode={md ? "horizontal" : "inline"}>
        <Menu.Item key="mail">
          {/* <Link to="/login"> Login</Link> */}
          
          {isLogin ? <Logout /> : <Link to="/login">Login</Link>}
          
        </Menu.Item>
        <Menu.Item key="app">
          {isLogin ? null : <Link to="/registration">Registration</Link>}
          
        </Menu.Item>
        <Menu.Item key="app2">
          <Link to="/Search">Search</Link>
        </Menu.Item>
        <Menu.Item key="cart">
          {isLogin ? <ShoppingCartOutlined /> : null}
          {/* {isLogin ? <cartCount /> : null}
          <cartCount /> */}
          {isLogin ? <div className="cartCount">
          0
          </div> : null}
        </Menu.Item>
        <Menu.Item key="order">
          <Link to="/order">Order</Link>
        </Menu.Item>
      </Menu>

          
      
    );
  }else{
      return (
        <Menu mode={md ? "horizontal" : "inline"}>
          
          <Menu.Item key="mail">
            {/* <Link to="/login"> Login</Link> */}
            
            {isLogin ? <Logout /> : <Link to="/login">Login</Link>}
            
          </Menu.Item>
          <Menu.Item key="app">
            {isLogin ? null : <Link to="/registration">Registration</Link>}
            
          </Menu.Item>
          <Menu.Item key="app2">
            <Link to="/Search">Search</Link>
          </Menu.Item>
          <Menu.Item key="order">
              <Link to="/order">Order</Link>
            </Menu.Item>
          <Menu.Item key="cart">
            <Link to="/CartPage" className="cartCount_in_a">
            {isLogin ? <ShoppingCartOutlined /> : null}
            {/* {isLogin ? <cartCount /> : null}
            <cartCount /> */}
            {isLogin ? <div className="cartCount">
            {user.cartItem.length}
            </div> : null}
            </Link>
            
            <ReactAudioPlayer
              src={BGM}
              loop
              controls
              // autoPlay
            />
          </Menu.Item>
        </Menu>
      );
    }
  }
  // if (user.cartItem) {
  //   return {
      
  //   }
  // }else{

  // }
const mapStateToProps = (state) => {
  return {
    userLogged: state.userLogged
  }
}

export default connect(mapStateToProps)(RightMenu);