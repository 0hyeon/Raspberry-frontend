import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory,withRouter } from 'react-router-dom';
import {API_URL} from '../config/constants'
import "../css/Login.css";
import { actionCreators as userActions } from "../_modules/user";
import { useSelector, useDispatch } from "react-redux";

function Login() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [inputId, setInputId] = useState('')
    const [inputPw, setInputPw] = useState('')
    const state = useSelector((state) => state.user);
    
    const handleInputId = (e) => {
        setInputId(e.target.value)
    }
 
    const handleInputPw = (e) => {
        setInputPw(e.target.value)
    }
 
    const onClickLogin = () => {
        // console.log('click login')//클릭시 바로 실행 
        // console.log('ID : ', inputId)// input 값 반영
        // console.log('PW : ', inputPw)// input 값 반영2
        const body = {
            user_id: inputId, 
            user_pw: inputPw
        };
        axios.post(`${API_URL}/v1/user_inform/onLogin`, body, {
            withCredentials:true
        })
        .then(res => {
            // console.log('res',res);
            // console.log('res.data',res.data);
            // console.log('res.data.user_id :: ', res.data.user_id);//토큰값
            // console.log('res.data.msg :: ', res.data.msg);//백엔드에서 보낸메시지

            if(res.data.loginSuccess == false){
                // id 일치하지 않는 경우 userId = undefined, msg = '입력하신 id 가 일치하지 않습니다.'
                // console.log('======================',res.data.msg)
                // console.log('======================',res.data)
                // alert('입력하신 id 가 존재하지 않습니다.');
                alert(res.data.msg);
            } else if(res.data.loginSuccess == true) {
                // if(inputId == 'admin'){
                //     sessionStorage.setItem('user_id','admin')//세션 생성
                //     let Session = console.log( sessionStorage.getItem('user_id') );
                //     console.log('user_id!!!',Session);
                // }else{
                sessionStorage.setItem('user_id',res.data.user_id)//세션 생성
                // console.log( "token : ",sessionStorage.getItem('user_id') );
                // }
                dispatch(userActions.setUserSV());
                // console.log('======================','로그인 성공')
                alert(res.data.msg);
                history.push("/");
                // history.goBack();
            }
            // 작업 완료 되면 페이지 이동(새로고침)
        })
        .catch((error) => {
            console.log(error);
        });
    }
    return(
        <div>
            <div className='Login_wrpper'>
                <h2 className="LoginTop">로그인</h2>
                <div className="inputWrapper">
                    <label htmlFor='input_id'>아이디 : </label>
                    <input id="input_id" type='text' name='input_id' value={inputId} onChange={handleInputId} />
                </div>
                <div className="inputWrapper">
                    <label htmlFor='input_pw'>비밀번호 : </label>
                    <input id="input_pw" type='password' name='input_pw' value={inputPw} onChange={handleInputPw} />
                </div>
                <div className='tacenter'>
                    <button id="LoginButton"type='button' onClick={onClickLogin}>로그인</button>
                </div>
                <div className=''>
                    <button id="PassWordGoing" onClick={function () {
                        history.push("/PassWordEmail");
                    }}>비밀번호찾기
                    </button>
                </div>
                <div className='' style={{marginTop:"10px"}}>
                    <button id="PassWordGoing" onClick={function () {
                        history.push("/registration");
                    }}>회원가입 
                    </button>
                </div>
            </div>
        </div>
    )
}
 
export default withRouter(Login);