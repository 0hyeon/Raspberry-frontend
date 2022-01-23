import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/Login.css";
import { useHistory, Link } from 'react-router-dom';
import {API_URL} from '../config/constants'
import "../css/CartPage.css";
import { useSelector } from "react-redux";
const Order = () => {
    const history = useHistory();
    const Userstate = useSelector((state) => state.user.user);
    const [isLogin, setIsLogin] = useState(false)
    const [loading, setLoading] = useState(true);

    const [isshopOrder, setshopOrder] = useState(null);
    

    const [inputordernum, setinputordernum] = useState('')//비회원일경우 조회
    const [inputPhone, setInputPhone] = useState('')
    const handleInputordernum = (e) => {
        setinputordernum(e.target.value)
    }
    const handleInputPhone = (e) => {
        setInputPhone(e.target.value)
    }

    //shop_order테이블에 주문내역 axios post로 data 전송
    const getOrderResult = async () => {
        let body = {
            mb_id: Userstate.user_id
            // heyt: session_redux
        }
        await axios
        .post(`${API_URL}/v1/order/getOrderResult`, body)
        .then(function(result){
            console.log("v1/order/getOrderResult",result.data.result);
            setshopOrder(result.data.result);    
            setLoading(false);
        })
        .catch((err) => {
            console.log("Err: ", err);
            
        });
    };
    const Delete_Handelr2 = async(e) => {
        
        let deleteId = e.target.id;
        let body = {
            id: deleteId
        }
        console.log("deleteId",deleteId);
        await axios
        .post(`${API_URL}/v1/order/deleteToCart2`, body)
        .then(function(result){
            console.log(result.data);
        })
        .catch((err) => {
            console.log("Err: ", err);
        });
        getOrderResult();
    }

    useEffect( () => {//로그인 여부 판별
        if(sessionStorage.getItem('user_id') == null){
            setIsLogin(false)
        } else {
            getOrderResult();
            setIsLogin(true)
            // if(isshopOrder.length == 0 && ){// 로그인 되어있고, 아무것도없을때, 
            //     sessionStorage.removeItem('user_id')
            //     // alert("결제내역이 없습니다 오류시 재로그인 해주세요.")
            //     history.push("/");
            //     // document.location.href = '/'
            // } // 로그인인데 빈배열일경우 
        }
        // console.log("Userstate",Userstate);
    },[])

    const onClickOrderCheck = () => {//비회원 주문조회
        // console.log('click orderCheck')
        // console.log('inputordernum : ', inputordernum)// input 값 반영
        // console.log('inputPhone : ', inputPhone)// input 값 반영2
        const body = {
            merchant_uid: inputordernum, 
            od_tel: inputPhone
        };
        axios.post(`${API_URL}/v1/order/orderCheck`, body, {
            // 쿠키를 보내고 싶을때
            withCredentials:true
        })
        .then(res => {
            // console.log('res',res);
            // console.log('res.data',res.data);
            console.log(res.data.result[0]);
            const order = res.data.result[0]
            alert(
            `주문번호 : ${order.od_id},
            결제상태 : ${order.od_status}
            주문자명 : ${order.od_name}
            핸드폰번호 : ${order.od_tel}
            주소 : ${order.od_addr1}
            제품 : ${order.name}
            컬러 : ${order.color}
            사이즈 : ${order.size}`
            );
            // if(res.data.msg == '입력하신 id 가 존재하지 않습니다.'){
            //     alert('입력하신 id 가 존재하지 않습니다.');
            // }
        })
        .catch((error) => {
            alert("주문내역이 없는 주문번호입니다.")
            console.log(error);
        });
    }
    if(isshopOrder && isshopOrder.length == 0){
            sessionStorage.removeItem('user_id')
            alert("결제내역이 없습니다 오류시 재로그인 해주세요.")
            history.push("/");
    }
    console.log("isshopOrder",isshopOrder);
    return (
        <div style={{paddingTop:"100px"}}>
            {isLogin //로그인상태면 
            ? 

                loading ? (//페치아직 안받아오면 
                    <h1>Loading...</h1>
                ) : ( //페치 받아오면 View
                    <div className="CartPage_Wrapper">
                    {/* 카트개수 */}
                    <div className="CartPage_HeadLine">Order ({ isshopOrder &&isshopOrder.length})</div>
                    {/* 카트리스트 */}
                        <div id="">
                            <table id="sod_list2" className="table">
                                <thead>
                                    <tr className="sod_list_head">
                                        <th scope="col" width="15%" className="text_left">주문번호</th>
                                        <th scope="col" width="15%" className="text_left">상품명</th>
                                        <th scope="col" width="15%">가격(배송비포함)</th>
                                        <th scope="col" width="*">배송정보</th>
                                        <th scope="col" width="15%">결제상태</th>
                                        <th scope="col" width="10%">삭제</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {isshopOrder && isshopOrder.map(function (product) {
                                    return(
                                        <tr key={product.id}>
                                            <td>{product.od_id}</td>
                                            <td className="first_td">
                                                <div>
                                                <Link
                                                    style={{ color: "inherit" }}
                                                    className="product-link2"
                                                    to={`/products/${product.it_id}`}
                                                >
                                                    <img className="thumb_img" src={`${API_URL}/${product.thumb_name}`} alt="" />
                                                </Link>
                                                <Link
                                                    style={{ color: "inherit" }}
                                                    className="product-link2"
                                                    to={`/products/${product.it_id}`}
                                                >
                                                    <span className="thumb_text">{product.name}</span>
                                                    <span className="thumb_text_Detail">{product.size}/{product.color}/{product.ordernum}개</span>
                                                </Link>
                                                </div>
                                            </td>
                                            <td>{product.od_cart_price + product.od_send_cost }</td>
                                            <td>{product.od_addr1}/{product.od_name}/{product.od_tel}</td>
                                            <td>{product.od_status}</td>
                                            <td className="remove_box_wrapper" >
                                                <div id={product.id} className="DeleteButton" onClick={Delete_Handelr2} >삭제</div>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                            {/* {CartList.cartItem == 0 ? <div className="Cart_empty">장바구니가 비었습니다.</div> : null} */}
                        </div>
                    </div>
                )

            ://비회원일경우
            <div className='Login_wrpper'>
                <h2 className="LoginTop">비회원 주문조회</h2>
                <div className="inputWrapper">
                    <label htmlFor='input_orderNum'>주문번호 : </label>
                    <input id="input_orderNum" type='text' name='input_orderNum' placeholder="ex) mid_1641701250100" value={inputordernum} onChange={handleInputordernum} />
                </div>
                <div className="inputWrapper">
                    <label htmlFor='input_phoneNum'>핸드폰번호 : </label>
                    <input id="input_phoneNum" type='text' name='input_phoneNum' placeholder="(-) 없이입력해주세요" value={inputPhone} onChange={handleInputPhone} />
                </div>
                <div className='tacenter'>
                    <button id="LoginButton"type='button' onClick={onClickOrderCheck}>비회원 주문조회</button>
                </div>
                <div className='tacenter'>
                    <button id="PassWordGoing" onClick={function () {
                        history.push("/login");
                    }}>로그인 하러가기
                    </button>
                </div>
            </div>
            }
        </div>
    )
}

export default Order
