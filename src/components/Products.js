import React from 'react';
import { useParams, useHistory,Link, Switch, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef} from "react";
import "../css/Products.css";
import {API_URL} from "../config/constants";
import dayjs from 'dayjs';

import { useDispatch,useSelector, connect } from 'react-redux';
// import MainPage from "./MainPage";
import {addToCart, setProducts, selectedProduct, removeSelectedProduct, decideToCart, setCartItem, setRequestLoding, setRequestLoding2,fetchCartItem,totalprice} from '../_actions/userAction'

//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";	// 추가


import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "../css/Swiper_custom.css";
import { Button, message } from "antd";
import Payment from "./Payment";
function ProductPage() {
  
  const history = useHistory();//리액트훅
  // console.log("props.allProducts.cartItem : ", props.allProducts.cartItem);
  let state = useSelector(state => state);
  const whyerrorObject = state.allProducts.products.products;
  const [iswhyerrorObject, setwhyerrorObject] = useState(null);
  // console.log("products", products);
  const { id } = useParams();//파라미터를 가져옴
  // const [product, setProduct] = useState(null);
  
  const [product, setProduct] = React.useState([]);// state형태
  const [isColor, setIsColor] = useState(false);
  const [isRectheight, setRectheight] = useState(false);

  //color state 영역
  const [currentClick, setCurrentClick] = useState(null);
  const [currentClick2, setCurrentClick2] = useState(null);
  const [prevClick, setPrevClick] = useState(null);
  const [prevClick2, setPrevClick2] = useState(null);
  
  // fetchProduct all 
  const [loading, setLoading] = useState(false);
  //사이즈선택후, 카트리스트 ui
  const [isCartUi_View, setCartUi_View] = useState(false);
  // 카트리스트 숫자 + / -
  const [isCartUi, setCartUi] = useState(1);
  //상품사이즈 영역 
  const [currentSize, setCurrentSize] = useState(null);
  const [prevSize, setPrevSize] = useState(null);

  //fetch로 color name 상태관리 -> 스카이블루 
  const [isColorName, setColorName] = useState(null);
  
  //컬러 클릭후 사이즈 보여주기 -> Free , m
  const [isShowSizeName, setShowSizeName] = useState(null);

  //단순히 사이즈ui  보여주는 상태관리 isShowSize == 컬러이름이면 사이즈 show 
  const [isShowSize, setShowSize] = useState(false);
  //Cart Ui value number quanity

  //detail total price
  const [istotalPrice, settotalPrice] = useState(null);

  //스크롤 시 상품off 잡아 Add class 
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isProductColor,setProductColor] = useState(null);
  //장바구니 
  
  const parentRef   = useRef(null);
  const clientRectheight   = useRef(null);
  //장바구니
  
  // color
  const [scrollFlag, setScrollFlag] = useState(false);
  const [scrollFlag2, setScrollFlag2] = useState(false);
  
  let Session = sessionStorage.getItem('user_id');
  // statrt
  
  const dispatch = useDispatch();
  //장바구니담기후 장바구니 목록 불러오기
  const fetchCartItem = async () => {

    let Session = sessionStorage.getItem('user_id');
    let body = {
      seSsionId: Session
      // heyt: session_redux
    }
    // dispatch(setRequestLoding())//loding true로 장바구니 랜더링
    await axios
      .post(`${API_URL}/v1/cart/setCartItem`, body)
      .then(function(result){
        dispatch(setCartItem(result.data));
    })
    .catch((err) => {
        console.log("Err: ", err);
        dispatch(setRequestLoding2())//loding true로 장바구니 랜더링
    });
    
    // dispatch(setProducts(result.data));
  };
  
  //장바구니 가져올수있는지 
  const youCanAddToCart = async () => {
    let Session = sessionStorage.getItem('user_id');
    let body = {
      productId: id,
      seSsionId: Session,
      it_Detail_color: isColorName,
      it_Detail_size : isShowSizeName, 
    }
    await axios
      .post(`${API_URL}/v1/cart/addToCart`, body)
      .then(function(result){
      dispatch(addToCart(result.data));
    })
    .catch((err) => {
        console.log("Err: ", err);
    });
};

  const clickHandler = () => {

    if (Session == null){
      alert('로그인을 해주셔야 합니다.')
      history.push("/Login");
      return;
    }
    if(!currentClick){
      alert('상품컬러를 선택하세요.')
      return;
    }
    if(!currentClick2){
      alert('사이즈를 선택하세요.')
      return;
    }
    // server axios cart data
    decideToCartItem();

    //total price dispatch
    if (state.allProducts.cartItem3.msg == "장바구니 저장완료" ){
      dispatch(totalprice(istotalPrice));
    }

    // console.log("props : ",props);
    console.log("state : ",state);
    // alert(state.allProducts.cartItem3.msg);
    if(window.confirm(state.allProducts.cartItem3.msg + '.  장바구니로 이동 하시겠습니까?')){
      history.push("/CartPage");
    }else{
      return;
    }
  }
  // console.log("props : ",props);
  //   console.log("state : ",state);
  
  if(scrollFlag == null ){
    let case2 = document.getElementById("case2");
    // headerStyle.style.backgroundColor = "inherit";
    case2.style.border = "none";
  }
  if(scrollFlag2 == null ){
    let case3 = document.getElementById("case3");
    // headerStyle.style.backgroundColor = "inherit";
    case3.style.border = "none";
  }
  
  // console.log(scrollFlag);
  // console.log(scrollFlag2);
  useEffect(() => {
    
    //스크롤 잡아주는 장치
    const updateScroll = () => {
      setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    }
    
    // if(isColor){
    //   console.log('isColor is ture')      
    // }else{
    //   console.log('isColor is false');
    // }

    //스크롤 fix 이벤트 
    window.addEventListener('scroll', updateScroll);
    // console.log('scrollPosition ',scrollPosition);

    if(parentRef.current){
      let parentHeight = parentRef.current.offsetHeight;
      let parentWidth  = parentRef.current.offsetWidth;
      let parentTop  = parentRef.current.offsetTop ;

      // console.log('parentHeight : ', parentHeight);
      // console.log('parentWidth : ', parentWidth);
      // console.log('parentTop : ', parentTop);
      const target = document.getElementById('target');
      const clientRect = target.getBoundingClientRect();
      // const relativeTop = clientRect.top;   
      // console.log(clientRect.top);
      // console.log(clientRect);
      const clientRectheight = clientRect.height;
      // console.log('clientRectheight',clientRectheight);
      // const total_target = clientRect.top + clientRect.height;
      // console.log(total_target);

      // if(scrollPosition+1 > parentTop ){
      if(scrollPosition == 0){
        setRectheight(true);
      }else if(scrollPosition <= parentHeight + parentTop - 685){
        // console.log('setRectheight(true);')
        setRectheight(true);
      }else{
        setRectheight(false);
        // console.log('setRectheight(false);')
      }
    }

    let Session = sessionStorage.getItem('user_id');
    // console.log(Session);
    // console.log('product.id :',product.id);

    // console.log(Session);
    // console.log('state :', state);
    // dispatch(canAddToCart('나와라','나와라'));
    
    // dispatch(removeSelectedProduct());
    
  // },[parentRef,scrollPosition,clientRectheight,product.id]);
  },[parentRef,scrollPosition,clientRectheight]);
  // },[dispatch]);
  
  //컬러 액티브 작동   
  const GetClick = (e) => {
    if(e.target.style.backgroundColor == ""){
      return;
    }
    if (e.target.className == "detail_first_li" ){
      setCurrentClick2(null);
      setCurrentClick(e.target.id);
      if(e.target.id == "case1"){
        setColorName(product.colorName1);//스카이블루 표현
        setShowSize(product.colorName1);//size ui 보여줌 
      }else if(e.target.id == "case2"){
        setColorName(product.colorName2)
        setShowSize(product.colorName2);
      }else if(e.target.id == "case3"){
        setColorName(product.colorName3);
        setShowSize(product.colorName3);
      }
      setShowSizeName(null);
    }
    // console.log(e.target.id);
  };
  const GetClick2 = (e) => {//Size 클릭
    if (e.target.className == "detail_second_li" ){
      if(e.target.textContent == ""){
        return;
      }
      setCurrentClick2(e.target.id);//클릭시 스타일처리와 이전클릭에 사용 상태관리  
      if(isShowSize == product.colorName1){ 
        if(e.target.id == "case1_1"){
          setShowSizeName(product.size1);
        }else if (e.target.id == "case2_1"){
          setShowSizeName(product.size1_2);
        }else if (e.target.id == "case3_1"){
          setShowSizeName(product.size1_3);
        }
      }else if(isShowSize == product.colorName2){ 
        if(e.target.id == "case1_1"){
          setShowSizeName(product.size2);
        }else if (e.target.id == "case2_1"){
          setShowSizeName(product.size2_2);
        }else if (e.target.id == "case3_1"){
          setShowSizeName(product.size2_3);
        }
      }else if(isShowSize == product.colorName3){ 
        if(e.target.id == "case1_1"){
          setShowSizeName(product.size3);
        }else if (e.target.id == "case2_1"){
          setShowSizeName(product.size3_2);
        }else if (e.target.id == "case3_1"){
          setShowSizeName(product.size3_3);
        }
      }

    }
  };
  
  const fetchProducts = async () => { 
    await axios
    
      .get(`${API_URL}/v1/product/products`)
    //   .get('https://jsonplaceholder.typicode.com/posts')
      .then(function(result){
        setLoading(true);
        // const products = result.data.products;
        // setProducts(products);
        // console.log(result.data.products);
        // dispatch(setProducts(result.data));
        setLoading(false);
        // console.log(result.data.products);
        
    })
    .catch((err) => {
        console.log("Err: ", err);
    });
    
    // dispatch(setProducts(result.data));
};

  const getProduct = async() =>{//getProduct함수 `
    await axios
      .get(
        `${API_URL}/v1/product/products/${id}`//파라미터 요청
      )
      .then(function (result) {
        const product = result.data.product;
        setProduct(product);
        settotalPrice(product.price);
        setScrollFlag(product.color2)
        setScrollFlag2(product.color3)
        setProductColor(product.description);
        console.log("setProductColor" ,isProductColor);
        // console.log(product);
      })
      .catch(function (error) {
        console.error(error);
      });
      
  }
  
  
  const CartListButton = (e) => {
    if(e.target.id == "input_qty_minus"){
      if(isCartUi < 2){
        return;
      }
      setCartUi(isCartUi - 1)
      let tatalNum = isCartUi- 1;
      settotalPrice(tatalNum * product.price)
      //settotalPrice((isCartUi -1) * product.price)
    }else if(e.target.id == "input_qty_plus"){
      setCartUi(isCartUi + 1)
      let tatalNum = isCartUi + 1;
      settotalPrice(tatalNum * product.price)
    }
  }
  //select값 가져오기
  const fetchProductDetail = async () => {
    dispatch(removeSelectedProduct());
    await axios
      .get(`${API_URL}/v1/product/products/${id}`)
      .then(function(result){
        // const products = result.data.products;
        // setProducts(products);
        // console.log(result.data);
        dispatch(selectedProduct(result.data));
        // dispatch(setProducts(result.data));
    })
    .catch((err) => {
        console.log("Err: ", err);
    });
    
    // dispatch(setProducts(result.data));
  };

  //장바구니 보내기
  
  //콤마 함수
  function AddComma(value) {
    return Number(value).toLocaleString('en');
  }
  //장바구니 decide to cart 
  
  
  const decideToCartItem = async () => {
        
    let Session = sessionStorage.getItem('user_id');
    let body = {
      productId: id,
      seSsionId: Session,
      price:Number(product.price),
      uploadImage:product.imageUrl,
      productName:product.name,
      it_Detail_color: isColorName,
      it_Detail_size : isShowSizeName, 
      it_Detail_quanity: Number(isCartUi),
      //수량이랑 토탈가격 
    }
    await axios
      .post(`${API_URL}/v1/cart/decideToCart`, body)
      .then(function(result){
        dispatch(decideToCart(result.data));
    })
    .catch((err) => {
        console.log("Err: ", err);
    });
    youCanAddToCart();
    fetchCartItem();

  };
  
  useEffect(function () {
    
    
    if (currentClick !== null) {//클릭상태일경우 
        let current = document.getElementById(currentClick);
        current.style.color = "black";
        current.style.border = "3px solid";
        current.style.borderColor = "#000";
    }
    if (currentClick2 !== null) {//클릭상태일경우 
        let current2 = document.getElementById(currentClick2);
        current2.style.color = "black";
        current2.style.border = "3px solid";
        current2.style.borderColor = "#000";
        setCartUi_View(true);
    }
    setPrevClick(currentClick);
    setPrevClick2(currentClick2);
    if (prevClick !== null && prevClick !== currentClick ) {//전에 클릭했으면 작동 2번째 클릭 부터 작동  
        let prev = document.getElementById(prevClick);
        prev.style.color = "#bebcbc";
        prev.style.border = "2px solid #aaa";
        setCartUi_View(false);
    }//두번째 클릭이거나 && 두번째클릭이 색상바꾸고 같은자리 사이즈 클릭하면 스타일 안됨 

    if (prevClick2 !== null && prevClick2 !== currentClick2) {//전에 클릭했으면 작동 2번째 클릭 부터 작동  
        let prev2 = document.getElementById(prevClick2);
        prev2.style.color = "#bebcbc";
        prev2.style.border = "2px solid #aaa";
    }
    if (prevClick !== null && prevClick !== currentClick) {//전에 클릭했으면 작동 2번째 클릭 부터 작동  
      let prev3 = document.getElementById(prevClick);
      prev3.style.color = "#bebcbc";
      prev3.style.border = "2px solid #aaa";
    }
    
    
    let Session = sessionStorage.getItem('user_id');
    // dispatch(addToCart(id,Session))
    getProduct();//useEffect시 1개아이템
    youCanAddToCart();
    fetchProductDetail();//해당페이지 1아이템 
    fetchProducts();//모든 아이템
    
    if(whyerrorObject != 'undefined' && whyerrorObject != null){
      setwhyerrorObject(whyerrorObject);
    }
    setProduct(product);
  }, [isCartUi_View,prevClick,currentClick2,currentClick,id]);
  // }, [setCartUi_View,setPrevClick,prevClick,prevClick2,id]);
  // },[]);
  if (product === null || state === null) {
    return <h1>상품 정보를 받고 있습니다...</h1>;
  }
  const onClickPurchase = () =>{//구매하기 클릭이벤트
    // axios.post(`${API_URL}/purchase/${id}`).then((result)=>{
      
    //   getProduct();//구매할때 getProduct랜딩 disabled효과 
    // }).catch((error)=>{
    //   message.error(`에러가 발생했습니다. ${error.message}`)
    // })
    if (Session == null){
      alert('로그인을 해주셔야 합니다.')
      history.push("/Login");
      return;
    }
    if(!currentClick){
      alert('상품컬러를 선택하세요.')
      return;
    }
    if(!currentClick2){
      alert('사이즈를 선택하세요.')
      return;
    }
    // alert('구매하기눌림 바로 (단일상품 결제페이지로)');
    // message.info("구매가 완료되었습니다.");
    
  }
  
  return (
    <div style={{background:'url(http://localhost:8000/uploads/c2eb3b9de2d11.jpg)'}}>
        <div className="content_wrapper">
            <div id="image-box" className="content">
                {/* <img src={`${API_URL}/${product.imageUrl}`} alt="" /> */}
                {/* <MainPage /> */}
                
                <Swiper 
                  className="banner"
                  spaceBetween={0}
                  speed={500}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  loop={true}
                  // autoplay={true}
                  centeredSlides={true} 
                  loopedSlides={4}
                >
                  {product.imageUrl == null ? null : <SwiperSlide><img src={`${API_URL}/${product.imageUrl}`} alt="" /></SwiperSlide> }
                  {product.imageUrl2 == null ? null : <SwiperSlide><img src={`${API_URL}/${product.imageUrl2}`} alt="" /></SwiperSlide> }
                  {product.imageUrl3 == null ? null : <SwiperSlide><img src={`${API_URL}/${product.imageUrl3}`} alt="" /></SwiperSlide> }
                  {product.imageUrl4 == null ? null : <SwiperSlide><img src={`${API_URL}/${product.imageUrl4}`} alt="" /></SwiperSlide> }
                </Swiper>
            </div>
            
            <div id="contents-box" className= { isRectheight ? "original_header content" : "change_header content"}  >
                <div id="name">{product.name}</div>
                <div id="price">{AddComma(product.price)} won</div>
                
                {/* <div id="createdAt">{dayjs(product.createdAt).format('YYYY년 MM월 DD일')}</div> */}
                <pre id="description" dangerouslySetInnerHTML={{ __html: `${isProductColor}` }}></pre>
                  <div className="detail_2_wrapper">
                    <div className="detail_color">
                      COLOR : {isColorName}
                      <ul className="detail_first detail_Common">
                        <li className="detail_first_li" style={{background:product.color1}} id="case1" onClick={GetClick}></li>
                        <li className="detail_first_li" style={{background:product.color2}} id="case2" onClick={GetClick}></li>
                        <li className="detail_first_li" style={{background:product.color3}} id="case3" onClick={GetClick}></li>
                        {/* {product.color1 ?  <li className="detail_first_li" style={{background:product.color1}}id="case1" onClick={GetClick}></li> : null}
                        {product.color2 ?  <li className="detail_first_li" style={{background:product.color2}}id="case2" onClick={GetClick}></li> : null}

                        {product.color3 ?  <li className="detail_first_li" style={{background:product.color3}}id="case3" onClick={GetClick}></li> : null} */}
                      </ul>
                    </div>
                    {isShowSize == product.colorName1
                      ? <div className="detail_size">
                          SIZE : {isShowSizeName}
                          <ul className="detail_second detail_Common">
                          {/* {product.color1 ? <div>heyy1</div> : null} */}
                          <li className="detail_second_li" id="case1_1" onClick={GetClick2} value={product.size1}>{product.size1}</li>
                          <li className="detail_second_li" id="case2_1" onClick={GetClick2} value={product.size1_2}>{product.size1_2}</li>
                          <li className="detail_second_li" id="case3_1" onClick={GetClick2} value={product.size1_3}>{product.size1_3}</li>
                          {/* {product.size1 ? <li className="detail_second_li" id="case1_1" onClick={GetClick2} value={product.size1}>{product.size1}</li> : null} */}
                          {/* {product.size1_2 ? <li className="detail_second_li" id="case2_1" onClick={GetClick2} value={product.size1_2}>{product.size1_2}</li> : null}
                          {product.size1_3 ? <li className="detail_second_li" id="case3_1" onClick={GetClick2} value={product.size1_3}>{product.size1_3}</li> : null} */}
                          </ul>
                        </div>
                      : null 
                    }
                    {isShowSize == product.colorName2
                      ? <div className="detail_size">
                          SIZE : {isShowSizeName}
                          <ul className="detail_second detail_Common">
                          {/* {product.color1 ? <div>heyy2</div> : null} */}
                          <li className="detail_second_li" id="case1_1" onClick={GetClick2} value={product.size2}>{product.size2}</li>
                          <li className="detail_second_li" id="case2_1" onClick={GetClick2} value={product.size2_2}>{product.size2_2}</li>
                          <li className="detail_second_li" id="case3_1" onClick={GetClick2} value={product.size2_3}>{product.size2_3}</li>
                          {/* {product.size2 ? <li className="detail_second_li" id="case1_1" onClick={GetClick2} value={product.size2}>{product.size2}</li> : null}
                          {product.size2_2 ? <li className="detail_second_li" id="case2_1" onClick={GetClick2} value={product.size2_2}>{product.size2_2}</li> : null}
                          {product.size2_3 ? <li className="detail_second_li" id="case3_1" onClick={GetClick2} value={product.size2_3}>{product.size2_3}</li> : null} */}
                          </ul>
                        </div>
                      : null 
                    }
                    {isShowSize == product.colorName3
                      ? <div className="detail_size">
                          SIZE : {isShowSizeName}
                          <ul className="detail_second detail_Common">
                          {/* {product.color1 ? <div>heyy3</div> : null} */}
                          <li className="detail_second_li" id="case1_1" onClick={GetClick2} value={product.size3}>{product.size3}</li>
                          <li className="detail_second_li" id="case2_1" onClick={GetClick2} value={product.size3_2}>{product.size3_2}</li>
                          <li className="detail_second_li" id="case3_1" onClick={GetClick2} value={product.size3_3}>{product.size3_3}</li>
                          {/* {product.size3 ? <li className="detail_second_li" id="case1_1" onClick={GetClick2} value={product.size3}>{product.size3}</li> : null}
                          {product.size3_2 ? <li className="detail_second_li" id="case2_1" onClick={GetClick2} value={product.size3_2}>{product.size3_2}</li> : null}
                          {product.size3_3 ? <li className="detail_second_li" id="case3_1" onClick={GetClick2} value={product.size3_3}>{product.size3_3}</li> : null} */}
                          </ul>
                        </div>
                      : null 
                    }
                    {isCartUi_View 
                    ? <div className="detail_Cart">
                        <div className="detail_third_name">{isColorName} / {isShowSizeName}</div>
                        <div className="detail_third">
                          <div className="input_qty input_qty_side" id="input_qty_minus" onClick={ CartListButton }>-</div>
                            <input className="input_qty" type="number" autoComplete="off" min="1" max="100" value={isCartUi} readOnly/>
                          <div className="input_qty input_qty_side" id="input_qty_plus" onClick={ CartListButton }>+</div>
                        </div>
                      </div>
                    : null 
                  }
                    
                  {isCartUi_View ? <div className="detail_totalbox">Total: { AddComma(istotalPrice)} WON</div> : null}
                    
                  </div>
                <br />
                {currentClick && currentClick2 ?
                  // <Payment name={product.name +"/"+ isColorName +"/"+ isShowSizeName}     price={istotalPrice} />
                  <Button id="purchase-button">
                    <Link  style={{color:'inherit'}}to={{
                      pathname: `/OrderPage`,
                      state: { 
                          title: `${product.name} / ${isColorName} / ${isShowSizeName}`,
                          price: product.price,
                          imgThumb: product.imageUrl,
                      }
                    }}>결제하기</Link>
                  </Button>
                  :
                  <Button id="purchase-button" onClick={ onClickPurchase }>
                    결제하기
                  </Button>
                }
                <Button id="basket-button" size="large" type="primary" onClick={ clickHandler }>장바구니담기</Button>
                
            </div>
            <div className="dtail_Page">
              <img src={`${API_URL}/${product.detailPage}`} ref={parentRef} id="target" alt="" />
            </div>
            {/* <div id="profile-box">
                <img src="/images/icons/avatar.png" />
                <span>{product.seller}</span>
              </div> */}
        </div>
        <div className="detail_wrapper">
          {product.imageUrl5 == null? null 
          : 
            <>
              <h3 className="detail_title">Real Fit Check.</h3>
              <div id="detail_camera_image">
                <video width="400" height="500" controls >
                      <source src={`${API_URL}/${product.imageUrl5}`} type="video/mp4"/>
                </video>
              </div>
            </>
          }
          {product.detailPage == null? 
          null 
          :
          <div className="dtail_Page22">
            <h3 className="detail_title">Detail Page.</h3>
            <img src={`${API_URL}/${product.detailPage}`} alt="" />
          </div>
          }
          <div className='relate_wraaper'>
            {/* 연관상품1 */}
            {product.relateProduct1 == null? null 
            :
            <h3 className="detail_title">With Item</h3>
            }
            {product.relateProduct1 == null? null 
            :
            <>
              <Link
                style={{ color: "inherit" }}
                to={`/products/${whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct1)).id}`}
              >
                <img src={`${API_URL}/${whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct1)).imageUrl}`} alt="연관상품1" />
                <div>{whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct1)).name}</div>
                <div>{AddComma(whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct1)).price)}</div>
              </Link>
                  
            </>
            }
            {/* 연관상품2 */}
            {product.relateProduct2 == null? null 
            :
            <>
              <Link
                style={{ color: "inherit" }}
                to={`/products/${whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct2)).id}`}
              >
                  <img src={`${API_URL}/${whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct2)).imageUrl}`} alt="연관상품2" />
                  <div>{whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct2)).name}</div>
                  <div>{AddComma(whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct2)).price)}</div>
              </Link>
            </>
            }
            {/* 연관상품3 */}
            {product.relateProduct3 == null? null 
            :
            <>
                <a href={`/products/${whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct3)).id}`}>
                  <img src={`${API_URL}/${whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct3)).imageUrl}`} alt="연관상품3" />
                  <div>{whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct3)).name}</div>
                  <div>{AddComma(whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct3)).price)}</div>
                </a>
            </>
            }
            {/* 연관상품4 */}
            {product.relateProduct4 == null? null 
            :
            <>
                <a href={`/products/${whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct4)).id}`}>
                  <img src={`${API_URL}/${whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct4)).imageUrl}`} alt="연관상품4" />
                  <div>{whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct4)).name}</div>
                  <div>{AddComma(whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct4)).price)}</div>
                </a>
            </>
            }
            {/* 연관상품5 */}
            {product.relateProduct5 == null? null 
            :
            <>
                <a href={`/products/${whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct5)).id}`}>
                  <img src={`${API_URL}/${whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct5)).imageUrl}`} alt="연관상품5" />
                  <div>{whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct5)).name}</div>
                  <div>{AddComma(whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct5)).price)}</div>
                </a>
            </>
            }
             
          </div>
        </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    allProducts: state.allProducts
  }
}

export default connect(mapStateToProps)(ProductPage);