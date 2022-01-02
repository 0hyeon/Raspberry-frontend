import React, { useCallback, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {API_URL} from "../config/constants";
import { useHistory,useLocation }from "react-router-dom";
import "../css/Register.css";
import Test from "./Test"
import Payment from "./Payment";
import { useSelector } from 'react-redux';
function OrderPage() {
    let userState = useSelector(state => state.user.user);
    let [inputVal, inputChangeVal] = useState(userState.user_name);
    let [inputValPhone, inputChangeValPhone] = useState(userState.user_phonenumber);
    let [inputValEmail, inputChangeValEmail] = useState(userState.user_email);
    let [inputValMemo, inputChangeValMemo] = useState(null);
    const [htmlData, setHtmlData] = useState(null);
    const location = useLocation()
    const history = useHistory();
    const Producttitle = location.state.title
    const Productprice = location.state.price
    const Productimg = location.state.imgThumb
    const [nickBtn, setNickBtn] = useState(false);
    const initialValues = {
        user_id: "",
        user_pw: "",
        user_name: "",
        user_address:"",
        user_phonenumber:"",
        user_email:"",
    };
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const validationSchema = Yup.object().shape({
        user_name: Yup.string().min(1, '1자리 이상 입력해 주세요.').max(5, '5자리 미만을 입력해 주세요.'),
        user_email: Yup.string().email('이메일형식이 아닙니다.').max(255),
        user_phonenumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid')
    });
    
    const onSubmit = useCallback(
        (data) => {
            const pw_naming = document.getElementById('inputCreatePostuser_pw').value;
            const email_naming = document.getElementById('inputCreatePostuser_email').value;
            const name_naming = document.getElementById('inputCreatePostuser_name').value;
            const user_address1 = document.getElementById('inputAdd').value;
            const user_address2 = document.getElementById('inputdetailAdd').value;

            data.user_address =  user_address1+" / "+ user_address2;
            if (!nickBtn){
                alert('아이디 중복체크를 확인해주세요.')
                return;
            }else if(!email_naming){
                alert('이메일을 확인해주세요.')
                return;
            }else if(name_naming.length < 2 || name_naming.length > 5  ){
                alert('이름을 확인해주세요.')
            }
            console.log(data);
            axios.post(`${API_URL}/v1/user_inform`, data).then(()=>{
                console.log(data);
            })
            alert("회원가입 완료");
            history.replace('/login')//이전페이지의 기록이 사라지고 대체됨
        },[nickBtn,htmlData],
    );

    const formik = useFormik({
        initialValues
    })
    
    console.log('userState!!!',userState);
    console.log('htmlData',htmlData);

    return (
        <div>
            <Formik
                initialValues = {formik.initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <h2 className="registerTop">주문상품</h2>
                        <div className='OrderPage_productArea_wrapper'>
                            <div className='OrderPage_productArea_wrapper_left'>
                                <img style={{width:'90px'}}src={`${API_URL}/${Productimg}`} alt="ThumbImage" />
                            </div>
                            <div className='OrderPage_productArea_wrapper_right'>
                                <div>{Producttitle}</div>
                                <div className='OrderPage_Productprice'>{Productprice} won</div>
                            </div>
                            
                        </div>
                    <h2 className="registerTop">배송지</h2>
                    {/* 아이디 */}
                    <label className='borderLine'> 주문자명 :</label>
                    <ErrorMessage name="user_name" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_name"
                        name="user_name"
                        placeholder="Your Name..."
                        className="input_id"
                        value={inputVal}
                        onChange={ (e)=>{inputChangeVal(e.target.value)} }
                    />
                    {/* 주소 */}
                    <label> 주소 :</label>
                    <span style={{color:'black',padding:'10px'}}>(제주 및 도서 산간 지역의 배송은 추가 배송비가 발생할 수 있습니다.)</span>
                    <Test setHtmlData={htmlData}/>
                    
                    <label> 핸드폰번호 :</label>
                    <ErrorMessage name="user_phonenumber" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_phone"
                        name="user_phonenumber"
                        placeholder="123-3456-7890"
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
                    <button type="submit"> 결제하기</button>

                    <Payment userName={inputVal} userAddress={htmlData} userPhone={inputValPhone} userEmail={inputValEmail} userMemo={inputValMemo} name={Producttitle} price={Productprice} />
                </Form>
            </Formik>
        </div>
    );
}

export default OrderPage
