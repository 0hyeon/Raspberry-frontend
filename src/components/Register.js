import React, { useCallback, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {API_URL} from "../config/constants";
import { useHistory }from "react-router-dom";
function Registration() {
    const history = useHistory();
    
    const [nickBtn, setNickBtn] = useState(false);
    
    const initialValues = {
        user_id: "",
        user_pw: "",
        user_email:"",
    };
    const validationSchema = Yup.object().shape({
        user_id: Yup.string().min(2, '닉네임은 2글자 이상입니다.').max(10, '닉네임은 10글자를 넘지 못해요.').required('사용하실 닉네임을 입력해 주세요.'),
        // user_email: Yup.string().email().min(3, '3자리 이상 입력해 주세요.').max(25, '25글자를 넘지 못해요.').required('이메일을 입력해주세요.'),
        user_email: Yup.string().email('이메일형식이 아닙니다.').max(255).required('이메일을 입력해주세요.'),
        user_pw: Yup.string().min(6, '6자리 이상 입력해 주세요.').max(13, '13자리 미만을 입력해 주세요.').required('비밀번호를 입력해 주세요.'),
    });
    
    const onSubmit = useCallback(
        (data) => {
            const pw_naming = document.getElementById('inputCreatePostuser_pw').value;
            const email_naming = document.getElementById('inputCreatePostuser_email').value;
            if (!nickBtn){
                alert('아이디 중복체크를 확인해주세요.')
                return;
            }
            else if(!email_naming){
                alert('이메일을 확인해주세요.')
                return;
            }
            else if(pw_naming.length < 2 || pw_naming.length > 10){
                alert('비밀번호를 확인해주세요.')
                return;
            }

            axios.post(`${API_URL}/user_inform`, data).then(()=>{
                console.log(data);
            })
            alert("회원가입 완료");
            history.replace('/login')//이전페이지의 기록이 사라지고 대체됨
        },[nickBtn],
    )
    ;
    const formik = useFormik({
        initialValues
    })
    const checkID = (e) => {
        e.preventDefault();
        const naming = document.getElementById('inputCreatePostuser_id').value;
        
        const data = {user_id: naming};
        axios.post(`${API_URL}/user_inform/idCheck`,data,{
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
    return (
        <div>
            <Formik
                initialValues = {formik.initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    {/* 아이디 */}
                    <label> 아이디 :</label>
                    <ErrorMessage name="user_id" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_id"
                        name="user_id"
                        placeholder="Ex. john123..."
                    />
                    <button 
                        type="button"
                        onClick={checkID} 
                        className={nickBtn ? 'btn-ok' : 'btn-no'}
                    >
                        {nickBtn ? '완료' : '아이디중복체크'}
                    </button>
                    {/* 이메일주소 */}
                    <label> 이메일 :</label>
                    <ErrorMessage name="user_email" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_email"
                        name="user_email"
                        placeholder="abc@naver.com"
                    />
                    {/* 비밀번호 */}
                     <label>비밀번호 :</label>
                    <ErrorMessage name="user_pw" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_pw"
                        name="user_pw"
                        placeholder="Your Password..."
                        type="password"
                    />
                    <button type="submit"> 회원가입</button>
                </Form>
            </Formik>
        </div>
    );
}

export default Registration
