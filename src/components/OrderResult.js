import React,{ useState , useEffect} from 'react'
import { useSelector } from 'react-redux';
import "../css/OrderResult.css";
import { history } from "../_reducers/index";
import axios from 'axios';
import {API_URL} from '../config/constants'
const OrderResult = () => {
    let userOrderResult = useSelector(state => state.orderresult.orderresult);
    
    const [data,setData] = useState(null);
    const [loading, setLoading] = useState(true);
    let Session = sessionStorage.getItem('user_id');
    const fetchOrderDisplay = async (id) => {
            console.log("fetchOrderDisplay(userOrderResult.id) :",id);
            let body = {
                od_id : id
            }
              await axios
                .post(`${API_URL}/v1/order/displayOrderDetail`, body)
                .then(function(res){
                  console.log("displayOrderDetail : ",res.data.result);
                  setData(res.data.result);
                  setLoading(false);
                })
                .catch((err) => {
                    console.log("Err: ", err);
                });
            //세션 id랑 글썼던 id랑 같을경우만 계속 
   
    }
    function Unix_timestamp(t){
        var date = new Date(t*1000);
        var year = date.getFullYear();
        var month = "0" + (date.getMonth()+1);
        var day = "0" + date.getDate();
        var hour = "0" + date.getHours();
        var minute = "0" + date.getMinutes();
        var second = "0" + date.getSeconds();
        return year + "-" + month.substr(-2) + "-" + day.substr(-2) + " " + hour.substr(-2) + ":" + minute.substr(-2) + ":" + second.substr(-2);
    }
    useEffect(() => {
        
        fetchOrderDisplay(userOrderResult.id);

    },[])

    if(data === null){
        return <div>Loading...</div>
    }

    return (
        <div className='orderResult'>
            {loading === false ? 
                <>
                    <strong>주문내역 : </strong>
                    <p className="Order_success_title">주문이 성공적으로 완료되었습니다. (상단메뉴 Order 에서 확인가능합니다. )</p>
                    <p>(라즈베리베리를 이용해주셔서 감사합니다.)</p>
                    <br /> 
                    <div className='detail_result'>
                        <div><span>주문번호</span> : {data.od_id} {Session ? null  : <span style={{color: 'darkmagenta'}}></span>} </div>
                        <div><span>주문제품</span> : {data.name}</div>
                        <div><span>가격</span> : {data.od_cart_price}원</div>
                        {data.od_settle_case === 'vbank' ? 
                        <>
                            <div><span>가상계좌번호</span> : {data.vbank_num}</div>
                            <div><span>입금은행</span> : {data.vbank_name}</div>
                            <div><span>입금기한</span> : {Unix_timestamp(data.vbank_date)}</div>
                        </>
                        : null}
                        <div><span>주문수량</span> : {data.ordernum}</div>
                        <div><span>컬러</span> : {data.color}</div>
                        <div><span>사이즈</span> : {data.size}</div>
                        <div><span>핸드폰번호</span> : {data.od_tel}</div>
                        <div><span>주소</span> : {data.od_addr1}</div>
                        <div><span>고객메모</span> : {data.od_memo}</div>
                    </div>
                    <p>배송지 변경은 상단 Order에서 확인가능합니다.</p>
                </>
            : null}
        </div>
    )
}

export default OrderResult
