import React, { useEffect,useState } from 'react';
import {API_URL} from "../config/constants.js";
import axios from "axios";
import jwt_decode from "jwt-decode";
import styled from "styled-components";
import { Link } from "react-router-dom";

const OrderWait = () => {
    const [isOrderWait, setOrderWait] = useState("");
    let Session = sessionStorage.getItem('user_id');
    if(!Session){
      alert("관리자 계정으로 로그인 해주세요");
      document.location.href = '/'
    }
    if(Session){
        const decoded = jwt_decode(Session).user_id;
        if(decoded !== "admin"){
            alert("관리자 계정으로 로그인 해주세요");
            document.location.href = '/'
        }
    }
    const orderWaitLength = async () => {//결제대기 갯수
        await axios
        .get(`${API_URL}/v1/order/setOrderWait`)
        .then(function(result){
            console.log(result.data);
            setOrderWait(result.data.result)   
        })
        .catch((err) => {
            console.log("Err: ", err);
        });
    };
    useEffect(() => {
        orderWaitLength()//결제대기 갯수
    },[])
  return (
    <div style={{paddingTop:200, textAlign:'center'}}>
        {isOrderWait && isOrderWait.map((w) => {
          return (
            <div key={w.id} >
              <div className='comment_name'>
                  {w.id}        
                  d                  
              </div>
            </div>
          );
        })}
      <ToListBtn>
        <Link to={`/adminpage`} style={{color:'white'}}>목록으로</Link>
      </ToListBtn>
    </div>
  )
}
const ToListBtn = styled.button`
    font-family: Lato, sans-serif;
    border-radius: 4px;
    color: #fff;
    background-color: #333;
    border: 1px solid transparent;
    height: 50px;
    font-size: 14px;
    width: 120px;
`
export default OrderWait