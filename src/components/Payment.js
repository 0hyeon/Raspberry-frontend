import React, { useEffect } from 'react';
import {  useDispatch,connect,useSelector } from 'react-redux';
import axios from "axios";
import {API_URL} from "../config/constants";
import { useHistory } from "react-router-dom";
import { actionCreators as OrderResult } from "../_modules/orderresult";
import jwt_decode from "jwt-decode";
const Payment = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();//리액트훅
    let {userName,userAddress,userAddressdetail,userPhone,userEmail,userMemo,name,size,color,price,product_option_id,ProductStock,ProductOrderNum,ispayMethod,product_it_id} = props
    let userState = useSelector(state => state.user.user);
    let setAddressState = useSelector(state => state.setaddress.setaddress);

    let Session = sessionStorage.getItem('user_id');

    

    useEffect(() => {
        
        const jquery = document.createElement("script");
        jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
        const iamport = document.createElement("script");
        iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
        document.head.appendChild(jquery);
        document.head.appendChild(iamport);
        
        return () => {
            document.head.removeChild(jquery);
            document.head.removeChild(iamport);
        }
        
    }, []);
    const onClickPayment = () => {
        
        
        const { IMP } = window;
        IMP.init('imp31132542'); // 가맹점 식별코드
        // IMP.init('iamport'); // 가맹점 식별코드
        
        //배송비
        // 결제 데이터 정의
        const data = {
            // pg: 'nice',     // PG사 (필수항목)
            pg: 'html5_inicis',     // PG사 (필수항목)
            pay_method: ispayMethod,     // 결제수단 (필수항목)
            merchant_uid: `mid_${new Date().getTime()}`,  // 결제금액 (필수항목) ? 주문번호같음
            name: name,     // 주문명 (필수항목)
            amount: price ,// 금액 (필수항목)
            custom_data: {
                name:product_option_id
            },
            buyer_name: userName,       // 구매자 이름
            buyer_tel: userPhone,   // 구매자 전화번호 (필수항목)
            buyer_email: userEmail, // 구매자 이메일
            buyer_addr: `${userAddress} / ${userAddressdetail}`,//구매자주소
            buyer_postalcode: setAddressState.zonecode,//우편주소
            m_redirect_url:'https://test.rasberry-berry.com/v1/order/mobile'
        };
        console.log("data",data);

        

        axios.post(`${API_URL}/v1/order/payment`,{//1차적으로 db에추가
            od_id : data.merchant_uid, //거래번호 
            mb_id: Session ? jwt_decode(Session).user_id : null,//사용자 id
            product_it_id:product_it_id,
            product_option_id:product_option_id,//구매한 상품옵션
            name:data.name,//상품명
            size:size,//사이즈
            color:color,//컬러
            ordernum:ProductOrderNum,//주문수량
            stock:ProductStock,//남은재고
            od_name:data.buyer_name,//배송받을 이름
            od_email:data.buyer_email,//이메일
            od_tel: data.buyer_tel,//핸드폰번호
            od_zip: data.buyer_postalcode,//우편번호 5자리
            od_addr1:data.buyer_addr,//주소
            od_addr2:userAddressdetail,//상세주소
            od_memo:userMemo,//메모
            od_cart_price: data.amount,//주문금액
            od_send_cost:100,//배송비
            od_bank_account:null,
            od_receipt_time:null,//승인시간
            od_status:"결제대기",//거래상태 (결제대기 , 결제완료, 배송준비, 배송중, 배송완료 )
            od_hope_data:null,//무통장 희망입금일 
            od_settle_case:data.pay_method,//결제수단
            od_tno:null,//거래번호
        }).then((result) =>{
            dispatch(OrderResult.setOrderResultSV(data.merchant_uid,data.name,data.amount,color,size,data.buyer_tel,data.buyer_addr,userMemo,ProductOrderNum));
            console.log(result);
            // alert("결제완료");

        }).catch((error) => {
            console.log(error);
            alert("결제실패");
        });
        
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
        if(isMobile){
            console.log('data.m_redirect_url : ',data.m_redirect_url);
            IMP.request_pay(data.m_redirect_url, /* callback */); // callback은 실행 안됨
        }else{
            IMP.request_pay(data, callback);
        }


    }

    const callback= async (response) => {
        const {success, error_msg, imp_uid, merchant_uid, pay_method, paid_amount, status} = response;
        if (success) {
            console.log('success',success);//true
            console.log('error_msg',error_msg);//undefined
            console.log('imp_uid',imp_uid);//imp_706532230697
            console.log(' merchant_uid', merchant_uid);//mid_1641085530461
            console.log(' pay_method', pay_method);//point
            console.log(' paid_amount', paid_amount);//1000
            console.log(' status', status);//paid
            //서버로 전송

            //결제완료 업데이트 
            //수량 -1 ,결제완료, 거래번호(imp_uid)업데이트
            axios.post(`${API_URL}/v1/order/paymentUpdate`,{//결제완료후 2차 db업데이트 
                od_id : merchant_uid, //거래번호 
                od_status:"결제완료",//거래상태 (결제대기 , 결제완료, 배송준비, 배송중, 배송완료 )
                od_tno:imp_uid//거래번호

                //상품이름,컬러,사이즈 req (-1해줄용도)
                // name:name,
                // colorType:colorType,
                // size1:size1
            }).then((result) =>{
                // console.log(result);
                alert("결제완료");
                history.push("/OrderResult");
            }).catch((error) => {
                console.log(error);
                alert("결제실패");
            });
            
        } else {
            alert(`결제 실패 : ${error_msg}`);
        }
    }
    return (
        <>
            <button type="button" id="purchase-button" className='mt30' onClick={onClickPayment}>결제하기</button>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        allProducts: state.allProducts
    }
}
export default connect(mapStateToProps)(Payment);