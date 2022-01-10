import React,{ useState , useEffect} from 'react'
import { useSelector } from 'react-redux';
import "../css/OrderResult.css";
import { history } from "../_reducers/index";
const OrderResult = () => {
    let userOrderResult = useSelector(state => state.orderresult.orderresult);
    
    useEffect(() => {
        history.push("/");
    },[])
    return (
        <div className='orderResult'>
            <strong>주문내역 : </strong>
            {/* db shop_order요청해서 결제완료, 주소, 이름,전하번호,배송상태 가져온다   */}
            <p style={{color:"darkblue" ,lineHeight:"2"}}>주문이 성공적으로 완료되었습니다. (상단메뉴 Order 에서 확인가능합니다. )</p>
            <p>라즈베리베리를 이용해주셔서 감사합니다.</p>
            <br /> 
            <div>주문번호 : {userOrderResult.id}</div>
            <div>주문제품 : {userOrderResult.name}</div>
            <div>가격 : {userOrderResult.price}</div>
            <div>주문수량 : {userOrderResult.orderquantity}</div>
            <div>컬러 : {userOrderResult.color}</div>
            <div>사이즈 : {userOrderResult.size}</div>
            <div>핸드폰번호 : {userOrderResult.phone}</div>
            <div>주소 : {userOrderResult.address}</div>
            <div>고객메모 : {userOrderResult.memo}</div>
        </div>
    )
}

export default OrderResult
