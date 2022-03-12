import React, { useState } from 'react';
import { Link } from "react-router-dom";
import styled from "styled-components";
import "../css/AdminBanner.css";
import {API_URL} from "../config/constants.js";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useHistory }from "react-router-dom";
import { Form, Divider, Input, InputNumber, Button, Upload, message } from "antd";
import FileUpload from './utils/FileUpload';

const AdminBanner = () => {
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
  const history = useHistory();//리액트훅
  const [ imageUrl, setImageUrl ] = useState(null);//나의 업로드
  
  const [ Images, setImages ] = useState([]);//ann john의 업로드 , FileUpload컴포넌트에서 받아옴 

  const onSubmit = (values) => {//제출

    const body = {
      imageUrl : Images,
      href : values.href
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

  const onChangeImage = (info) => {
    if(info.file.status === 'uploading'){
      return;
    }
    if(info.file.status === 'done'){
      const response = info.file.response;
      const imageUrl = response.imageUrl;
      setImageUrl(imageUrl);
    }
  }
  const updateImages = (newImages) => {//FileUpload 컴포넌트에서 요청 
    setImages(newImages) 
  }

  return (
    <div style={{paddingTop:'100px',textAlign:'center'}}>
      <div className='TopHeadder'>Admin Banner Setting</div>
      <ToListBtn>
          <Link to={`/adminpage`} style={{color:'white'}}>목록으로</Link>
      </ToListBtn>
      <div id="upload-container">
      <Form name="상품 업로드" onFinish={onSubmit}>
        {/* 메인사진 */}
        <FileUpload refreshFunction={updateImages} />
        {/* <Form.Item
          name="upload"
          label={<div className="upload-label">상품 사진</div>}
        >
          <Upload name="image" action={`${API_URL}/image`} listType="picture" showUploadList={false} onChange={onChangeImage}>
            {
              imageUrl ? (
                <img id="upload-img" src= {`${API_URL}/${imageUrl}`} /> 
              ) : (
              <div id="upload-img-placeholder">
                <img src="/images/icons/camera.png" />
                <span>이미지를 업로드해주세요.</span>
              </div>
              )
            }
          </Upload>
        </Form.Item> */}
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
            배너 등록하기
          </Button>
        </Form.Item>
      </Form>
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