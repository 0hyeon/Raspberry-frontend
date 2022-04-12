import "antd/dist/antd.css";
import { Form, Divider, Input, InputNumber, Button, Upload, message, Select } from "antd";
import "../css/ProductsUpdate.css";
// import { ForkOutlined } from "@ant-design/icons";
import React,{ useState, useEffect, useRef } from "react";
import {API_URL} from "../config/constants.js";
import axios from 'axios';
import { useHistory,useParams }from "react-router-dom";
import { useSelector, connect,useDispatch } from 'react-redux';
import {removeSelectedProduct, selectedProduct} from '../_actions/userAction'
import QuillEditor from "./editor/QuillEditor"
import QuillEditor2 from "./editor/QuillEditor2"
import jwt_decode from "jwt-decode";

function ProductsUpdate() {
  
  const dispatch = useDispatch();
  const products = useSelector((state) => state.allProducts.products);
  let Session = sessionStorage.getItem('user_id');
  const { id } = useParams();
  // console.log(id); //문자 
  // console.log(products);
  
  const { Option } = Select;
  const [form] = Form.useForm()
  const [isselectVal, setselectVal ] = useState(null);
  function handleChange(value) {
    // console.log(`selected ${value}`);
    setselectVal(value);
    //console.log(isselectVal);
  }

  const updateProduct = products.products && products.products.find((item) => String(item.id) === String(id)); 
  // console.log("updateProduct :",updateProduct);
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
  
  const [isSeller, setSeller] = useState(updateProduct && updateProduct.seller); 
  const [isPrice, setPrice] = useState(updateProduct && updateProduct.price);
  const [isName, setName] = useState(updateProduct && updateProduct.name);

  const [imageUrl, setImageUrl] = useState(updateProduct && updateProduct.imageUrl);
  const [imageUrl2, setImageUrl2] = useState(updateProduct && updateProduct.imageUrl2);
  const [imageUrl3, setImageUrl3] = useState(updateProduct && updateProduct.imageUrl3);
  const [imageUrl4, setImageUrl4] = useState(updateProduct && updateProduct.imageUrl4);
  const [imageUrl5, setImageUrl5] = useState(updateProduct && updateProduct.imageUrl5);
  const [detailPage1, setDetailPage1] = useState(updateProduct && updateProduct.detailPage1);
  const [detailPage2, setDetailPage2] = useState(updateProduct && updateProduct.detailPage2);
  const [detailPage3, setDetailPage3] = useState(updateProduct && updateProduct.detailPage3);
  const [detailPage4, setDetailPage4] = useState(updateProduct && updateProduct.detailPage4);
  const [detailPage5, setDetailPage5] = useState(updateProduct && updateProduct.detailPage5);
  
  const [isColor1, setColor1] = useState(updateProduct && updateProduct.color1);
  
  
  const [isColorName1, setColorName1] = useState(null);
  const [isColorSize1, setColorSize1] = useState(updateProduct && updateProduct.size1);
  
  
  const [htmlContent, setHtmlContent] = useState(updateProduct && updateProduct.description); //🌈
  const [htmlContent2, setHtmlContent2] = useState(""); //🌈

  const quillRef = useRef(); //🌈
  const quillRef2 = useRef(); //🌈
  const history = useHistory();//리액트훅   
  
  const defaultValues = {
    
    seller : isSeller ? isSeller : '',
    price : isPrice ? isPrice :'',
    name : isName ? isName :'',
    description : htmlContent ? htmlContent :'',
    color1 : isColor1 ? isColor1 :'',
    colorName1 : isColorName1 ? isColorName1 :'',
    // size1 : isSeller ? isSeller :'',
    // quantity1 : isSeller ? isSeller :'',
    // size1_2 : isSeller ? isSeller :'',
    // quantity1_2 : isSeller ? isSeller :'',
    // size1_3 : isSeller ? isSeller :'',
    // quantity1_3 : isSeller ? isSeller :'',
    // color2 : isSeller ? isSeller :'',
    // colorName2 : isSeller ? isSeller :'',
    // size2 : isSeller ? isSeller :'',
    // quantity2 : isSeller ? isSeller :'',
    // size2_2 : isSeller ? isSeller :'',
    // quantity2_2 : isSeller ? isSeller :'',
    // size2_3 : isSeller ? isSeller :'',
    // quantity2_3 : isSeller ? isSeller :'',
    // color3 : isSeller ? isSeller :'',
    // colorName3 : isSeller ? isSeller :'',
    // size3 : isSeller ? isSeller :'',
    // quantity3 : isSeller ? isSeller :'',
    // size3_2 : isSeller ? isSeller :'',
    // quantity3_2 : isSeller ? isSeller :'',
    // size3_3 : isSeller ? isSeller :'',
    // quantity3_3 : isSeller ? isSeller :'',
    // imageUrl : isSeller ? isSeller :'',
    // imageUrl2 : isSeller ? isSeller :'',
    // imageUrl3 : isSeller ? isSeller :'',
    // imageUrl4 : isSeller ? isSeller :'',
    // imageUrl5 : isSeller ? isSeller :'',
    // detailPage1 : isSeller ? isSeller :'',
    // detailPage2 : isSeller ? isSeller :'',
    // detailPage3 : isSeller ? isSeller :'',
    // detailPage4 : isSeller ? isSeller :'',
    // detailPage5 : isSeller ? isSeller :'',
    // sizeDesc : isSeller ? isSeller :'',
    // relateProduct1 : isSeller ? isSeller :'',
    // relateProduct2 : isSeller ? isSeller :'',
    // relateProduct3 : isSeller ? isSeller :'',
    // relateProduct4 : isSeller ? isSeller :'',
    // relateProduct5 : isSeller ? isSeller :'',
    // category : isSeller ? isSeller :'',
  }

  const onSubmit = (values) => {//제출
    // if(imageUrl == null){
    //   setImageUrl(updateProduct.imageUrl);
    //   console.log(imageUrl)

    // }
    const editor_wysywic = document.getElementById("product-description").value
    const editor_wysywic2 = document.getElementById("product-description2").value
    // console.log("values.name.length : ",values.name.length);
    if(values.name.length < 2 || values.name.length > 38){
    alert('상품명 2 ~ 37자 사이로 입력해주세요.');
      return;
    }
    
    axios.post(`${API_URL}/v1/product/Updateproducts/${id}`,{
      name : defaultValues.name,
      description : editor_wysywic,
      seller : defaultValues.seller,
      price :  parseInt(values.price),
      color1 : defaultValues.color1,
      colorName1 : defaultValues.colorName1,
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
      detailPage1 : detailPage1,
      detailPage2 : detailPage2,
      detailPage3 : detailPage3,
      detailPage4 : detailPage4,
      detailPage5 : detailPage5,
      sizeDesc : editor_wysywic2,
      relateProduct1 : parseInt(values.relateProduct1),
      relateProduct2 : parseInt(values.relateProduct2),
      relateProduct3 : parseInt(values.relateProduct3),
      relateProduct4 : parseInt(values.relateProduct4),
      relateProduct5 : parseInt(values.relateProduct5),
      category : isselectVal,
      soldout : 1,
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
  const onChangeDetailPage1 = (info) => {
    if(info.file.status === 'uploading'){
      return;
    }
    if(info.file.status === 'done'){
      const response = info.file.response;
      const detailPage1 = response.detailPage1;
      setDetailPage1(detailPage1);
    }
  }
  const onChangeDetailPage2 = (info) => {
    if(info.file.status === 'uploading'){
      return;
    }
    if(info.file.status === 'done'){
      const response = info.file.response;
      const detailPage2 = response.detailPage2;
      setDetailPage2(detailPage2);
    }
  }
  const onChangeDetailPage3 = (info) => {
    if(info.file.status === 'uploading'){
      return;
    }
    if(info.file.status === 'done'){
      const response = info.file.response;
      const detailPage3 = response.detailPage3;
      setDetailPage3(detailPage3);
    }
  }
  const onChangeDetailPage4 = (info) => {
    if(info.file.status === 'uploading'){
      return;
    }
    if(info.file.status === 'done'){
      const response = info.file.response;
      const detailPage4 = response.detailPage4;
      setDetailPage4(detailPage4);
    }
  }
  const onChangeDetailPage5 = (info) => {
    if(info.file.status === 'uploading'){
      return;
    }
    if(info.file.status === 'done'){
      const response = info.file.response;
      const detailPage5 = response.detailPage5;
      setDetailPage5(detailPage5);
    }
  }
  
  const onChangeSeller = (e) => {
    setSeller(e.target.value);
    console.log('setSeller : ',e.target.value);
  }
  const onChangePrice = (e) => {
    setPrice(e.target.value);
    console.log('setPrice : ',e.target.value);
  }
  const onChangeName = (e) => {
    setName(e.target.value);
    console.log('setName : ',e.target.value);
  }
  const onChangeColor1 = (e) => {
    setColor1(e.target.value);
    console.log('setName : ',e.target.value);
  }
  const onChangeColorName1 = (e) => {
    setColorName1(e.target.value);
    console.log('setName : ',e.target.value);
  }

  const fetchProductDetail = async () => {
    dispatch(removeSelectedProduct());
    await axios
      .get(`${API_URL}/v1/product/products/${id}`)
      .then(function(result){
        // const products = result.data.products;
        // setProducts(products);
        // console.log(result.data);
        dispatch(selectedProduct(result.data));
    })
    .catch((err) => {
        console.log("Err: ", err);
    });
    
    // dispatch(setProducts(result.data));
  };
  // const onChangePrice = (Change) => {
  //   setPdprice(Change);
  // }
  useEffect(() => {
    fetchProductDetail();
    setSeller(updateProduct && updateProduct.seller);
    setPrice(updateProduct && updateProduct.price);
    setName(updateProduct && updateProduct.name);
    
    if(updateProduct.color1 !== null){
      setColor1(updateProduct && updateProduct.color1[0]);
    }
    //colorName1 상태관리 업데이트
    if(updateProduct.colorName1 !== null){
      const ObjectPaerse = JSON.parse(updateProduct.colorName1);
      setColorName1(ObjectPaerse[0]);
    }else{
      setColorName1("");
    }
    
    form.setFieldsValue(defaultValues)
  },[isColorName1]);
  console.log("updateProduct :",updateProduct);
  if (products === null) {
    return <h1>상품 정보를 받고 있습니다...</h1>;
  }
  if(isColorName1 == null){
    return <h1>상품 컬러네임음 받고 있습니다...</h1>;
  }
  return (
    <div id="upload-container">
      <Form 
        name="상품 업로드" 
        initialValues={defaultValues}
        onFinish={onSubmit}
      >
        {/* 메인사진 */}
        <Form.Item
          name="upload"
          label={<div className="upload-label">상품 사진</div>}
        >
          <Upload name="image" action={`${API_URL}/image`} listType="picture" showUploadList={false} onChange={onChangeImage}>
            {
              imageUrl ? (
                <img id="upload-img" src= {
                  process.env.NODE_ENV === 'production'
                  ?`${imageUrl}`
                  :`${API_URL}/${imageUrl}`
                } alt="."/> 
              ) : (
              <div id="upload-img-placeholder">
                <img src= {
                  process.env.NODE_ENV === 'production'
                  ?`${updateProduct.imageUrl}`
                  :`${API_URL}/${updateProduct.imageUrl}`
                } alt="."/>
                <span>이미지를 업로드해주세요.</span>
              </div>
              )
            }
          </Upload>
          <Upload name="image" action={`${API_URL}/image2`} listType="picture" showUploadList={false} onChange={onChangeImage2}>
            {
              imageUrl2 ? (
                <img id="upload-img" src= {
                  process.env.NODE_ENV === 'production'
                  ?`${imageUrl2}`
                  :`${API_URL}/${imageUrl2}`} alt="."/> 
              ) : (
              <div id="upload-img-placeholder">
                <img src={
                  process.env.NODE_ENV === 'production'
                  ?`${updateProduct.imageUrl2}`
                  :`${API_URL}/${updateProduct.imageUrl2}`} alt="."/>
                <span>이미지를 업로드해주세요.</span>
              </div>
              )
            }
          </Upload>
          <Upload name="image" action={`${API_URL}/image3`} listType="picture" showUploadList={false} onChange={onChangeImage3}>
            {
              imageUrl3 ? (
                <img id="upload-img" src= {
                  process.env.NODE_ENV === 'production'
                  ?`${imageUrl3}`
                  :`${API_URL}/${imageUrl3}`} alt="."/> 
              ) : (
              <div id="upload-img-placeholder">
                <img src={
                  process.env.NODE_ENV === 'production'
                  ?`${updateProduct.imageUrl3}`
                  :`${API_URL}/${updateProduct.imageUrl3}`} alt="."/>
                <span>이미지를 업로드해주세요.</span>
              </div>
              )
            }
          </Upload>
          <Upload name="image" action={`${API_URL}/image4`} listType="picture" showUploadList={false} onChange={onChangeImage4}>
            {
              imageUrl4 ? (
                <img id="upload-img" src= {
                  process.env.NODE_ENV === 'production'
                  ?`${imageUrl4}`
                  :`${API_URL}/${imageUrl4}`} alt="."/> 
              ) : (
              <div id="upload-img-placeholder">
                <img src={
                  process.env.NODE_ENV === 'production'
                  ?`${updateProduct.imageUrl4}`
                  :`${API_URL}/${updateProduct.imageUrl4}`} alt="."/>
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
                  <video id="upload-img" src= {
                    process.env.NODE_ENV === 'production'
                    ?`${imageUrl5}`
                    :`${API_URL}/${imageUrl5}`} alt="."/> 
                ) : (
                <div id="upload-img-placeholder">
                  <img src={
                    process.env.NODE_ENV === 'production'
                    ?`${updateProduct.imageUrl5}`
                    :`${API_URL}/${updateProduct.imageUrl5}`} alt="."/>
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
        <Upload name="image" action={`${API_URL}/detailPage1`} listType="picture" showUploadList={false} onChange={onChangeDetailPage1}>
            {
              detailPage1 ? (
                <img id="upload-img" src= {
                  process.env.NODE_ENV === 'production'
                  ?`${detailPage1}`
                  :`${API_URL}/${detailPage1}`} alt="."/> 
              ) : (
              <div id="upload-img-placeholder">
                <img src={
                  process.env.NODE_ENV === 'production'
                  ?`${updateProduct.detailPage1}`
                  :`${API_URL}/${updateProduct.detailPage1}`} alt="."/>
                <span>이미지를 업로드해주세요.</span>
              </div>
              )
            }
          </Upload>
        <Upload name="image" action={`${API_URL}/detailPage2`} listType="picture" showUploadList={false} onChange={onChangeDetailPage2}>
            {
              detailPage2 ? (
                <img id="upload-img" src= {
                  process.env.NODE_ENV === 'production'
                  ?`${detailPage2}`
                  :`${API_URL}/${detailPage2}`} alt="."/> 
              ) : (
              <div id="upload-img-placeholder">
                <img src={
                  process.env.NODE_ENV === 'production'
                  ?`${updateProduct.detailPage2}`
                  :`${API_URL}/${updateProduct.detailPage2}`} alt="."/>
                <span>이미지를 업로드해주세요.</span>
              </div>
              )
            }
          </Upload>
        <Upload name="image" action={`${API_URL}/detailPage3`} listType="picture" showUploadList={false} onChange={onChangeDetailPage3}>
            {
              detailPage3 ? (
                <img id="upload-img" src= {
                  process.env.NODE_ENV === 'production'
                  ?`${detailPage3}`
                  :`${API_URL}/${detailPage3}`} alt="."/> 
              ) : (
              <div id="upload-img-placeholder">
                <img src={`${API_URL}/${updateProduct.detailPage3}`} alt="."/>
                <span>이미지를 업로드해주세요.</span>
              </div>
              )
            }
          </Upload>
        <Upload name="image" action={`${API_URL}/detailPage4`} listType="picture" showUploadList={false} onChange={onChangeDetailPage4}>
            {
              detailPage4 ? (
                <img id="upload-img" src= {
                  process.env.NODE_ENV === 'production'
                  ?`${detailPage4}`
                  :`${API_URL}/${detailPage4}`} alt="."/> 
              ) : (
              <div id="upload-img-placeholder">
                <img src={`${API_URL}/${updateProduct.detailPage4}`} alt="."/>
                <span>이미지를 업로드해주세요.</span>
              </div>
              )
            }
          </Upload>
        <Upload name="image" action={`${API_URL}/detailPage5`} listType="picture" showUploadList={false} onChange={onChangeDetailPage5}>
            {
              detailPage5 ? (
                <img id="upload-img" src= {
                  process.env.NODE_ENV === 'production'
                  ?`${detailPage5}`
                  :`${API_URL}/${detailPage5}`} alt="."/> 
              ) : (
              <div id="upload-img-placeholder">
                <img src={`${API_URL}/${updateProduct.detailPage5}`} alt="."/>
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
            placeholder={updateProduct.seller}
            onChange={(e)=>onChangeSeller(e)}
            defaultValue={isSeller?isSeller:null}
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
            placeholder={updateProduct.name}
            onChange={(e)=>onChangeName(e)}
            defaultValue={isName?isName:null}
          />
        </Form.Item>
        <Divider />
        {/* 상품가격 */}
        <Form.Item
          name="price"
          label={<div className="upload-label">상품 가격</div>}
          rules={[{ required: true, message: "상품 가격을 입력해주세요" }]}
        >
          <Input
            className="product-price" 
            size="large" 
            placeholder={updateProduct.price}
            onChange={(e) => onChangePrice(e)}
            defaultValue={isPrice?isPrice:null}
          />
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
            placeholder={updateProduct.color1}
            onChange={(e)=>onChangeColor1(e)}
            defaultValue={isColor1?isColor1:null}
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
            placeholder={updateProduct.colorName1}
            onChange={(e)=>onChangeColorName1(e)}
            defaultValue={isColorName1?isColorName1:null}
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
            placeholder={updateProduct.size1}
            // onChange={(e)=>onChangeColorName1(e)}
            defaultValue={isColorSize1?isColorSize1:null}
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
            placeholder={updateProduct.quantity1}
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
            placeholder={updateProduct.size1_2}
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
            placeholder={updateProduct.quantity1_2}
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
            placeholder={updateProduct.size1_3}
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
            placeholder={updateProduct.quantity1_3}
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
            placeholder={updateProduct.color2}
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
            placeholder={updateProduct.colorName2}
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
            placeholder={updateProduct.size2}
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
            placeholder={updateProduct.quantity2}
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
            placeholder={updateProduct.size2_2}
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
            placeholder={updateProduct.quantity2_2}
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
            placeholder={updateProduct.size2_3}
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
            placeholder={updateProduct.quantity2_3}
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
            placeholder={updateProduct.color3}
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
            placeholder={updateProduct.colorName3}
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
            placeholder={updateProduct.size3}
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
            placeholder={updateProduct.quantity3}
          />
        </Form.Item>
        {/* 상품사이즈3_2 */}
        <Form.Item
          name="size3_2"
          label={<div className="upload-label">상품 사이즈3_2</div>}
          rules={[{ required: false, message: "상품 사이즈3_2 를 입력해주세요" }]}
        >
          <Input
            className="product-size3_2"
            size="large"
            placeholder={updateProduct.size3_2}
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
            placeholder={updateProduct.quantity3_2}
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
            placeholder={updateProduct.size3_2}
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
            placeholder={updateProduct.quantity3_3}
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
            placeholder={updateProduct.description}
            defaultValue={updateProduct.description}
          />
        </Form.Item> */}
         {/* 위지윅 에디터  */}
        <Form.Item
          name="description2"
          label={<div className="upload-label">상품 소개</div>}
          rules={[{ required: false, message: "상품 소개를 입력해주세요" }]}
        >
          <Input.TextArea
            style={{display:"none"}}
            size="large"
            id="product-description"
            showCount
            maxLength={300}
            placeholder={updateProduct.description}
            value={htmlContent}
            onChange={setHtmlContent}
          />
          <QuillEditor  quillRef={quillRef} htmlContent={htmlContent} setHtmlContent={setHtmlContent} api=""/>
        </Form.Item>
        <Divider />
        {/* 사이즈 */}
        <Divider />
        <Form.Item
          name="sizeDesc"
          label={<div className="upload-label">상품 사이즈</div>}
          rules={[{ required: false, message: "상품 사이즈를 입력해주세요" }]}
        >
          <Input.TextArea
            name="sizeDesc"
            style={{display:"none"}}
            size="large"
            id="product-description2"
            showCount
            maxLength={300}
            placeholder="상품 사이즈를 입력해주세요."
            value={htmlContent2}
            onChange={setHtmlContent2}
          />
          <QuillEditor2  quillRef2={quillRef2} htmlContent2={htmlContent2} setHtmlContent2={setHtmlContent2} api2=""/>
        </Form.Item>
        {/* 카테고리분류 */}
        <Form.Item
          name="category"
          label={<div className="upload-label">카테고리 분류</div>}
          rules={[{ required: true, message: "카테고리를 등록하세요" }]}
        >
          <Select defaultValue="disabled" style={{ width: 120 }} onChange={handleChange} value={isselectVal}>
            <Option value="disabled" disabled>
              Disabled
            </Option>
            <Option value="New">New</Option>
            <Option value="Outerwear">Outerwear</Option>
            <Option value="Tops">Tops</Option>
          </Select>
        </Form.Item>
        <Divider />
        {/* 연관상품 */}
        <Form.Item
          name="relateProduct1"
          label={<div className="upload-label">관련상품1</div>}
        >
          <Input
            className="relateProduct1"
            size="large"
            placeholder={updateProduct.relateProduct1}
          />
        </Form.Item>
        <Form.Item
          name="relateProduct2"
          label={<div className="upload-label">관련상품2</div>}
        >
          <Input
            className="relateProduct2"
            size="large"
            placeholder={updateProduct.relateProduct2}
          />
        </Form.Item>
        <Form.Item
          name="relateProduct3"
          label={<div className="upload-label">관련상품3</div>}
        >
          <Input
            className="relateProduct3"
            size="large"
            placeholder={updateProduct.relateProduct3}
          />
        </Form.Item>
        <Form.Item
          name="relateProduct4"
          label={<div className="upload-label">관련상품4</div>}
        >
          <Input
            className="relateProduct4"
            size="large"
            placeholder={updateProduct.relateProduct4}
          />
        </Form.Item>
        <Form.Item
          name="relateProduct5"
          label={<div className="upload-label">관련상품5</div>}
        >
          <Input
            className="relateProduct5"
            size="large"
            placeholder={updateProduct.relateProduct5}
          />
        </Form.Item>
        {/* 제품 등록 */}
        <Divider />
        <Form.Item>
          <Button id="submit-button" size="large" htmlType="submit">
            제품 등록하기
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    allProducts: state.allProducts
  }
}

export default connect(mapStateToProps)(ProductsUpdate);