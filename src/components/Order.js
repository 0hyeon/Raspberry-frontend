import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/Login.css";
import { useHistory } from 'react-router-dom';
import {API_URL} from '../config/constants'
import "../css/CartPage.css";
const Order = () => {
    const history = useHistory();
    const [isLogin, setIsLogin] = useState(false)
    
    const [inputordernum, setinputordernum] = useState('')//비회원일경우 조회
    const [inputPhone, setInputPhone] = useState('')
    const handleInputordernum = (e) => {
        setinputordernum(e.target.value)
    }
    const handleInputPhone = (e) => {
        setInputPhone(e.target.value)
    }

    useEffect( () => {//로그인 여부 판별
        if(sessionStorage.getItem('user_id') == null){
            setIsLogin(false)
        } else {
            setIsLogin(true)
        }
    },[])

    const onClickOrderCheck = () => {//비회원 주문조회
        console.log('click orderCheck')
        console.log('inputordernum : ', inputordernum)// input 값 반영
        console.log('inputPhone : ', inputPhone)// input 값 반영2
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
            console.log(error);
        });
    }
    return (
        <div style={{paddingTop:"100px"}}>
            {isLogin 
            ? 
            <div className="CartPage_Wrapper">
            
            {/* 카트개수 */}
            <div className="CartPage_HeadLine">Order </div>
            {/* 카트리스트 */}
                <div id="">
                    <table id="sod_list" className="table">
                        <thead>
                            <tr className="sod_list_head">
                                <th scope="col" width="*" className="text_left">상품명</th>
                                <th scope="col" width="15%">가격</th>
                                <th scope="col" width="25%">배송비</th>
                                <th scope="col" width="10%">삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                        {/* {CartList.cartItem && CartList.cartItem.map(function (product) { */}
                            {/* return ( */}
                                {/* <tr key={product.id}>
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
                                        <span className="thumb_text">{product.it_name}</span>
                                        <span className="thumb_text_Detail">{product.it_Detail_color}/{product.it_Detail_size}</span>
                                    </Link>
                                    </div>
                                </td>
                                
                                <td>0원</td>
                                <td>2500원
                                    100,000이상 
                                </td>
                                <td className="remove_box_wrapper" >
                                    <div id={product.id} className="DeleteButton"  onClick={ Delete_Handelr }>삭제</div>
                                </td>
                                </tr> */}
                            {/* ) */}
                        {/* })} */}
                        </tbody>
                    </table>
                    {/* {CartList.cartItem == 0 ? <div className="Cart_empty">장바구니가 비었습니다.</div> : null} */}
                </div>
            </div>
            :
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
