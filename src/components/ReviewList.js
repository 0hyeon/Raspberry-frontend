import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/Login.css";
import { useHistory, Link, useRouteMatch } from 'react-router-dom';
import {API_URL} from '../config/constants'
import "../css/CartPage.css";
import "../css/Order.css";
import { useSelector } from "react-redux";
import Test from "./Test"
import { motion } from "framer-motion"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime);//dayjs에서 확장된 기능 사용 

const ReviewList = () => {
    const history = useHistory();
    const Userstate = useSelector((state) => state.user.user);
    const [isLogin, setIsLogin] = useState(false)
    const [loading, setLoading] = useState(true);
    const [htmlData, setHtmlData] = useState("");
    const [htmlData2, setHtmlData2] = useState("");
    const [detailhtmlData, detailsetHtmlData] = useState("");
    

    const [isshopOrder, setshopOrder] = useState(null);
    

    const [inputordernum, setinputordernum] = useState('')//비회원일경우 조회
    const [inputPhone, setInputPhone] = useState('')

    const ModifyAddressBtn = useRouteMatch("/ModifyAddress/:index")
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
        // console.log("U   serstate",Userstate);
    },[])
    const ModifyAddress =  (index) => {
        history.push(`/ModifyAddress/${index}`);
        // console.log(index);
        // const TargetObj = document.getElementById(index);
        // console.log(TargetObj);
        // if(window.confirm("주소를 수정하시겠습니까?")){
        //     // history.push(`/AddressUpdate/${e.target.value}`);

        //     setAddress(true);
        // }else{
        //     return;
        // }
    }
    const ModifySubmit =  async (od_id) => {//주소 등록업데이트 
        const user_address1 = document.getElementById('inputAdd').value;
        const user_address2 = document.getElementById('inputdetailAdd').value;
        
        let body = {
            od_id,
            od_addr1: user_address1,
            od_addr2: user_address2,
        }
        await axios
        .post(`${API_URL}/v1/order/ModifyAddress `, body)
        .then(function(result){
            // console.log("v1/order/ModifyAddress",result);
            history.push("/Order");
            alert("수정되었습니다.");

        })
        .catch((err) => {
            console.log("Err: ", err);
        });
    }
    const CloseAddress =  () => {
        history.push("/Order");
    }
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
    function AddComma(value) {
        return Number(value).toLocaleString('en');
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
    
    if(isshopOrder && isshopOrder.length == 0){
      sessionStorage.removeItem('user_id')
      alert("결제내역이 없습니다 오류시 재로그인 해주세요.")
      history.push("/");
    }
    function calculateProduct(isshopOrder2){//3,4 4
      const emptyArray = []
      console.log("isshopOrder2 : ",isshopOrder2);

      let sumArray = isshopOrder2 && isshopOrder2.map((product,index) => (
        product.product_option_id.split(',')
      ))
      console.log("sumArray : ",sumArray);//1,2

      const sumArray2 = sumArray.join()
      console.log("sumArray2 : ",sumArray2);//3,4,4

      emptyArray.push(sumArray2)
      const sumArray3 = emptyArray[0].split(',')
      console.log("sumArray3 :",sumArray3.length);
      return sumArray3;
      
      // return(emptyArray.length)
      // const Id_Seperate = product_option_id.split(',');
      // const emptyArray = []
      
      // const Productcolor = useProductOpt.map((item)=>{return(item.it_Detail_color)}).join();
      // join은 배열을 문자열로 합쳐줌 그다음 split함수 ','로 나눈후 빈배열에 for문으로 담는다. 
      // for(let i=0;i<Id_Seperate.length; i++){
      //     emptyArray.push(
      //     // <strong key={i}>
      //       `${isshopOrder && isshopOrder.find((item) => String(item.id) === String(Id_Seperate[i])).name}`
      //       // </strong>
      //     )
      // }
      // return (emptyArray);

      
  }
    
    return (
        <div style={{paddingTop:"100px"}}>
            {
                loading ? (//페치아직 안받아오면 
                    <h1>Loading...</h1>
                ) : ( //페치 받아오면 View
                    <div className="CartPage_Wrapper">
                    {/* 카트개수 */}
                    <div className="CartPage_HeadLine">Review List  ({calculateProduct(isshopOrder && isshopOrder).length})</div>
                    {/* 카트리스트 */}
                        <div id="">
                            <table id="sod_list2" className="table">
                                <thead>
                                    <tr className="sod_list_head">
                                        <th scope="col" width="10%" className="text_left_order">상품명</th>
                                        <th scope="col" width="10%">금액</th>
                                        <th scope="col" width="10*">주문날짜</th>
                                        <th scope="col" width="10*">후기작성</th>
                                        <th scope="col" width="10%">삭제</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {isshopOrder && isshopOrder.map(function (product,index) {
                                    return(
                                        <tr key={product.id} id={product.id}>
                                            <td className="first_td">
                                                <div>
                                                <Link
                                                    style={{ color: "inherit" }}
                                                    className="product-link2"
                                                    to={`/products/${product.it_id}`}
                                                >
                                                    <img className="thumb_img" src={
                                                        process.env.NODE_ENV === 'production'
                                                        ?`${product.thumb_name}`
                                                        :`${API_URL}/${product.thumb_name}`} alt="" />
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
                                            <td>{AddComma(product.od_cart_price)}</td>
                                            <td>{dayjs(product.createdAt).fromNow()}</td>
                                            <td style={{textAlign:'center'}}>
                                                <div id={product.id} style={{backgroundColor:'black',color:'white',display:'flex',justifyContent:'center',alignItems:'center',width:'50px',height:'50px',margin:'0 auto',borderRadius:'15px'}}className="WriteButton" onClick={Delete_Handelr2} >작성</div>
                                            </td>
                                            <td className="remove_box_wrapper" style={{textAlign:'center'}} >
                                                <div id={product.id} style={{backgroundColor:'crimson',color:'white',display:'flex',justifyContent:'center',alignItems:'center',width:'50px',height:'50px',margin:'0 auto',borderRadius:'15px'}}className="DeleteButton" onClick={Delete_Handelr2} >삭제</div>
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

            }
        </div>
    )
}

export default ReviewList
