import React, { useState,useRef,useEffect } from 'react';
import "antd/dist/antd.css";
import { Form, Divider, Input, InputNumber, Button, Upload, message } from "antd";
import "../css/Admin.css";
// import { ForkOutlined } from "@ant-design/icons";
import {API_URL} from "../config/constants.js";
import axios from 'axios';
import { useHistory }from "react-router-dom";
import QuillEditor from "./editor/QuillEditor"


function UploadPage() {
  let Session = sessionStorage.getItem('user_id');

  if(Session !== "admin"){
    alert("관리자 계정으로 로그인해주세요");
    document.location.href = '/'
  }

  const [imageUrl, setImageUrl] = useState(null);
  const [imageUrl2, setImageUrl2] = useState(null);
  const [imageUrl3, setImageUrl3] = useState(null);
  const [imageUrl4, setImageUrl4] = useState(null);
  const [imageUrl5, setImageUrl5] = useState(null);
  const [detailPage, setDetailPage] = useState(null);
  const history = useHistory();//리액트훅

  const [htmlContent, setHtmlContent] = useState(""); //🌈
  const quillRef = useRef(); //🌈
  const onSubmit = (values) => {//제출

    //상품내용 안쓸경우 alert
    // const description_Color = quillRef.current.getEditor().getText(); 
    
    // if (description_Color.trim()==="") {
    //   alert("내용을 입력해주세요.")
    //   return;
    // }'

    

    const editor_wysywic = document.getElementById("product-description").value
    axios.post(`${API_URL}/products`,{
      name : values.name,
      description : editor_wysywic,
      seller : values.seller,
      price :  parseInt(values.price),
      color1 : values.color1,
      colorName1 : values.colorName1,
      size1 : values.size1,
      quantity1 : parseInt(values.quantity1),
      size1_2 : values.size1_2,
      quantity1_2 : parseInt(values.quantity1_2),
      size1_3 : values.size1_3,
      quantity1_3 : parseInt(values.quantity1_3),
      color2 : values.color2,
      colorName2 : values.colorName2,
      size2 : values.size2,
      quantity2 : parseInt(values.quantity2),
      size2_2 : values.size2_2,
      quantity2_2 : parseInt(values.quantity2_2),
      size2_3 : values.size2_3,
      quantity2_3 : parseInt(values.quantity2_3),
      color3 : values.color3,
      colorName3 : values.colorName3,
      size3 : values.size3,
      quantity3 : parseInt(values.quantity3),
      size3_2 : values.size3_2,
      quantity3_2 : parseInt(values.quantity3_2),
      size3_3 : values.size3_3,
      quantity3_3 : parseInt(values.quantity3_3),
      imageUrl : imageUrl,
      imageUrl2 : imageUrl2,
      imageUrl3 : imageUrl3,
      imageUrl4 : imageUrl4,
      imageUrl5 : imageUrl5,
      detailPage : detailPage,
    }).then((result) =>{
      alert("상품등록 완료");
      history.replace('/');//이전페이지의 기록이 사라지고 대체됨
    }).catch((error) => {
      console.log(error);
      message.error(`에러가 발생했습니다. ${error.message}`)
    });
    
    
    
  };
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
  const onChangeImage2 = (info) => {
    if(info.file.status === 'uploading'){
      return;
    }
    if(info.file.status === 'done'){
      const response = info.file.response;
      const imageUrl2 = response.imageUrl2;
      setImageUrl2(imageUrl2);
    }
  }
  const onChangeImage3 = (info) => {
    if(info.file.status === 'uploading'){
      return;
    }
    if(info.file.status === 'done'){
      const response = info.file.response;
      const imageUrl3 = response.imageUrl3;
      setImageUrl3(imageUrl3);
    }
  }
  const onChangeImage4 = (info) => {
    if(info.file.status === 'uploading'){
      return;
    }
    if(info.file.status === 'done'){
      const response = info.file.response;
      const imageUrl4 = response.imageUrl4;
      setImageUrl4(imageUrl4);
    }
  }
  const onChangeImage5 = (info) => {
    if(info.file.status === 'uploading'){
      return;
    }
    if(info.file.status === 'done'){
      const response = info.file.response;
      const imageUrl5 = response.imageUrl5;
      setImageUrl5(imageUrl5);
    }
  }
  const onChangeDetailPage = (info) => {
    if(info.file.status === 'uploading'){
      return;
    }
    if(info.file.status === 'done'){
      const response = info.file.response;
      const detailPage = response.detailPage;
      setDetailPage(detailPage);
    }
  }
  useEffect( () => {
    if(document.getElementsByClassName('product-seller').value==""){
      console.log('뭐하냐 판매자 비었다');
      document.getElementsByClassName('product-seller').focus();
      return;
    }
  }, [])

  return (
    <div id="upload-container">
      <Form name="상품 업로드" onFinish={onSubmit}>
        {/* 메인사진 */}
        <Form.Item
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
          <Upload name="image" action={`${API_URL}/image2`} listType="picture" showUploadList={false} onChange={onChangeImage2}>
            {
              imageUrl2 ? (
                <img id="upload-img" src= {`${API_URL}/${imageUrl2}`} /> 
              ) : (
              <div id="upload-img-placeholder">
                <img src="/images/icons/camera.png" />
                <span>이미지를 업로드해주세요.</span>
              </div>
              )
            }
          </Upload>
          <Upload name="image" action={`${API_URL}/image3`} listType="picture" showUploadList={false} onChange={onChangeImage3}>
            {
              imageUrl3 ? (
                <img id="upload-img" src= {`${API_URL}/${imageUrl3}`} /> 
              ) : (
              <div id="upload-img-placeholder">
                <img src="/images/icons/camera.png" />
                <span>이미지를 업로드해주세요.</span>
              </div>
              )
            }
          </Upload>
          <Upload name="image" action={`${API_URL}/image4`} listType="picture" showUploadList={false} onChange={onChangeImage4}>
            {
              imageUrl4 ? (
                <img id="upload-img" src= {`${API_URL}/${imageUrl4}`} /> 
              ) : (
              <div id="upload-img-placeholder">
                <img src="/images/icons/camera.png" />
                <span>이미지를 업로드해주세요.</span>
              </div>
              )
            }
          </Upload>
        </Form.Item>
        {/* 제품영상 */}
        <Divider />
            <Form.Item
              name="upload"
              label={<div className="upload-label">제품영상</div>}
            >
              <Upload name="image" action={`${API_URL}/image5`} listType="picture" showUploadList={false} onChange={onChangeImage5}>
              {
                imageUrl5 ? (
                  <img id="upload-img" src= {`${API_URL}/${imageUrl5}`} /> 
                ) : (
                <div id="upload-img-placeholder">
                  <img src="/images/icons/camera.png" />
                  <span>이미지를 업로드해주세요.</span>
                </div>
                )
              }
              </Upload>
          </Form.Item>
        <Divider />

        {/* 상세페이지 */}
        <Form.Item
          name="upload"
          label={<div className="upload-label">상세페이지</div>}
        >
         <Upload name="image" action={`${API_URL}/detailPage`} listType="picture" showUploadList={false} onChange={onChangeDetailPage}>
            {
              detailPage ? (
                <img id="upload-img" src= {`${API_URL}/${detailPage}`} /> 
              ) : (
              <div id="upload-img-placeholder">
                <img src="/images/icons/camera.png" />
                <span>이미지를 업로드해주세요.</span>
              </div>
              )
            }
          </Upload>
        </Form.Item>
        <Divider />
        {/* 판매자명 */}
        <Form.Item
          label={<div className="upload-label">판매자 명</div>}
          name="seller"
          rules={[{ required: true, message: "판매자 이름을 입력해주세요" }]}
        >
          <Input
            className="product-seller"
            size="large"
            placeholder="이름을 입력해주세요."
          />
        </Form.Item>
        <Divider />
        {/* 상품명 */}
        <Form.Item
          name="name"
          label={<div className="upload-label">상품 이름</div>}
          rules={[{ required: true, message: "상품 이름을 입력해주세요" }]}
        >
          <Input
            className="product-name"
            size="large"
            placeholder="상품 이름을 입력해주세요"
          />
        </Form.Item>
        <Divider />
        {/* 상품가격 */}
        <Form.Item
          name="price"
          label={<div className="upload-label">상품 가격</div>}
          rules={[{ required: true, message: "상품 가격을 입력해주세요" }]}
        >
          <InputNumber defaultValue={0} className="product-price" size="large" />
        </Form.Item>
        <Divider />
        {/* 상품컬러1 */}
        <Form.Item
          name="color1"
          label={<div className="upload-label">상품 컬러1</div>}
          rules={[{ required: true, message: "상품 컬러1을 입력해주세요" }]}
        >
          <Input
            className="product-color1"
            size="large"
            placeholder="상품컬러1 ex) #000000 "
          />
        </Form.Item>
        {/* 상품컬러이름1 */}
        <Form.Item
          name="colorName1"
          label={<div className="upload-label">상품 컬러이름1</div>}
          rules={[{ required: true, message: "상품 컬러이름1 을 입력해주세요" }]}
        >
          <Input
            className="product-colorName1"
            size="large"
            placeholder="상품컬러이름1 ex) 라이트블루 "
          />
        </Form.Item>
        {/* 상품사이즈1 */}
        <Form.Item
          name="size1"
          label={<div className="upload-label">상품 사이즈1</div>}
          rules={[{ required: true, message: "상품 사이즈1 을 입력해주세요" }]}
        >
          <Input
            className="product-size1"
            size="large"
            placeholder="상품사이즈1 ex)Free / M / L 중1"
          />
        </Form.Item>
        {/* 재고1 */}
        <Form.Item
          name="quantity1"
          label={<div className="upload-label">상품 재고1</div>}
          rules={[{ required: true, message: "상품 재고1을 입력해주세요" }]}
        >
          <Input
            className="product-quantity1"
            size="large"
            placeholder="상품1 입고된 수량입력"
          />
        </Form.Item>
        {/* 상품사이즈1_2 */}
        <Form.Item
          name="size1_2"
          label={<div className="upload-label">상품 사이즈1_2</div>}
          rules={[{ required: false, message: "상품 사이즈1_2 을 입력해주세요" }]}
        >
          <Input
            className="product-size1_2"
            size="large"
            placeholder="상품사이즈1_2 ex)Free / M / L 중1"
          />
        </Form.Item>
        {/* 재고1_2 */}
        <Form.Item
          name="quantity1_2"
          label={<div className="upload-label">상품 재고1_2</div>}
          rules={[{ required: false, message: "상품 재고1_2를 입력해주세요" }]}
        >
          <Input
            className="product-quantity1_2"
            size="large"
            placeholder="상품1_2 입고된 수량입력"
          />
        </Form.Item>
        {/* 상품사이즈1_3 */}
        <Form.Item
          name="size1_3"
          label={<div className="upload-label">상품 사이즈1_3</div>}
          rules={[{ required: false, message: "상품 사이즈1_3 을 입력해주세요" }]}
        >
          <Input
            className="product-size1_3"
            size="large"
            placeholder="상품사이즈1 ex)Free / M / L 중1"
          />
        </Form.Item>
        {/* 재고1 */}
        <Form.Item
          name="quantity1_3"
          label={<div className="upload-label">상품 재고1_3</div>}
          rules={[{ required: false, message: "상품 재고1_3을 입력해주세요" }]}
        >
          <Input
            className="product-quantity1"
            size="large"
            placeholder="상품1_3 입고된 수량입력"
          />
        </Form.Item>
        <Divider />
        {/* 상품컬러2 */}
        <Form.Item
          name="color2"
          label={<div className="upload-label">상품 컬러2</div>}
          rules={[{ required: false, message: "상품 컬러2를 입력해주세요" }]}
        >
          <Input
            className="product-color2"
            size="large"
            placeholder="상품컬러2 ex) #000000 "
          />
        </Form.Item>
        {/* 상품컬러이름2 */}
        <Form.Item
          name="colorName2"
          label={<div className="upload-label">상품 컬러이름2</div>}
          rules={[{ required: false, message: "상품 컬러이름2 을 입력해주세요" }]}
        >
          <Input
            className="product-colorName2"
            size="large"
            placeholder="상품컬러이름2 ex) 라이트블루 "
          />
        </Form.Item>
        {/* 상품사이즈2 */}
        <Form.Item
          name="size2"
          label={<div className="upload-label">상품 사이즈2</div>}
          rules={[{ required: false, message: "상품 사이즈2 를 입력해주세요" }]}
        >
          <Input
            className="product-size2"
            size="large"
            placeholder="상품사이즈2 ex)Free / M / L 중1"
          />
        </Form.Item>
        {/* 재고2 */}
        <Form.Item
          name="quantity2"
          label={<div className="upload-label">상품 재고2</div>}
          rules={[{ required: false, message: "상품 재고2을 입력해주세요" }]}
        >
          <Input
            className="product-quantity2"
            size="large"
            placeholder="상품2 입고된 수량입력"
          />
        </Form.Item>
        {/* 상품사이즈2 */}
        <Form.Item
          name="size2_2"
          label={<div className="upload-label">상품 사이즈2_2</div>}
          rules={[{ required: false, message: "상품 사이즈2_2 를 입력해주세요" }]}
        >
          <Input
            className="product-size2_2"
            size="large"
            placeholder="상품사이즈2_2 ex)Free / M / L 중1"
          />
        </Form.Item>
        {/* 재고2 */}
        <Form.Item
          name="quantity2_2"
          label={<div className="upload-label">상품 재고2_2</div>}
          rules={[{ required: false, message: "상품 재고2_2을 입력해주세요" }]}
        >
          <Input
            className="product-quantity2_2"
            size="large"
            placeholder="상품2_2 입고된 수량입력"
          />
        </Form.Item>
        {/* 상품사이즈2_3 */}
        <Form.Item
          name="size2_3"
          label={<div className="upload-label">상품 사이즈2_3</div>}
          rules={[{ required: false, message: "상품 사이즈2_3 를 입력해주세요" }]}
        >
          <Input
            className="product-size2_3"
            size="large"
            placeholder="상품사이즈2 ex)Free / M / L 중1"
          />
        </Form.Item>
        {/* 재고2 */}
        <Form.Item
          name="quantity2_3"
          label={<div className="upload-label">상품 재고2_3</div>}
          rules={[{ required: false, message: "상품 재고2_3을 입력해주세요" }]}
        >
          <Input
            className="product-quantity2"
            size="large"
            placeholder="상품2_3 입고된 수량입력"
          />
        </Form.Item>
        <Divider />
        {/* 상품컬러3 */}
        <Form.Item
          name="color3"
          label={<div className="upload-label">상품 컬러3</div>}
          rules={[{ required: false, message: "상품 컬러3를 입력해주세요" }]}
        >
          <Input
            className="product-color3"
            size="large"
            placeholder="상품컬러3 ex) #000000 "
          />
        </Form.Item>
        {/* 상품컬러이름3 */}
        <Form.Item
          name="colorName3"
          label={<div className="upload-label">상품 컬러이름3</div>}
          rules={[{ required: false, message: "상품 컬러이름3 을 입력해주세요" }]}
        >
          <Input
            className="product-colorName3"
            size="large"
            placeholder="상품컬러이름3 ex) 라이트블루 "
          />
        </Form.Item>
        {/* 상품사이즈3 */}
        <Form.Item
          name="size3"
          label={<div className="upload-label">상품 사이즈3</div>}
          rules={[{ required: false, message: "상품 사이즈3 를 입력해주세요" }]}
        >
          <Input
            className="product-size3"
            size="large"
            placeholder="상품사이즈3 ex)Free / M / L 중1"
          />
        </Form.Item>
        {/* 재고3 */}
        <Form.Item
          name="quantity3"
          label={<div className="upload-label">상품 재고3</div>}
          rules={[{ required: false, message: "상품 재고3을 입력해주세요" }]}
        >
          <Input
            className="product-quantity3"
            size="large"
            placeholder="상품3 입고된 수량입력"
          />
        </Form.Item>
        <Divider />
        {/* 상품사이즈3_2 */}
        <Form.Item
          name="size3_2"
          label={<div className="upload-label">상품 사이즈3_2</div>}
          rules={[{ required: false, message: "상품 사이즈3_2 를 입력해주세요" }]}
        >
          <Input
            className="product-size3_2"
            size="large"
            placeholder="상품사이즈3_2 ex)Free / M / L 중1"
          />
        </Form.Item>
        {/* 재고3_2 */}
        <Form.Item
          name="quantity3_2"
          label={<div className="upload-label">상품 재고3_2</div>}
          rules={[{ required: false, message: "상품 재고3_2을 입력해주세요" }]}
        >
          <Input
            className="product-quantity3_2"
            size="large"
            placeholder="상품3_2 입고된 수량입력"
          />
        </Form.Item>
        <Divider />
        {/* 상품사이즈3_3 */}
        <Form.Item
          name="size3_3"
          label={<div className="upload-label">상품 사이즈3_3</div>}
          rules={[{ required: false, message: "상품 사이즈3_3 를 입력해주세요" }]}
        >
          <Input
            className="product-size3_3"
            size="large"
            placeholder="상품사이즈3_3 ex)Free / M / L 중1"
          />
        </Form.Item>
        {/* 재고3_3 */}
        <Form.Item
          name="quantity3_3"
          label={<div className="upload-label">상품 재고3_3</div>}
          rules={[{ required: false, message: "상품 재고3_3을 입력해주세요" }]}
        >
          <Input
            className="product-quantity3_3"
            size="large"
            placeholder="상품3_3 입고된 수량입력"
          />
        </Form.Item>
        <Divider />
        {/* 상품소개 */}
        {/* <Form.Item
          name="description"
          label={<div className="upload-label">상품 소개</div>}
          rules={[{ required: true, message: "상품 소개를 입력해주세요." }]}
        >
          <Input.TextArea
            size="large"
            id="product-description"
            showCount
            maxLength={300}
            placeholder="상품 소개를 적어주세요."
          >
            
          </Input.TextArea>
          
        </Form.Item> */}
        <Divider />
        {/* 위지윅 에디터  */}
        <Form.Item

          name="description2"
          label={<div className="upload-label">상품 소개</div>}
          rules={[{ required: false, message: "상품설명을 입력해주세요" }]}
        >
          <Input.TextArea
            style={{display:"none"}}
            size="large"
            id="product-description"
            showCount
            maxLength={300}
            placeholder="상품 소개를 적어주세요."
            value={htmlContent}
            onChange={setHtmlContent}
          />
          <QuillEditor  quillRef={quillRef} htmlContent={htmlContent} setHtmlContent={setHtmlContent} api=""/>
        </Form.Item>
        <Divider />
        {/* 제품 등록 */}
        <Form.Item>
          <Button id="submit-button" size="large" htmlType="submit">
            제품 등록하기
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UploadPage;