import React, { useEffect, useState } from 'react';
import Logout from '../components/Logout';
import { Menu, Grid } from 'antd';
import { BrowserRouter as Router, Route, Switch, Link,useHistory } from 
"react-router-dom";
import { ShoppingCartOutlined, SearchOutlined } from "@ant-design/icons";
// import BGM from '../pogo.mp3';
// import BGM from '../DOORAGS.mp3';
// import BGM from '../only_thing_i_ever_get_for_christmas.mp3';
import BGM from '../Zedd & Alessia Cara - Stay (UPLINK & MAGNÜS Remix) [Free Download].mp3';
import ReactAudioPlayer from 'react-audio-player';
import axios from 'axios';
import {API_URL} from '../config/constants'
import { useDispatch, useSelector,connect } from "react-redux";
import {setCartItem,setRequestLoding2} from "../_actions/userAction";
import jwt_decode from "jwt-decode";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const { useBreakpoint } = Grid;

const RightMenu2 = (props) => {
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
    if(Session){
        let decoded = jwt_decode(Session).user_id;
        let body = {
            seSsionId: decoded
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

    }

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
    return (
        <div style={{position:'absolute',bottom:'0',width:'100%'}}>
            <Menu mode={md ? "horizontal" : "inline"}>
                
                <Menu.Item key="mail">
                {/* <Link to="/login"> Login</Link> */}
                
                {isLogin ? <Logout /> : <Link className="RM_2a_link"to="/login" onClick={() => props.onClose()}>로그인</Link>}
                
                </Menu.Item>
                <Menu.Item key="app">
                {isLogin ? null : <Link className="RM_2a_link"to="/registration" onClick={() => props.onClose()}>회원가입</Link>}
                
                </Menu.Item>
                <Menu.Item key="app2">
                    <Link className="RM_2a_link" to="/Search" onClick={() => props.onClose()}>상품검색</Link>
                </Menu.Item>
                <Menu.Item key="order">
                    <Link className="RM_2a_link" to="/order" onClick={() => props.onClose()}>주문조회</Link>
                </Menu.Item>
                <Menu.Item key="cart">
                    <Link to="/CartPage" className="cartCount_in_a RM_2a_link" onClick={() => props.onClose()}>
                        {isLogin ? <ShoppingCartOutlined /> : <ShoppingCartOutlined />}
                        {/* {isLogin ? <cartCount /> : null}
                        <cartCount /> */}
                        {isLogin 
                            ? <div className="cartCount">{user.cartItem.length}</div> 
                            : <div className="cartCount">{user.cartItem.length}</div> 
                        }
                    </Link>
                </Menu.Item>
                <Menu.Item key="Bgm">
                    <ReactAudioPlayer
                        src={BGM}
                        loop
                        controls
                        // autoPlay
                    />
                </Menu.Item>
            </Menu>
        </div>
    );
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

export default connect(mapStateToProps)(RightMenu2);