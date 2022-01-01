import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {API_URL} from "../config/constants";

function PassWordEmail() {
    const initialValues = {
        user_email: "",
    };
    const validationSchema = Yup.object().shape({
        user_email: Yup.string().email('잘못된 이메일 형식입니다.').required('빈칸입니다.'),
    });
    // const body = {
    //     user_id: inputId
    // };
    const onSubmit = (data) => {
        console.log("user_email!!!",data);
        axios.post(`${API_URL}/v1/user_inform/PassWordEmail`, data, {
            withCredentials:true
        })
        .then(res => { 
            if(res.data.msg == '입력하신 이메일로 등록된 정보가 없습니다.'){
                alert('입력하신 이메일로 등록된 정보가 없습니다.');
            }else{
                alert('임시비밀번호를 발송하였습니다.');
            }
        })
        .catch((error) => {
            console.log(error);
        });
    };
    // const [inputEmail, setInputEmail] = useState('')

    // const handleInputEmail = (e) => {
    //     setInputEmail(e.target.value)
    // }
    useEffect(() => {
        axios.post(`${API_URL}/v1/user_inform/PassWordEmail`)
        .then(res => console.log(res))
        .catch((error) => {
            console.log(error);
        });
    },[])

    return (
        <div>
            <Formik
                initialValues = {initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <label> 이메일 :</label>
                    <ErrorMessage name="user_email" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="user_email"
                        placeholder="aurorafac@naver.com"
                />
                    <button type="submit"> 이메일전송</button>
                </Form>
            </Formik>
        </div>
    )
}

export default PassWordEmail