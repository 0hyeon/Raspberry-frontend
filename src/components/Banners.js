import "antd/dist/antd.css";
import { Form, Divider, Input, InputNumber, Button, Upload, message } from "antd";
import "../css/Admin.css";
// import { ForkOutlined } from "@ant-design/icons";
import { useState } from "react";
import {API_URL} from "../config/constants.js";
import axios from 'axios';
import { useHistory }from "react-router-dom";

function UploadPage() {
  const [imageUrl, setImageUrl] = useState(null);
  const history = useHistory();//리액트훅

  const onSubmit = (values) => {//제출
    axios.post(`${API_URL}/banners`,{
    //   imageUrl : values.imageUrl,
      imageUrl : imageUrl,
      href : values.href,
    //   description : values.description,
    //   seller : values.seller,
    //   price :  parseInt(values.price),
    
    }).then((result) =>{
      console.log(result);//제출 잘됐으면 리디렉션
      history.replace('/');//이전페이지의 기록이 사라지고 대체됨
    }).catch((error) => {
      console.log(error);
      message.error(`에러가 발생했습니다. ${error.message}`)
    });
    ;
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
  return (
    <div id="upload-container">
      <Form name="상품 업로드" onFinish={onSubmit}>
        <Form.Item
          name="upload"
          label={<div className="upload-label">상품 사진</div>}
        >
          <Upload name="image" action={`${API_URL}/imageBanner`} listType="picture" showUploadList={false} onChange={onChangeImage}>
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
        </Form.Item>
        <Divider />
        <Form.Item
          label={<div className="upload-label">링크</div>}
          name="href"
          rules={[{ required: true, message: "이동할 링크를 입력해주세요" }]}
        >
          <Input
            className="upload-href"
            size="large"
            placeholder="링크를 입력해주세요."
          />
        </Form.Item>
        <Divider />
        <Form.Item>
          <Button id="submit-button" size="large" htmlType="submit">
            배너 등록하기
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UploadPage;