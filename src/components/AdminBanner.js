import React, { useState,useEffect } from 'react';
import { Link } from "react-router-dom";
import styled from "styled-components";
import "../css/AdminBanner.css";
import {API_URL} from "../config/constants.js";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useHistory }from "react-router-dom";
import { Form, Divider, Input, InputNumber, Button, Upload, message } from "antd";
import FileUpload from './utils/FileUpload';
import FileUpload2 from './utils/FileUpload2';
import AdminBannerList from './AdminBannerList';

const AdminBanner = () => {
  let Session = sessionStorage.getItem('user_id');
  const [isBanner, setBanner] = useState('');
  //pc banner state
  // const [ispcBanner, setpcBanner] = useState('');
  //mobile banner state
  // const [isMobileBanner, setMobileBanner] = useState('');

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
  const [ imageUrl, setImageUrl ] = useState(null);//나의 업로드
  
  const [ Images, setImages ] = useState([]);//ann john의 업로드 , FileUpload컴포넌트에서 받아옴 
  const [ Images2, setImages2 ] = useState([]);//ann john의 업로드 , FileUpload컴포넌트에서 받아옴 

  const onSubmitPc = (values) => {//제출

    const body = {
      imageUrl : Images,
      href : values.href,
      category : 'pc'
    }
    axios.post(`${API_URL}/v1/banner/inSertBanner`,body,{
      withCredentials:true
    }).then(() => {
      alert("배너등록 완료");
      history.replace('/adminpage');//이전페이지의 기록이 사라지고 대체됨
    }).catch((error) => {
      console.log(error);
      message.error(`에러가 발생했습니다. ${error.message}`)
    });
  }
  const onSubmitMobile = (values) => {//제출

    const body = {
      imageUrl : Images2,
      href : values.href,
      category : 'mobile'
    }
    
    axios.post(`${API_URL}/v1/banner/inSertBanner`,body,{
      withCredentials:true
    }).then(() => {
      alert("배너등록 완료");
      document.location.href = '/AdminBanner'
    }).catch((error) => {
      console.log(error);
      message.error(`에러가 발생했습니다. ${error.message}`)
    });

  }

  // const onChangeImage = (info) => {
  //   if(info.file.status === 'uploading'){
  //     return;
  //   }
  //   if(info.file.status === 'done'){
  //     const response = info.file.response;
  //     const imageUrl = response.imageUrl;
  //     setImageUrl(imageUrl);
  //   }
  // }
  const updateImages = (newImages) => {//FileUpload 컴포넌트에서 요청 
    setImages(newImages) 
  }
  const updateImages2 = (newImages2) => {//FileUpload 컴포넌트에서 요청 
    setImages2(newImages2) 
  }
  const fetchBanner = async () => { 
    await axios
    .get(`${API_URL}/v1/banner/fetchBanner`)
    .then(function(res){
        console.log(res.data.result);   
        setBanner(res.data.result);   
    })
    .catch((err) => {
        console.log("Err: ", err);
    });
  };
  useEffect(() => {
    fetchBanner();//배너조회
  },[])
  // if(isBanner == ''){
  //   return <div>Loading...</div>;
  // }
  return (
    <div style={{paddingTop:'100px',textAlign:'center'}}>
      <AdminBannerList />
      <div className='TopHeadder'>Admin Banner Setting</div>
      <ToListBtn>
          <Link to={`/adminpage`} style={{color:'white'}}>목록으로</Link>
      </ToListBtn>
      <div id="upload-container-banner" style={{margin:'0 auto'}}>
      {/* pc */}
      {isBanner && isBanner.filter(ct => ct.category === "pc").length < 1 
      ? 
      <Form name="pcbanner업로드" onFinish={onSubmitPc}>
        {/* 메인사진 */}
        <FileUpload refreshFunction={updateImages} />
        <Form.Item
          label={<div className="upload-label">링크</div>}
          name="href"
          rules={[{ required: true, message: "링크를 입력해주세요" }]}
        >
          <Input
            name="href"
            className="href"
            size="large"
            placeholder="링크를 입력해주세요."
          />
        </Form.Item>
        <Form.Item>
          <Button id="submit-button" size="large" htmlType="submit">
            배너 등록하기(PC)
          </Button>
        </Form.Item>
      </Form>
      : null
      }
      {isBanner && isBanner.filter(ct => ct.category === "mobile").length < 1 
      ?
      <Form name="Mobilebanner업로드" onFinish={onSubmitMobile}>
        {/* 메인사진 */}
        <FileUpload2 refreshFunction={updateImages2} />
        <Form.Item
          label={<div className="upload-label">링크</div>}
          name="href"
          rules={[{ required: true, message: "링크를 입력해주세요" }]}
        >
          <Input
            name="href"
            className="href"
            size="large"
            placeholder="링크를 입력해주세요."
          />
        </Form.Item>
        <Form.Item>
          <Button id="submit-button" size="large" htmlType="submit">
            배너 등록하기(Mobile)
          </Button>
        </Form.Item>
      </Form> 
      : null}
      
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

export default AdminBanner