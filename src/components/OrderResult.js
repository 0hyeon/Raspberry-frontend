import React,{ useState , useEffect} from 'react'
import { useSelector } from 'react-redux';
import "../css/OrderResult.css";
import { history } from "../_reducers/index";
const OrderResult = () => {
    let userOrderResult = useSelector(state => state.orderresult.orderresult);
    
    // useEffect(() => {
    //     history.push("/");
    // },[])
    return (
        <div className='orderResult'>
            <strong>주문내역 : </strong>
            {/* db shop_order요청해서 결제완료, 주소, 이름,전하번호,배송상태 가져온다   */}
            <p className="Order_success_title">주문이 성공적으로 완료되었습니다. (상단메뉴 Order 에서 확인가능합니다. )</p>
            <p>(라즈베리베리를 이용해주셔서 감사합니다.)</p>
            <br /> 
            <div className='detail_result'>
                <div><span>주문번호</span> : {userOrderResult.id}</div>
                <div><span>주문제품</span> : {userOrderResult.name}</div>
                <div><span>가격</span> : {userOrderResult.price}</div>
                <div><span>주문수량</span> : {userOrderResult.orderquantity}</div>
                <div><span>컬러</span> : {userOrderResult.color}</div>
                <div><span>사이즈</span> : {userOrderResult.size}</div>
                <div><span>핸드폰번호</span> : {userOrderResult.phone}</div>
                <div><span>주소</span> : {userOrderResult.address}</div>
                <div><span>고객메모</span> : {userOrderResult.memo}</div>
            </div>
            <p>배송지 변경은 상단 Order에서 확인가능합니다.</p>
        </div>
    )
}

export default OrderResult
