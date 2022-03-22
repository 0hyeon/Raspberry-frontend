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
  const [isMobileBanner, setMobileBanner] = useState(null);
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
          // console.log(res.data.result.imageUrl);

          // console.log(res.data.result);
          // console.log(res.data.result.filter(ct => ct.category == "pc").map((ct)=>(ct.imageUrl)));   
          setBanner(res.data.result.filter(ct => ct.category == "pc").map((ct)=>(ct.imageUrl))[0]);   
          setMobileBanner(res.data.result.filter(ct => ct.category == "mobile").map((ct)=>(ct.imageUrl))[0]);   
      })
      .catch((err) => {
          console.log("Err: ", err);
      });
  };
  //배너삭제 
  const DeleteBanner = async (category) => {
    
    if(window.confirm("배너 삭제하시겠습니까?")){
      
      const body = {
        category
      }

      await axios
      .post(`${API_URL}/v1/banner/DeleteBanner`,body)
      .then(function(res){
          console.log(res);
          document.location.href = '/AdminBanner';
      })
      .catch((err) => {
          console.log("Err: ", err);
      });

    }else{
      return;
    }
    
  }
  useEffect(() => {
    fetchBanner();//배너조회
  },[])
  if(isBanner === '' || isMobileBanner === ''){
    return <div>Loading...</div>;
  }
  return (
    <div style={{paddingTop:'100px',textAlign:'center'}}>
      <div className='TopHeadder'>Admin Banner List</div>
      {/* desktop */}
      <div className='bannerListWrapper'>
          {isBanner ? 
              <>
                <div style={{fontSize:'18px',fontWeight:'bold'}}>Desktop ({ isBanner ? isBanner && isBanner.length : 0 })</div>
                {isBanner && isBanner.map((bn,index)=>(
                  <div className='BannerList' key={index}>
                    <img id="" src= {`${API_URL}/${bn}`} alt="."/> 
                  </div>
                ))}
                <DeleteBox onClick={() => DeleteBanner("pc")} >삭제</DeleteBox>
              </>
              
          :null
          }
          {isMobileBanner ? 
              <>
                <div style={{fontSize:'18px',fontWeight:'bold'}}>Mobile ({ isMobileBanner ? isMobileBanner && isMobileBanner.length : 0 })</div>
                {isMobileBanner && isMobileBanner.map((bn,index)=>(
                  <div className='BannerList' key={index}>
                    <img id="" src= {`${API_URL}/${bn}`} alt="."/> 
                  </div>
                ))}
                <DeleteBox onClick={ () => DeleteBanner("mobile")} >삭제</DeleteBox>
              </>
              
          :null
          }
      </div>
      
    </div>
  )
}

const DeleteBox = styled.button`
font-family: Lato,sans-serif;
border-radius: 4px;
color: #fff;
background-color: crimson;
border: 1px solid #d3d3d3;
font-size: 14px;
width: 50px;
height: 35px;
margin: 30px auto 100px;
`

export default AdminBannerList