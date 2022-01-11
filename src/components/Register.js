import React, { useCallback, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {API_URL} from "../config/constants";
import { useHistory }from "react-router-dom";
import "../css/Register.css";
import Test from "./Test"
import { useDispatch } from 'react-redux';
function Registration() {
    const dispatch = useDispatch();
    const history = useHistory();

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
        user_id: Yup.string().min(2, '아이디는 2글자 이상입니다.').max(10, '아이디는 10글자를 넘지 못해요.').required('사용하실 아이디를 입력해 주세요.'),
        // user_email: Yup.string().email().min(3, '3자리 이상 입력해 주세요.').max(25, '25글자를 넘지 못해요.').required('이메일을 입력해주세요.'),
        user_pw: Yup.string().min(6, '6자리 이상 입력해 주세요.').max(15, '15자리 미만을 입력해 주세요.').required('비밀번호를 입력해 주세요.'),
        user_name: Yup.string().min(1, '1자리 이상 입력해 주세요.').max(15, '15자리 미만을 입력해 주세요.').required('이름을 입력해 주세요.'),
        user_email: Yup.string().email('이메일형식이 아닙니다.').max(255).required('이메일을 입력해주세요.'),
        user_phonenumber: Yup.string().min(1, '1자리 이상 입력해 주세요.').matches(phoneRegExp, '너무짧습니다.')
    });
    
    const onSubmit = useCallback(
        (data) => {
            const pw_naming = document.getElementById('inputCreatePostuser_pw').value;
            const email_naming = document.getElementById('inputCreatePostuser_email').value;
            const name_naming = document.getElementById('inputCreatePostuser_name').value;
            const user_address1 = document.getElementById('inputAdd').value;
            const user_address2 = document.getElementById('inputdetailAdd').value;
            const user_phone = document.getElementById('inputCreatePostuser_phone').value;
            const user_address_postzone = document.getElementById('inputPostzone').value;
            console.log("zonecode!!!!!",user_address_postzone);//undefined뜸 
            data.user_address =  user_address1;
            data.user_address_detail = user_address2;
            data.user_address_postzone = user_address_postzone;
            if (!nickBtn){
                alert('아이디 중복체크를 확인해주세요.')
                return;
            }else if(!email_naming){
                alert('이메일을 확인해주세요.')
                return;
            }else if(pw_naming.length < 2 || pw_naming.length > 16){
                alert('비밀번호를 확인해주세요.')
                return;
            }else if(name_naming.length < 2 || name_naming.length > 16  ){
                alert('이름을 확인해주세요.')
                return;
            }else if(user_address1 === ""){
                alert('주소를 입력해주세요.')
                return;
            }else if(user_address2 === ""){
                alert('상세주소를 입력해주세요.')
                return;
            }else if(user_phone === ""){
                alert('핸드폰 번호를 입력해주세요. ^^;')
                return;
            }
            console.log(data);
            axios.post(`${API_URL}/v1/user_inform/`, data).then(()=>{
                console.log(data);
            })
            alert("회원가입 완료");
            history.replace('/login')//이전페이지의 기록이 사라지고 대체됨
        },[nickBtn],
    );

    const formik = useFormik({
        initialValues
    })

    const checkID = (e) => {
        e.preventDefault();
        const naming = document.getElementById('inputCreatePostuser_id').value;
        
        const data = {user_id: naming};
        axios.post(`${API_URL}/v1/user_inform/idCheck`,data,{
            withCredentials:true
        })
        .then(res => {
            if(res.data.msg == '빈값'){
                alert('내용을 입력하세요');
            }else if(res.data.msg == '닉네임은 2글자 이상 10글자 미만 입력해주세요.'){
                alert('닉네임은 2글자 이상 10글자 미만 입력해주세요.');
            }else if(res.data.msg == '중복'){
                setNickBtn(false);
                alert('이미 사용중인 id입니다.');
            }else if(res.data.msg == '가능'){
                setNickBtn(true);
                alert('사용 가능한 id입니다.');
            }
            // document.location.href='/registration'
        })
        .catch((error) => {
            console.log(error);
        });
    }
    useEffect(()=>{
        console.log("dispatch Effect작동!")
    },[dispatch])
    return (
        <div>
            <Formik
                initialValues = {formik.initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <h2 className="registerTop">회원가입</h2>
                    {/* 아이디 */}
                    <label> 아이디 :</label>
                    <ErrorMessage name="user_id" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_id"
                        name="user_id"
                        placeholder="Ex. rasberryberry..."
                        className="input_id"
                    />
                    <button 
                        type="button"
                        onClick={checkID} 
                        className={nickBtn ? 'btn-ok' : 'btn-no'}
                    >
                        {nickBtn ? '완료' : '아이디중복체크'}
                    </button>
                    {/* 비밀번호 */}
                    <label>비밀번호 :</label>
                    <ErrorMessage name="user_pw" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_pw"
                        name="user_pw"
                        placeholder="Your Password..."
                        type="password"
                        className="input_id"
                    />
                    {/* 이름 */}
                    <label> 이름 :</label>
                    <ErrorMessage name="user_name" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_name"
                        name="user_name"
                        placeholder="이름"
                        className="input_id"
                    />
                    {/* 주소 */}
                    <label> 주소 :</label>
                    <Test />
                    {/* 이메일주소 */}
                    <label> 이메일 :</label>
                    <ErrorMessage name="user_email" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_email"
                        name="user_email"
                        placeholder="abc@naver.com"
                        className="input_id"
                    />
                    {/* 핸드폰번호  */}
                    <label> 핸드폰번호 :</label>
                    <ErrorMessage name="user_phonenumber" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_phone"
                        name="user_phonenumber"
                        placeholder="(-) 없이입력해주세요"
                        className="input_id"
                    />
                    <button type="submit"> 회원가입</button>
                </Form>
            </Formik>
        </div>
    );
}

export default Registration
