import React, { useEffect } from 'react';
import {  connect,useSelector } from 'react-redux';
import axios from "axios";
import {API_URL} from "../config/constants";
const Payment = (props) => {
    let {userName,userAddress,userPhone,userEmail,userMemo,name, price} = props
    let userState = useSelector(state => state.user.user);

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
        // IMP.init('imp31132542'); // 가맹점 식별코드
        IMP.init('iamport'); // 가맹점 식별코드
 
        // 결제 데이터 정의
        const data = {
            pg: 'nice',     // PG사 (필수항목)
            pay_method: 'card',     // 결제수단 (필수항목)
            merchant_uid: `mid_${new Date().getTime()}`,  // 결제금액 (필수항목) ? 주문번호같음
            name: name,     // 주문명 (필수항목)
            amount: price,         // 금액 (필수항목)
            custom_data: {
                name: '부가정보',
                desc: '세부 부가정보'
            },
            buyer_name: userName,       // 구매자 이름
            buyer_tel: userPhone,   // 구매자 전화번호 (필수항목)
            buyer_email: userEmail, // 구매자 이메일
            buyer_addr: userAddress,//구매자주소
            buyer_postalcode: '00001'//우편주소
        };

        
        axios.post(`${API_URL}/v1/order/payment`,{
            od_id : data.merchant_uid, //거래번호 
            mb_id: userState.user_id,//사용자 id
            od_name:data.buyer_name,//배송받을 이름
            od_email:data.buyer_email,//이메일
            od_tel: data.buyer_tel,//핸드폰번호
            od_zip: data.buyer_postalcode,//우편번호 5자리
            od_addr1:data.buyer_addr,//주소
            od_addr2:null,//상세주소
            od_momo:userMemo,//메모
            od_cart_price: data.amount,//주문금액
            od_send_cost:3000,//배송비
            od_bank_account:null,
            od_receipt_time:null,//승인시간
            od_status:"결제대기",//거래상태 (결제대기 , 결제완료, 배송준비, 배송중, 배송완료 )
            od_hope_data:null,//무통장 희망입금일 
            od_settle_case:data.pay_method,//결제수단
            od_tno:null//거래번호
        }).then((result) =>{
            console.log(result);
            // alert("결제완료");
        }).catch((error) => {
            console.log(error);
            alert("결제실패!!");
        });
        IMP.request_pay(data, callback);


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


            // axios.post(`${API_URL}/v1/order/payment`,{
            //     od_id : data.merchant_uid, //거래번호 
            //     mb_id: userState.user_id,//사용자 id
            //     od_name:data.buyer_name,//배송받을 이름
            //     od_email:data.buyer_email,//이메일
            //     od_tel: data.buyer_tel,//핸드폰번호
            //     od_zip: data.buyer_postalcode,//우편번호 5자리
            //     od_addr1:data.buyer_addr,//주소
            //     od_addr2:null,//상세주소
            //     od_momo:userMemo,//메모
            //     od_cart_price: data.amount,//주문금액
            //     od_send_cost:3000,//배송비
            //     od_bank_account:null,
            //     od_receipt_time:null,//승인시간
            //     od_status:"결제대기",//거래상태 (결제대기 , 결제완료, 배송준비, 배송중, 배송완료 )
            //     od_hope_data:null,//무통장 희망입금일 
            //     od_settle_case:data.pay_method,//결제수단
            //     od_tno:null//거래번호
            // }).then((result) =>{
            //     console.log(result);
            //     alert("결제완료");
            // }).catch((error) => {
            //     console.log(error);
            //     alert("결제실패!!");
            // });

        } else {
            alert(`결제 실패 : ${error_msg}`);
        }
    }
 
    return (
        <>
            <button type="button" id="purchase-button" onClick={onClickPayment}>결제하기</button>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
      allProducts: state.allProducts
    }
  }
  
export default connect(mapStateToProps)(Payment);