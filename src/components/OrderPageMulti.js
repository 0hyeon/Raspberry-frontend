import React, { useCallback, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {API_URL} from "../config/constants";
import { useHistory,useLocation }from "react-router-dom";
import "../css/Register.css";
import "../css/OrderPage.css";
import "../css/OrderPageMulti.css";

import Test from "./Test"
import Payment from "./Payment";
import { useSelector,useDispatch } from 'react-redux';
function OrderPageMulti() {
    const dispatch = useDispatch();
    let userState = useSelector(state => state.user.user);
    let useProductOpt = useSelector(state => state.productoptionDetails.productoptionDetails);
    let [inputVal, inputChangeVal] = useState(userState.user_name);
    let [inputValPhone, inputChangeValPhone] = useState(userState.user_phonenumber);
    let [inputValEmail, inputChangeValEmail] = useState(userState.user_email);
    let [inputValMemo, inputChangeValMemo] = useState(null);
    let [siwpeOrder, setsiwpeOrder] = useState(false);//true면 paymeny컴포넌트 false면 유효성검사 component
    let [istotalcost, settotalcost] = useState(null);

    //주소에 따른 배송비
    let userStateAddress = useSelector(state => state.setaddress.setaddress);
    let [isuserStateAddress, setuserStateAddress] = useState(null);
    let [deliveryconst, setdeliveryconst] = useState(100);

    const [htmlData, setHtmlData] = useState(userState.user_address);
    const [htmlDatadetail, setHtmlDatadetail] = useState(userState.user_address_detail);
    const location = useLocation()
    const history = useHistory();
    const product_option_id = useProductOpt.map((item)=>{return(item.it_option_id)}).join();
    console.log("상품옵션ID : ",product_option_id);

    const Producttitle = useProductOpt.map((item)=>{return(item.it_name)}).join();
    console.log("제품명 : ",Producttitle);

    const Productcolor = useProductOpt.map((item)=>{return(item.it_Detail_color)}).join();
    console.log(Productcolor);

    const Productsize = useProductOpt.map((item)=>{return(item.it_Detail_size)}).join();
    console.log(Productsize);

    const Productprice = useProductOpt.map((item)=>{return(item.it_sc_price)}).join();
    console.log(Productprice);

    const Productimg = useProductOpt.map((item)=>{return(item.thumb_name)}).join();
    console.log(Productimg);

    //이게없음
    const ProductStock = useProductOpt.map((item)=>{return(item.it_sc_stock)}).join();
    console.log("재고",ProductStock);

    const ProductOrderNum = useProductOpt.map((item)=>{return(item.it_Detail_quanity)}).join();
    console.log("주문수량",ProductOrderNum);

    const initialValues = {
        user_name: "",
        user_address:"",
        user_address_detail:"",
        user_phonenumber:"",
        user_email:"",
    };
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const validationSchema = Yup.object().shape({
        user_name: Yup.string().min(2, '아이디는 2글자 이상입니다.').max(10, '아이디는 10글자를 넘지 못해요.'),
        user_email: Yup.string().email('이메일형식이 아닙니다.').max(255),
        user_phonenumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid')
    });
    
    const onSubmit = useCallback(
        (data) => {
            const name_naming = document.getElementById('inputCreatePostuser_name').value;
            const phone_naming = document.getElementById('inputCreatePostuser_phone').value;
            const email_naming = document.getElementById('inputCreatePostuser_email').value;
            const user_address1 = document.getElementById('inputAdd').value;
            const user_address2 = document.getElementById('inputdetailAdd').value;
            data.user_address =  user_address1;
            data.user_address_detail = user_address2;
            console.log("data",data);
            if (name_naming == ""){
                alert('주문자명을 확인해주세요.')
                return;
            }else if(user_address1 == "" || user_address2 == ""){
                alert('주소, 상세주소를 입력해주세요.')
                return;
            }else if(phone_naming.length < 10 ){
                alert('핸드폰번호를 확인해주세요.')
                return;
            }else if(email_naming == ""){
                alert('이메일을 입력해주세요.')
                return;
            }
            // axios.post(`${API_URL}/v1/user_inform`, data).then(()=>{
            //     console.log(data);
            // })
        },[],
    );
    useEffect(() => {

        setHtmlData(document.getElementById("inputAdd").value)
        setHtmlDatadetail(document.getElementById("inputdetailAdd").value)
        setuserStateAddress(userStateAddress)
        // console.log("isuserStateAddress",isuserStateAddress);

        if(isuserStateAddress == null || isuserStateAddress == [] ){
            return;
        }else{
            const delivery2 = Number(isuserStateAddress.zonecode);
        
            if(delivery2 === 63000 || delivery2 === 63001 ){//제주 추자면 : 7,000원
                setdeliveryconst(7000);
            }else if(delivery2 === 63365){//제주 우도 : 6,000원
                setdeliveryconst(6000);
            }else if(delivery2 >= 59781 && delivery2 <= 59790 ){//전남 여수 섬지역3 : 8,000원
                setdeliveryconst(8000);
            }else if(delivery2 === 59766 ){//전남 여수 섬지역2 : 8,000원
                setdeliveryconst(8000);
            }else if(delivery2 === 59650 ){//전남 여수 섬지역1 : 8,000원
                setdeliveryconst(8000);
            }else if(delivery2 === 59658 ){//전남 고흥 섬지역4 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 59563 ){//전남 고흥 섬지역3 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 59551 ){//전남 고흥 섬지역2 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 59531 ){//전남 고흥 섬지역1 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 59421 ){//전남 보성 섬지역 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 >= 59137 && delivery2 <= 59166 ){//전남 완도 섬지역5 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 59129 ){//전남 완도 섬지역4 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 59127 ){//전남 완도 섬지역3 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 59106 ){//전남 완도 섬지역2 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 59102 || delivery2 === 59103 ){// 전남 완도 섬지역1 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 >= 58953 && delivery2 <= 58958 ){// 전남 진도 섬지역 : 7,000원
                setdeliveryconst(7000);
            }else if(delivery2 >= 58828 && delivery2 <= 58866 ){//전남 신안 섬지역4 : 7,000원
                setdeliveryconst(7000);
            }else if(delivery2 === 58826 ){//전남 신안 섬지역3 : 7,000원
                setdeliveryconst(7000);
            }else if(delivery2 >= 58816 && delivery2 <= 58818 ){//전남 신안 섬지역2 : 7,000원
                setdeliveryconst(7000);
            }else if(delivery2 >= 58800 && delivery2 <= 58810 ){//전남 신안 섬지역1 : 7,000원
                setdeliveryconst(7000);
            }else if(delivery2 >= 58760 && delivery2 <= 58762 ){//전남 목포 섬지역 : 6,000원
                setdeliveryconst(6000);
            }else if(delivery2 >= 57068 && delivery2 <= 57069 ){//전남 영광 섬지역 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 >= 56347 && delivery2 <= 56349 ){//전북 부안 섬지역 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 >= 46768 && delivery2 <= 46771 ){//부산 강서구 섬지역 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 === 54000 ){//경남 통영 섬지역3 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 >= 53089 && delivery2 <= 53104 ){//경남 통영 섬지역2 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 >= 53031 && delivery2 <= 53033 ){//경남 통영 섬지역1 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 >= 52570 && delivery2 <= 52571 ){//경남 사천 섬지역 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 >= 40200 && delivery2 <= 40240 ){//경북 울릉도 전지역 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 === 33411 ){//충남 보령 섬지역 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 32133 ){//충남 태안 섬지역 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 31708 ){//충남 당진 섬지역 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 >= 23124 && delivery2 <= 23136 ){//인천 옹진 섬지역2 : 6,000원
                setdeliveryconst(6000);
            }else if(delivery2 >= 23100 && delivery2 <= 23116 ){//인천 옹진 섬지역1 : 6,000원
                setdeliveryconst(6000);
            }else if(delivery2 >= 23004 && delivery2 <= 23010 ){//인천 강화 섬지역 : 4,500원
                setdeliveryconst(4500);
            }else if(delivery2 >= 22386 && delivery2 <= 22388 ){//인천 중구 섬지역 : 6,000원
                setdeliveryconst(6000);
            }else{
                setdeliveryconst(100);//그외 전부 3000원
            }
        }

    },[htmlData,htmlDatadetail,inputValMemo,isuserStateAddress,userStateAddress,deliveryconst])
    const formik = useFormik({
        initialValues
    })
    useEffect(() => {
            const name_naming = document.getElementById('inputCreatePostuser_name').value;
            const phone_naming = document.getElementById('inputCreatePostuser_phone').value;
            const email_naming = document.getElementById('inputCreatePostuser_email').value;
            const user_address1 = document.getElementById('inputAdd').value;
            const user_address2 = document.getElementById('inputdetailAdd').value;
            if (name_naming == ""){
                setsiwpeOrder(false);
                return;
            }else if(user_address1 == ""){
                setsiwpeOrder(false);
                return;
            }else if(phone_naming.length < 10 ){
                setsiwpeOrder(false);
                return;
            }else if(email_naming == ""){
                setsiwpeOrder(false);
                return;
            }else{
                setsiwpeOrder(true);
            }
            console.log(inputValEmail);
            settotalcost(
                useProductOpt && useProductOpt
                .map((item )=> item.it_sc_price * item.it_Detail_quanity)
                .reduce((accumulator, currentNumber) => {return(
                    accumulator + currentNumber
                )})
            )
    }, [inputValEmail,siwpeOrder,useProductOpt])
    
    if (useProductOpt == "" || useProductOpt == null || useProductOpt == undefined ){//리덕스 새로고침시 state없어져서 루트로 보냄 
        history.push("/");
    }
    // console.log(useProductOpt);
    // const heyy = {"name":3}
    // console.log(heyy.name);
    return (
        <div>
            <Formik
                initialValues = {formik.initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <h2 className="registerTop">주문상품</h2>
                            {useProductOpt && useProductOpt.map((item )=>{
                                return(
                                    <>
                                    <div className='OrderPage_productArea_wrapper'>
                                        <div className='OrderPage_productArea_wrapper_left'>
                                            <img style={{width:'90px'}}src={`${API_URL}/${item.thumb_name}`} alt="ThumbImage" />
                                        </div>
                                        <div className='OrderPage_productArea_wrapper_right'>
                                            <div>{`${item.it_name} / ${item.it_Detail_color} / ${item.it_Detail_size} / ${item.it_Detail_quanity}개` }</div>
                                            <div className='OrderPage_Productprice'>{item.it_sc_price * item.it_Detail_quanity} won + 
                                                <span style={{fontSize:'25px'}}> 배송비 </span>
                                                <span id="deliveryconst">({deliveryconst} won)</span>
                                            </div>
                                        </div>
                                    </div>  
                                    </>
                                );
                            })}
                            <div className='totalPriced'>
                            총비용 : {istotalcost} won
                            </div>
                            
                    <h2 className="registerTop">배송지</h2>
                    {/* 아이디 */}
                    <label className='borderLine'> 주문자명 :</label>
                    <ErrorMessage name="user_name" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_name"
                        name="user_name"
                        placeholder="이름"
                        className="input_id"
                        value={inputVal}
                        onChange={ (e)=>{inputChangeVal(e.target.value)} }
                    />
                    {/* 주소 */}
                    <label> 주소 :</label>
                    <span style={{color:'black',padding:'10px'}}>(제주 및 도서 산간 지역의 배송은 추가 배송비가 발생할 수 있습니다.)</span>
                    <Test value={htmlData} 
                        onChange={ (e)=>{setHtmlData(e.target.value)} }
                    />
                    
                    <label> 핸드폰번호 :</label>
                    <ErrorMessage name="user_phonenumber" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_phone"
                        name="user_phonenumber"
                        placeholder="(-) 없이입력해주세요"
                        className="input_id"
                        value={inputValPhone}
                        onChange={ (e)=>{inputChangeValPhone(e.target.value)} }
                    />
                    {/* 이메일주소 */}
                    <label> 이메일 :</label>
                    <ErrorMessage name="user_email" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_email"
                        name="user_email"
                        placeholder="abc@naver.com"
                        className="input_id"
                        value={inputValEmail}
                        onChange={ (e)=>{inputChangeValEmail(e.target.value)} }
                    />
                    {/* 메모 */}
                    <label> 배송 시 요청 사항 :</label>
                    <ErrorMessage name="user_momo" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_momo"
                        name="user_momo"
                        placeholder=""
                        className="input_id"
                        value={inputValMemo}
                        onChange={ (e)=>{inputChangeValMemo(e.target.value)} }
                    />
                    <label> 결제방법 :</label>
                    <div name="checkbox-group" role="group" aria-labelledby="checkbox-group" className='checkbox-group'>
                        <label>
                            <Field type="radio" name="picked" value="One" />
                            신용 / 체크카드
                        </label>
                        <label>
                            <Field type="radio" name="picked" value="Two" />
                            계좌이체
                        </label>
                        <label>
                            <Field type="radio" name="picked" value="Three" />
                            가상계좌
                        </label>
                        <label>
                            <Field type="radio" name="picked" value="four" />
                            무통장입금
                        </label>
                    </div>
                    {
                        siwpeOrder 
                        ? 
                        <Payment userName={inputVal} userAddress={htmlData} userAddressdetail={htmlDatadetail} userPhone={inputValPhone} userEmail={inputValEmail} userMemo={inputValMemo} name={Producttitle} size={Productsize} color={Productcolor} price={istotalcost} product_option_id={product_option_id} ProductStock={ProductStock} ProductOrderNum={ProductOrderNum} style={{width:'100%'}}/> 
                        : 
                        <button type="submit" style={{width:"100%"}}>결제하기</button>
                    }
                </Form>
            </Formik>
        </div>
    );
}

export default OrderPageMulti