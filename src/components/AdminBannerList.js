import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import styled from "styled-components";
import "../css/AdminBannerList.css";
import {API_URL} from "../config/constants.js";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useHistory }from "react-router-dom";
import { Form, Divider, Input, InputNumber, Button, Upload, message } from "antd";
import FileUpload from './utils/FileUpload';

const AdminBannerList = () => {
  let Session = sessionStorage.getItem('user_id');

  const [isBanner, setBanner] = useState(null);
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
  const history = useHistory();//리액트훅
  
  const fetchBanner = async () => { 
      await axios
      .get(`${API_URL}/v1/banner/fetchBanner`)
      .then(function(res){
          // console.log(res.data.result);
          // console.log(res.data.result.imageUrl);

          // console.log(res.data.result);
          // console.log(res.data.result.filter(ct => ct.category == "pc").map((ct)=>(ct.imageUrl)));   
          setBanner(res.data.result.filter(ct => ct.category == "pc").map((ct)=>(ct.imageUrl))[0]);   
      })
      .catch((err) => {
          console.log("Err: ", err);
      });
  };
  useEffect(() => {
    fetchBanner();//배너조회
  },[])
  if(isBanner === ''){
    return <div>Loading...</div>;
  }
  return (
    <div style={{paddingTop:'100px',textAlign:'center'}}>
      <div className='TopHeadder'>Admin Banner List</div>
      <div style={{fontSize:'18px'}}>Desktop</div>
      <div className='bannerListWrapper'>
        {isBanner ? 
        isBanner && isBanner.map((bn,index)=>(
          <div className='BannerList' key={index}>
            <img id="" src= {`${API_URL}/${bn}`} alt="."/> 
          </div>
        ))
        :null
        }
        <div style={{fontSize:'18px'}}>Mobile</div>
      </div>
      
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

export default AdminBannerList