import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/Login.css";
import { useHistory, Link, useRouteMatch } from 'react-router-dom';
import {API_URL} from '../config/constants'
import "../css/CartPage.css";
import "../css/Order.css";
import { useDispatch,useSelector } from "react-redux";
import Test from "./Test"
import { motion } from "framer-motion"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { actionCreators as userActions } from "../_modules/user";
import { actionCreators as productActions } from "../_modules/product";
import { actionCreators as productOptionActions } from "../_modules/productoptions";
import jwt_decode from "jwt-decode";
dayjs.extend(relativeTime);//dayjs에서 확장된 기능 사용 

const ReviewList = () => {
    const history = useHistory();
    const Userstate = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(false)
    const [loading, setLoading] = useState(true);
    const [htmlData, setHtmlData] = useState("");
    const [htmlData2, setHtmlData2] = useState("");
    const [detailhtmlData, detailsetHtmlData] = useState("");
    const [isReviewLength, setReviewLength] = useState("");
    

    const [isshopOrder, setshopOrder] = useState(null);
    let state = useSelector(state => state);
    const ProductsData = useSelector((state) => state.allProducts.products.products);
    const whyerrorObject = state.productoptions.productoptions.products;

    const [inputordernum, setinputordernum] = useState('')//비회원일경우 조회
    const [inputPhone, setInputPhone] = useState('')

    const ModifyAddressBtn = useRouteMatch("/ModifyAddress/:index")
    const handleInputordernum = (e) => {
        setinputordernum(e.target.value)
    }
    const handleInputPhone = (e) => {
        setInputPhone(e.target.value)
    }

    //
    const getOrderResult = async () => {//구입후 주문한 상품내역 
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

    const ReviewLength = async () => {//리뷰작성한 내역 
        let Session = sessionStorage.getItem('user_id');
        if(Session){
            //세션 복호화 
            const decoded = jwt_decode(Session).user_id;

            await axios
            .get(`${API_URL}/v1/review/reviewAll`)
            .then(function(result){
                console.log('reviewAll :',
                    result.data.result.filter(rsl=>rsl.user_id === decoded).map((res) => (res.response_result))
                );
                setReviewLength(result.data.result.filter(rsl=>rsl.user_id === decoded).map((res) => (res.response_result)));
                
            })
            .catch((err) => {
                console.log("Err: ", err);
            });
        }
    };
    useEffect( () => {//로그인 여부 판별
      
      dispatch(productActions.setProductSV());
      dispatch(userActions.setUserSV());
      ReviewLength();
      //dispatch(productOptionActions.setProductOptionsSV(id));

      window.scrollTo(0, 0);
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
    
    
    function calculateProduct(isshopOrder2){

      const emptyArray = []
      const emptyArray2 = []
      const emptyArray3 = []
      const emptyArray4 = []
      const tatalArray = []
      const tatalArray2 = []
      let sumArray = isshopOrder2 && isshopOrder2.map((product,index) => (
        product.product_it_id.split(',')
      ))
      let sumArraySize = isshopOrder2 && isshopOrder2.map((product,index) => (
        product.size.split(',')
      ))
      let sumArrayColor = isshopOrder2 && isshopOrder2.map((product,index) => (
        product.color.split(',')
      ))
      let sumArrayOrderNum = isshopOrder2 && isshopOrder2.map((product,index) => (
        product.ordernum.split(',')
      ))
        
      const sumArray2 = sumArray.join()
      const sumArray22 = sumArraySize.join()
      const sumArray222 = sumArrayColor.join()
      const sumArray2222 = sumArrayOrderNum.join()
      
      emptyArray.push(sumArray2)
      emptyArray2.push(sumArray22)
      emptyArray3.push(sumArray222)
      emptyArray4.push(sumArray2222)

      const sumArray3 = emptyArray[0].split(',')
      const sumArray4 = emptyArray2[0].split(',') 
      const sumArray5 = emptyArray3[0].split(',')
      const sumArray6 = emptyArray4[0].split(',')
    
      console.log("sumArray3 :",sumArray3);
      let difference = sumArray3.filter(x => !isReviewLength.includes(x)); // 결과 1
      console.log("difference :",difference);
      for(let i=0; i<difference.length;i++){//1,1,2,2//구매한갯수 
                
                tatalArray.push(
                  <>
                    <tr key={i}>
                      <td className="first_td">
                            {/* <Link
                                style={{ color: "inherit" }}
                                className="product-link2"
                                to={`/products/${product.it_id}`}
                            >
                                <img className="thumb_img" src={
                                    process.env.NODE_ENV === 'production'
                                    ?`${product.thumb_name}`
                                    :`${API_URL}/${product.thumb_name}`} alt="" />
                            </Link> */}
                            <Link
                                style={{ color: "inherit" }}
                                className="product-link2"
                                // to={`/products/${product.it_id}`}
                            >
                                <span className="thumb_text">{`${ProductsData && ProductsData.find((item) => String(item.id) === String(difference[i])).name}`}</span>
                                <span className="thumb_text_Detail">{`${sumArray4[i]} / ${sumArray5[i]} / ${sumArray6[i]}개`}</span>
                            </Link>
                    </td>
                      {/* <td>
                      {`${sumArray4[i]} / ${sumArray5[i]} / ${sumArray6[i]}개`}
                      </td> */}
                      <td> 
                        <div id={difference[i]} style={{backgroundColor:'black',color:'white',width:'50px',height:'50px',margin:'10px auto',borderRadius:'15px',lineHeight:'50px'}}className="WriteButton">
                          <Link style={{color:'inherit'}} to={`/ReviewWrite/${difference[i]}`}>
                            작성
                          </Link>
                        </div>
                      </td>
                    </tr>
                  </>
                )
      }
      return tatalArray;
  }
  if(isshopOrder && isshopOrder.length === 0){
    alert("결제내역이 없습니다 오류시 재로그인 해주세요.")
    document.location.href = '/'
    sessionStorage.removeItem('user_id')
  }
    return (
        <div style={{paddingTop:"100px"}}>
            {
                loading ? (//페치아직 안받아오면 
                    <h1>Loading...</h1>
                ) : ( //페치 받아오면 View
                    <div className="CartPage_Wrapper">
                    {/* 카트개수 */}
                    <div className="CartPage_HeadLine">Review List   ({isshopOrder && isshopOrder.length !== 0 ? calculateProduct(isshopOrder && isshopOrder).length : null})</div>
                    {/* 카트리스트 */}
                        <div id="">
                            <table id="sod_list2" className="table" style={{width:'100%'}}>
                                <thead>
                                    <tr className="sod_list_head">
                                        <th scope="col" width="20*" className="text_left_order">상품명</th>
                                        <th scope="col" width="10%">후기작성</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {isshopOrder && isshopOrder.length !== 0 
                                  ? calculateProduct(isshopOrder && isshopOrder).map((review,index)=>{
                                  return(
                                    <>
                                      {review}
                                    </>
                                  )}) 
                                  : <div>결제내역이 없습니다. 오류시 재로그인 해주세요.</div>
                                }
                                {/* {isshopOrder && isshopOrder.map(function (product,index) {
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
                                })} */}
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
