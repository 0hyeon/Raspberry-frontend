import React from 'react';
import { useParams, useHistory,Link, Switch, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef} from "react";
import "../css/Products.css";
import {API_URL} from "../config/constants";
import dayjs from 'dayjs';
import ReactPaginate from "react-paginate";
import { useDispatch,useSelector, connect } from 'react-redux';
// import MainPage from "./MainPage";
import {addToCart, setProducts, selectedProduct, removeSelectedProduct, decideToCart, setCartItem, setRequestLoding, setRequestLoding2,fetchCartItem,totalprice} from '../_actions/userAction'
import styled from "styled-components";
//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";	// 추가
import { actionCreators as productOptionActions } from "../_modules/productoptions";
import { actionCreators as productOptionActionsDetails } from "../_modules/productoptionDetails";
import { actionCreators as productActions } from "../_modules/product";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "../css/Swiper_custom.css";
import { Button, message,Tabs } from "antd";
import Payment from "./Payment";
import jwt_decode from "jwt-decode";
import "../css/QnaDescription.css";
import { LockOutlined } from "@ant-design/icons";

function ProductPage() {
  
  const history = useHistory();//리액트훅
  // console.log("props.allProducts.cartItem : ", props.allProducts.cartItem);
  let state = useSelector(state => state);
  const whyerrorObject = state.productoptions.productoptions.products;
  const [iswhyerrorObject, setwhyerrorObject] = useState(null);
  const [iswhyerrorObject2, setwhyerrorObject2] = useState(null);
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
  const [qnaAll, setqnaAll] = useState(null);
  const [qnaComentAll, setqnaComentAll] = useState(null);
  
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

  const [pageNumber, setPageNumber] = useState(0);
  
  //컬러 클릭후 사이즈 보여주기 -> Free , m
  const [isShowSizeName, setShowSizeName] = useState(null);
  const [isColorType, setColorType] = useState(null);
  const [isProductId, setProductId] = useState(null);
//현재남은 재고 수량 update
  const [isnowProductNum, setnowProductNum] = useState(null);

  //단순히 사이즈ui  보여주는 상태관리 isShowSize == 컬러이름이면 사이즈 show 
  const [isShowSize, setShowSize] = useState(false);
  //Cart Ui value number quanity

  //detail total price
  const [istotalPrice, settotalPrice] = useState(null);

  //스크롤 시 상품off 잡아 Add class 
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isProductColor,setProductColor] = useState(null);
  const [isSizeDesc,setSizeDesc] = useState(null);
  //장바구니 
  
  const parentRef   = useRef(null);
  const clientRectheight   = useRef(null);
  //장바구니
  
  // color
  const [scrollFlag, setScrollFlag] = useState(false);
  const [scrollFlag2, setScrollFlag2] = useState(false);

  const [isSoldOut, setSoldOut] = useState(false);

  let Session = sessionStorage.getItem('user_id');
  //antd
  const { TabPane } = Tabs;
  
  // statrt
  function callback(key) {
    return;
  }
  
  const dispatch = useDispatch();
  //장바구니담기후 장바구니 목록 불러오기
  const fetchCartItem = async () => {
    if(Session){
      const decoded = jwt_decode(Session).user_id;
      let body = {
        seSsionId: decoded
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
    }
    // dispatch(setProducts(result.data));
  };
  
  //장바구니 가져올수있는지 
  const youCanAddToCart = async () => {

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
      alert('장바구니 기능은 로그인을 해주셔야 합니다.')
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


  // const loggogo = whyerrorObject && whyerrorObject.find((item) => String(item.colorType) == String(1)[0]);
  // const loggogo2 = whyerrorObject && whyerrorObject.find((item) => String(item.colorType) == String(1)[1]);
  // const loggogo3 = whyerrorObject && whyerrorObject.map((item) => String(item.colorType) == String(1));
  const colorTypeCategory = whyerrorObject && whyerrorObject.map((item) => {return(item)});
  
  const case1_colorType1 = colorTypeCategory && colorTypeCategory.filter((item) => {
    if(item.colorType == 1){
      return true;
    }
    return false;
  });
  const case1_colorType2 = colorTypeCategory && colorTypeCategory.filter((item) => {
    if(item.colorType == 2){
      return true;
    }
    return false;
  });
  const case1_colorType3 = colorTypeCategory && colorTypeCategory.filter((item) => {
    if(item.colorType == 3){
      return true;
    }
    return false;
  });
  const case1_colorName2 = case1_colorType1 && case1_colorType1[0];
  const case1_colorName20 = case1_colorType1 && case1_colorType1[1];
  const case1_colorName200 = case1_colorType1 && case1_colorType1[2];

  const case1_colorName2_1 =  case1_colorType2 && case1_colorType2[0];
  const case1_colorName2_10 =  case1_colorType2 && case1_colorType2[1];
  const case1_colorName2_100 =  case1_colorType2 && case1_colorType2[2];

  const case1_colorName2_2 =  case1_colorType3 && case1_colorType3[0];
  const case1_colorName2_20 =  case1_colorType3 && case1_colorType3[1];
  const case1_colorName2_200 =  case1_colorType3 && case1_colorType3[2];
  // const loggogo3 = whyerrorObject && whyerrorObject.find((item) => String(item.colorType) == String(1))[2];
  // const loggogo4 = whyerrorObject && whyerrorObject.find((item) => String(item.colorType) == String(2))[0];
  // console.log(case1_colorName2);
  // console.log(case1_colorName20);
  // console.log(case1_colorName200);

  // console.log(case1_colorName2_1);
  // console.log(case1_colorName2_10);
  // console.log(case1_colorName2_100);

  // console.log(case1_colorName2_2);
  // console.log(case1_colorName2_20);
  // console.log(case1_colorName2_200);
  //색상1 정의 
  // console.log(scrollFlag);
  // console.log(scrollFlag2);
  // const loggogo = whyerrorObject &&whyerrorObject.find((item) => String(item.id) === String(product.relateProduct1)).id
  
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
        setColorName(case1_colorName2 && case1_colorName2.colorName1);//스카이블루 표현
        setShowSize(case1_colorName2 && case1_colorName2.colorName1);//size ui 보여줌 

      }if(e.target.id == "case2"){
        setColorName(case1_colorName2_1 && case1_colorName2_1.colorName1)
        setShowSize(case1_colorName2_1 && case1_colorName2_1.colorName1);
      }else if(e.target.id == "case3"){
        setColorName(case1_colorName2_2 && case1_colorName2_2.colorName1);
        setShowSize(case1_colorName2_2 && case1_colorName2_2.colorName1);//사이즈 Free, SS
      }
      setShowSizeName(null);
    }
    // console.log(e.target.id);
  };
  // useEffect(() => {
    
  // }, [isProductId])

  const GetClick2 = (e) => {//Size 클릭
    if(e.target.style.border == "none"){
      return;
    }
    if (e.target.className == "detail_second_li" ){
      // if(e.target.textContent == ""){
      //   return;
      // }
      setCurrentClick2(e.target.id);//클릭시 스타일처리와 이전클릭에 사용 상태관리  
      if(isShowSize === `${case1_colorName2 && case1_colorName2.colorName1}`){ //블랙
        if(e.target.id == "case1_1"){
          setShowSizeName(case1_colorName2 && case1_colorName2.size1);
          setColorType(case1_colorName2 && case1_colorName2.colorType);
          setProductId(case1_colorName2 && case1_colorName2.id);
          setnowProductNum(case1_colorName2 && case1_colorName2.quantity1);
        }else if (e.target.id == "case2_1"){
          setShowSizeName(case1_colorName20 && case1_colorName20.size1);
          setColorType(case1_colorName20 && case1_colorName20.colorType);
          setProductId(case1_colorName20 && case1_colorName20.id);
          setnowProductNum(case1_colorName20 && case1_colorName20.quantity1);
        }else if (e.target.id == "case3_1"){
          setShowSizeName(case1_colorName200 && case1_colorName200.size1);
          setColorType(case1_colorName200 && case1_colorName200.colorType);
          setProductId(case1_colorName200 && case1_colorName200.id);
          setnowProductNum(case1_colorName200 && case1_colorName200.quantity1);
        }
      }else if(`${isShowSize === case1_colorName2_1 && case1_colorName2_1.colorName1}`){//초록
        if(e.target.id == "case1_1"){
          setShowSizeName(case1_colorName2_1 && case1_colorName2_1.size1);
          setColorType(case1_colorName2_1 && case1_colorName2_1.colorType);
          setProductId(case1_colorName2_1 && case1_colorName2_1.id);
          setnowProductNum(case1_colorName2_1 && case1_colorName2_1.quantity1);
        }else if (e.target.id == "case2_1"){
          setShowSizeName(case1_colorName2_10 && case1_colorName2_10.size1);
          setColorType(case1_colorName2_10 && case1_colorName2_10.colorType);
          setProductId(case1_colorName2_10 && case1_colorName2_10.id);
          setnowProductNum(case1_colorName2_10 && case1_colorName2_10.quantity1);
        }else if (e.target.id == "case3_1"){
          setShowSizeName(case1_colorName2_100 && case1_colorName2_100.size1);
          setColorType(case1_colorName2_100 && case1_colorName2_100.colorType);
          setProductId(case1_colorName2_100 && case1_colorName2_100.id);
          setnowProductNum(case1_colorName2_100 && case1_colorName2_100.quantity1);
        }
      }
      
    }
  };
  const GetClick3 = (e) => {//Size 클릭
    if (e.target.className == "detail_second_li" ){
      // if(e.target.textContent == ""){
      //   return;
      // }
      setCurrentClick2(e.target.id);//클릭시 스타일처리와 이전클릭에 사용 상태관리  
        if(e.target.id == "case1_1"){
          setShowSizeName(case1_colorName2_2 && case1_colorName2_2.size1);
          setColorType(case1_colorName2_2 && case1_colorName2_2.colorType);
          setProductId(case1_colorName2_2 && case1_colorName2_2.id);
          setnowProductNum(case1_colorName2_2 && case1_colorName2_2.quantity1);
        }else if (e.target.id == "case2_1"){
          setShowSizeName(case1_colorName2_20 && case1_colorName2_20.size1);
          setColorType(case1_colorName2_20 && case1_colorName2_20.colorType);
          setProductId(case1_colorName2_20 && case1_colorName2_20.id);
          setnowProductNum(case1_colorName2_20 && case1_colorName2_20.quantity1);
        }else if (e.target.id == "case3_1"){
          setShowSizeName(case1_colorName2_200 && case1_colorName2_200.size1);
          setColorType(case1_colorName2_200 && case1_colorName2_200.colorType);
          setProductId(case1_colorName2_200 && case1_colorName2_200.id);
          setnowProductNum(case1_colorName2_200 && case1_colorName2_200.quantity1);
        }
      
    }
  };
  
 
  const fetchProducts = async () => {//해당페이지 모든 아이템 
    await axios
      .get(`${API_URL}/v1/product/products`)
    //   .get('https://jsonplaceholder.typicode.com/posts')
      .then(function(result){
        setLoading(true);
        // const products = result.data.products;
        // setProducts(products);
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
    dispatch(removeSelectedProduct());
    await axios
      .get(
        `${API_URL}/v1/product/products/${id}`//파라미터 요청
      )
      .then(function (result) {
        const product = result.data.product;
        setProduct(product);
        settotalPrice(product.price);
        setProductColor(product.description);
        setSizeDesc(product.sizeDesc);
        dispatch(selectedProduct(result.data));
        // console.log("setProductColor" ,isProductColor);
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
  const fetchProductDetail = async () => {//해당페이지 1아이템
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
  
  //댓글갯수(모든)
  const fetchqnaAllComent = async () => {
    await axios
        .get(`${API_URL}/v1/qna/qnaAllComentGET`)
        .then(function(result){
            // console.log("fetchqnaAllComent : ",result.data);
            setqnaComentAll(result.data.result.slice(0, 5));
        })
        .catch((err) => {
            console.log("Err: ", err);
        });
        
        
  }
  //모든Qna fetch
  const fetchQnaAll = async () => {
        await axios
        .get(`${API_URL}/v1/qna/qnaAll`)
        .then(function(result){
            console.log(result.data);
            setqnaAll(result.data.result)   
        })
        .catch((err) => {
            console.log("Err: ", err);
        });
        
    };
    function AddNew(day){
        
      const createDay = day
      // const createDay.split("T");
      let today = new Date();   
      let year = today.getFullYear(); // 년도
      let month = today.getMonth() + 1;  // 월
      let date = today.getDate();  // 날짜
      const dummyday = `${year}-${month}-${date}`

      if(dummyday == createDay){
          return 'New'
      }else{
          return;
      }
  }
  //댓글갯수
  const commentsLength = () => {//0번째만 3개들어감
    if (qnaAll && qnaAll.length > 0) { 
      // console.log("질문글 : ",qnaAll);
      for (var article in qnaAll) {//질문글반복
        const comments = [];
        for (var comment in qnaComentAll) {//질문의댓글반복
          if(
            qnaComentAll[comment].Qna_id === 
            qnaAll[article].id
          ){
            comments.push(qnaComentAll[comment].id);
          }
        }
        qnaAll[article]["comments"] = comments;
      }
    }
  }
  const decideToCartItem = async () => {
        
    let Session = sessionStorage.getItem('user_id');
    if(Session){
      const decoded = jwt_decode(Session).user_id;
      let body = {
        productId: id,
        seSsionId: decoded,
        price:Number(product.price),
        uploadImage:product.imageUrl,
        productName:product.name,
        it_Detail_color: isColorName,
        it_Detail_size : isShowSizeName, 
        it_Detail_quanity: Number(isCartUi),
        it_option_id :isProductId,
        it_sc_stock:isnowProductNum
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

    }

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
    
    fetchQnaAll();//qna

    fetchqnaAllComent()//qna댓글

    getProduct();//useEffect시 1개아이템

    youCanAddToCart();//장바구니
    // fetchProductDetail();//해당페이지 1아이템 
    fetchProducts();//모든 아이템
    
    setProduct(product);//상품세팅
    
    
  }, [isCartUi_View,prevClick,currentClick2,currentClick,id]);
  
  

  useEffect(() => {
    dispatch(productActions.setProductSV());
    dispatch(productOptionActions.setProductOptionsSV(product.name));
    setScrollFlag(case1_colorName2_1 && case1_colorName2_1.color1)
    setScrollFlag2(case1_colorName2_2 && case1_colorName2_2.color1)
    
    
    // console.log("doing productOptionActions!!!",product.name);
      
    if (product === null || state === null || whyerrorObject === null) {
          setwhyerrorObject(whyerrorObject);
          setwhyerrorObject2(product);
        return <h1>상품 정보를 받고 있습니다...</h1>;
    }
  }, [product,dispatch])
  // }, [setCartUi_View,setPrevClick,prevClick,prevClick2,id]);
  // },[]);
  useEffect(() => {
    window.scrollTo(0,0);
    // document.getElementById('root').scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const p_name = product.name
    const p_price = product.price
    const p_imgUrl = product.imageUrl

    const setProductDetailSV_Data = {
      isProductId,
      p_name,
      isColorName,
      isShowSizeName,
      p_price,
      p_imgUrl,
      isColorType,
      isnowProductNum,
      isCartUi
    }
    dispatch(productOptionActionsDetails.setProductDetailSV(setProductDetailSV_Data));
  }, [dispatch,isShowSizeName,isProductId,isColorName,isColorType,isnowProductNum,isCartUi])
  
  commentsLength();

  const onClickPurchase = () =>{//구매하기 클릭이벤트
    // axios.post(`${API_URL}/purchase/${id}`).then((result)=>{
      
    //   getProduct();//구매할때 getProduct랜딩 disabled효과 
    // }).catch((error)=>{
    //   message.error(`에러가 발생했습니다. ${error.message}`)
    // })
    // if (Session == null){
    //   alert('로그인을 해주셔야 합니다.')
    //   history.push("/Login");
    //   return;
    // }
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
  const usersPerPage = 5;//한페이지에 보여주는 갯수
  const pagesVisited = pageNumber * usersPerPage;// 1페이지에 1 * 10 / 2페이지에 2 * 20 //최대갯수인듯
  const displayUsers = 
    qnaAll && qnaAll.slice(pagesVisited, pagesVisited + usersPerPage).filter(item => item.product_id == id).map((qna) => {
        return (
            <Tr value={qna.id}  key={qna.id}>
                <Link to={`/Qna/${qna.id}`}>
                <Td value={qna.id}>
                    <span className="marginleft5">
                        <LockOutlined style={{ fontSize: '16px', color: 'black' }} /> 
                    </span>
                    {qna.title}
                    ({qna.comments && qna.comments.length}) 
                    <span className='designNew'>{AddNew(qna.createDate)}</span>
                </Td>
                </Link>
                <Td>{qna.user_name}</Td>
                <Td>{dayjs(qna.createdAt).fromNow()}</Td>
            </Tr>
        )
    })
      
      //qnaAll 질문글
      //qnaComentAll 질문의댓글

    const pageCount = Math.ceil(qnaAll&&qnaAll.length / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };
  return (
    // <div style={{background:'url(http://localhost:8000/uploads/c2eb3b9de2d11.jpg)'}}>
    <div style={{background:'url("")', backgroundSize:"cover"}}>
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
                <Tabs defaultActiveKey="1" onChange={callback}>
                  <TabPane tab="Detail" key="1">
                    <pre className="description" dangerouslySetInnerHTML={{ __html: `${isProductColor}` }}></pre>
                  </TabPane>
                  <TabPane tab="Size" key="2">
                    <pre className="description" dangerouslySetInnerHTML={{ __html: `${isSizeDesc}` }}></pre>
                  </TabPane>
                  <TabPane tab="Shipping Return " key="3">
                    <div className='description'>
                      <ul>
                        <li>-착용흔적이 있는 제품은 당연히 교환/반품이 절대 불가 </li>
                        <li>-상품의 훼손, 멸실, 세탁, 향기, 오염, 피부각질 등 소비자에 의해 상품의 가치가 현저히 감소한 경우 </li>
                        <li>-고객님의 주문 완료 후 개별 오더 또는 맞춤 제작이 들어가는 제품(수제화/핸드메이드/자체제작)같은경우 </li>
                        <li>-착용 또는 세탁 후 불량 및 오염 발생의 경우  원상태의 제품이 아니므로 교환반품이 불가 (착용전 꼼꼼히 확인해주세요!) </li>
                      </ul>
                      <ul>
                        <li>-품절 처리(SOLD OUT!) 된 지 1주일 이상 된 상품은 공급처 교환이 어려워 교환/반품이 불가 </li>
                        <li>-구매금액에 따른 사은품을 받으신 경우,상품 반품 처리시 사은품도 함께 보내주셔야 합니다. </li>
                        <li>-청바지의 경우 소재특성상 물빠짐이 있을수 있습니다. 물빠짐의 경우 개인이 느끼기에 따라 다른 주관적인 부분입니다.  이는 불량사유가 되지 않음을 안내드립니다.</li>
                      </ul>
                      <ul>
                        <li>-퍼제품의 경우 털빠짐이 있을수 있습니다. 이는 불량사유가 되지 않음을 안내드립니다. </li>
                        <li>-이너웨어와 같은 상품들은 속옷류로 간주되며 착용 여부를 알 수 없는 제품(쥬얼리/모자/양말 등) 또한 반품이 불가합니다  </li>
                        <li>- 고객님의 책임 있는 사유로 상품등이 멸실 또는 훼손된 경우. 단, 상품의 내용을 확인하기 위하여   포장 등을 훼손한 경우는 제외</li>
                      </ul>
                      <ul>
                        <li>- 주문제작 상품일 경우   </li>
                        <li style={{color:'crimson'}}>- 시간의 경과에 의하여 재판매가 곤란할 정도로 상품등의 가치가 현저히 감소한 경우    (반드시 게시판을 통하여 교환 및 반품접수를 하신 후 7일이내로 저희 쪽에 수령이 가능하도록 배송해주셔야 합니다.)  위와 같은 경우 어떠한 처리도 불가능함을 알려드립니다.이는 오배송이나 상품 하자의 경우에도 포함됩니다. </li>
                      </ul>
                      <ul>
                        <li>※ 고객님의 마음이 바뀌어 교환, 반품을 하실 경우 상품반송 비용은 고객님께서 부담하셔야 합니다.(색상 교환, 사이즈 교환 등 포함) </li>
                        <li>*전자상거래법에 의거하여 교환/반품은 상품 수령일부터 7일 이내에 당해계약에 관한 청약철회가 가능합니다. </li>
                        <li>*교환/반품시 수거 완료 후 10일 이상 연락두절로 인해 처리가 어려울 시 착불로 반송처리 될 수 있습니다. (오배송/불량상품의 경우) </li>
                      </ul>
                      <ul>
                        <li>-불량상품 또는 오배송으로 인한 타 상품 수령시엔 무상교환 원칙으로 신속한 재발송을 도와드리고 있으나  반품 처리 진행을 원하실 경우 변심이 일부 반영되어 최종 반품비 2,500원이 청구되시는 점 참고부탁드립니다. </li>
                      </ul>
                      <ul>
                        <li>-고객님의 부재로 인해 반송이 된 경우에는 반송되어져 온 배송비와 재발송 배송비 총 5,000원을 부담해주셔야 합니다.  반드시 정확한 주소지와 연락처 기재 부탁드립니다   </li>
                        <li>-오배송 및 불량상품이여도 미착용제품한에서 가능합니다.    (훼손, 멸실, 세탁, 향기, 오염, 피부각질 ) *** 이 외 궁굼하신 사항은 게시판 상단 '자주하는 질문!'을 참고해주시거나, Q&A 게시판으로 문의주시면 답변 드리겠습니다.***</li>
                      </ul>
                    </div>
                  </TabPane>
                </Tabs>
                  <div className="detail_2_wrapper">
                    <div className="detail_color">
                      COLOR : {isColorName}
                      <ul className="detail_first detail_Common">
                        <li className="detail_first_li" style={{background:case1_colorName2 && case1_colorName2.color1}} id="case1" onClick={GetClick}></li>
                        <li className="detail_first_li" style={{background:case1_colorName2_1 && case1_colorName2_1.color1}} id="case2" onClick={GetClick}></li>
                        <li className="detail_first_li" style={{background:case1_colorName2_2 && case1_colorName2_2.color1}} id="case3" onClick={GetClick}></li>
                        {/* {product.color1 ?  <li className="detail_first_li" style={{background:product.color1}}id="case1" onClick={GetClick}></li> : null}
                        {product.color2 ?  <li className="detail_first_li" style={{background:product.color2}}id="case2" onClick={GetClick}></li> : null}

                        {product.color3 ?  <li className="detail_first_li" style={{background:product.color3}}id="case3" onClick={GetClick}></li> : null} */}
                      </ul>
                    </div>
                    {isShowSize == `${case1_colorName2 && case1_colorName2.colorName1}`
                      ? <div className="detail_size">
                          SIZE : {isShowSizeName}
                          <ul className="detail_second detail_Common">
                          {/* {product.color1 ? <div>heyy1</div> : null} */}
                          <li className="detail_second_li" id="case1_1" style={case1_colorName2 && case1_colorName2.size1 ? null: {border:'none'}}onClick={GetClick2} value={case1_colorName2 && case1_colorName2.size1}>{case1_colorName2 &&case1_colorName2.size1}</li>
                          <li className="detail_second_li" id="case2_1" style={case1_colorName20 && case1_colorName20.size1 ? null: {border:'none'}}onClick={GetClick2} value={case1_colorName20 && case1_colorName20.size1}>{case1_colorName20 &&case1_colorName20.size1}</li>
                          <li className="detail_second_li" id="case3_1" style={case1_colorName200 && case1_colorName200.size1 ? null: {border:'none'}}onClick={GetClick2} value={case1_colorName200 && case1_colorName200.size1}>{case1_colorName200 &&case1_colorName200.size1}</li>
                          </ul>
                        </div>
                      : null
                    }
                    {isShowSize == `${case1_colorName2_1 && case1_colorName2_1.colorName1}`
                      ? <div className="detail_size">
                          SIZE : {isShowSizeName}
                          <ul className="detail_second detail_Common">
                          {/* {product.color1 ? <div>heyy2</div> : null} */}
                          <li className="detail_second_li" id="case1_1" style={case1_colorName2_1 && case1_colorName2_1.size1 ? null: {border:'none'}}onClick={GetClick2} value={case1_colorName2_1 && case1_colorName2_1.size1}>{case1_colorName2_1 && case1_colorName2_1.size1}</li>
                          <li className="detail_second_li" id="case2_1" style={case1_colorName2_10 && case1_colorName2_10.size1 ? null: {border:'none'}}onClick={GetClick2} value={case1_colorName2_10 && case1_colorName2_10.size1}>{case1_colorName2_10 && case1_colorName2_10.size1}</li>
                          <li className="detail_second_li" id="case3_1" style={case1_colorName2_100 && case1_colorName2_100.size1 ? null: {border:'none'}}onClick={GetClick2} value={case1_colorName2_100 && case1_colorName2_100.size1}>{case1_colorName2_100 && case1_colorName2_100.size1}</li>
                          </ul>
                        </div>
                      : null 
                    }
                    {isShowSize == `${case1_colorName2_2 && case1_colorName2_2.colorName1}`
                      ? <div className="detail_size">
                          SIZE : {isShowSizeName}
                          <ul className="detail_second detail_Common">
                          {/* {product.color1 ? <div>heyy3</div> : null} */}
                          <li className="detail_second_li" id="case1_1" style={case1_colorName2_2 && case1_colorName2_2.size1 ? null: {border:'none'}}onClick={GetClick3} value={case1_colorName2_2 && case1_colorName2_2.size1}>{case1_colorName2_2 && case1_colorName2_2.size1}</li>
                          <li className="detail_second_li" id="case2_1" style={case1_colorName2_20 && case1_colorName2_20.size1 ? null: {border:'none'}}onClick={GetClick3} value={case1_colorName2_20 && case1_colorName2_20.size1}>{case1_colorName2_20 && case1_colorName2_20.size1}</li>
                          <li className="detail_second_li" id="case3_1" style={case1_colorName2_200 && case1_colorName2_200.size1 ? null: {border:'none'}}onClick={GetClick3} value={case1_colorName2_200 && case1_colorName2_200.size1}>{case1_colorName2_200 && case1_colorName2_200.size1}</li>
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
                  // quantity1가 0이면 품절처리 
                  isnowProductNum < 1  ?  
                    <Button id="solout-button">
                    품절
                    </Button>
                    : 
                    <Button id="purchase-button">
                      <Link  
                        style={{color:'inherit'}}
                        to={`/OrderPage/${id}`}
                    >결제하기</Link>
                    </Button>
                  
                  :
                  <Button id="purchase-button" onClick={ onClickPurchase }>
                    결제하기
                  </Button>
                }
                {isnowProductNum < 1  
                  ? null
                  : <Button id="basket-button" type="primary" onClick={ clickHandler }>장바구니담기</Button>
                }
            </div>
            <div className="dtail_Page">
              <img src={`${API_URL}/${product.detailPage1}`} ref={parentRef} id="target" alt="" />
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
          {product.detailPage1 == null? 
          null 
          :
          <div className="dtail_Page22">
            <h3 className="detail_title">Detail Page.</h3>
            <img src={`${API_URL}/${product.detailPage1}`} alt="" />
            {product.detailPage2 == null? null 
            :<img src={`${API_URL}/${product.detailPage2}`} alt="" />}
            {product.detailPage3 == null? null 
            :<img src={`${API_URL}/${product.detailPage3}`} alt="" />}
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
              <a
                style={{ color: "inherit" }}
                href={`/products/${state.allProducts.products.products &&state.allProducts.products.products.find((item) => String(item.id) === String(product.relateProduct1)).id}`}
              >
                <img src={`${API_URL}/${state.allProducts.products.products &&state.allProducts.products.products.find((item) => String(item.id) === String(product.relateProduct1)).imageUrl}`} alt="연관상품1" />
                <div>{state.allProducts.products.products &&state.allProducts.products.products.find((item) => String(item.id) === String(product.relateProduct1)).name}</div>
                <div>price : {AddComma(state.allProducts.products.products &&state.allProducts.products.products.find((item) => String(item.id) === String(product.relateProduct1)).price)}</div>
              </a>
              {product.relateProduct2 == null? null : null }
              {product.relateProduct3 == null? null : null }
              {product.relateProduct4 == null? null : null }
              {product.relateProduct5 == null? null : null }
            </>
            }
          </div>
          <div className='Qna_wraaper'>
          <div className='QnaTitle'>Q&A</div>
            <Table>
                <thead>
                    <Tr className="sod_list_head">
                        <Th scope="col" width="*" className="text_left">제목</Th>
                        <Th scope="col" width="15%" className="second_td">작성자</Th>
                        <Th scope="col" width="25%">작성일</Th>
                    </Tr>
                </thead>
                <tbody>
                    {displayUsers && displayUsers}
                </tbody>
            </Table>
            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
            />
            <div className='button_wrpper'>
              <button
                className='pdButton writeButton'
                size="large"
                onClick={function () {
                    history.push(`/QnaWrite/${id}`);
                }}
                >
                Write
              </button>
              <button
                className='pdButton ListButton'
                size="large"
                onClick={function () {
                    history.push("/Qna");
                }}
                >
                List
              </button>
              
            </div>
          </div>
          <div className='deliveryPolicy'>
            <h1 class="returnPolicy_title">배송안내</h1>
            <div>ㆍ배송방법 : CJ택배<br/>ㆍ배송비 : 7만원 이상 결제시 무료배송 <br/>ㆍ취소시(품절포함) 최종 결제 금액에 따라 배송비가 발생되거나 사용한쿠폰이 취소 될 수 있습니다. <br/>ㆍ결제시 적립금을 사용하신 경우, 취소시에&nbsp;적립금이 선환불 처리됩니다 (ex. 신용카드+적립금 결제시, 적립금 선환불처리).<br/>ㆍ옵션 변경은 꼭 Q&amp;A로 문의주셔야 변경이 가능합니다.<br/><br/>ㆍ상품 준비기간 (주말, 공휴일제외)&nbsp;자체 제작 상품 및 사입상품 : 3~7일 소요&nbsp;/ 수입상품 : 5일~10일 소요 <br/>ㆍ제작 상황에 따라 기본 배송일보다 조금 더 지연될 수 있습니다.<br/><br/>ㆍ당일발송&nbsp;오후 2시 이전 결제완료 : 당일 출고 / 오후 2시 이후 결제완료 : 익일 출고 <br/>ㆍ무통장 입금의 경우 입금 확인까지 1~2시간 소요됩니다. <br/>ㆍ당일 발송은 당일 출고 서비스로 단독으로 주문하셔야 당일 출고됩니다. <br/>ㆍ당일 발송 상품과 일반 발송 상품 같이 주문시 상품 준비 기간이소요됩니다.<br/><br/><strong>ㆍ배송지연</strong><br/> 주문 확인일로부터 5일(주말, 공휴일제외) 이후 카카오톡 또는 문자메시지로 지연 안내해 드리고 있으며, 일부 준비된 상품 먼저 발송될 수 있습니다.<br/><br/><strong>ㆍ품절안내</strong><br/>결제 완료 후 품절된 경우 카카오톡 또는 문자메시지로 품절 안내해 드리고 있습니다.  안내 후 익일 내 재문의 없을 경우 임의 취소 될 수 있는 점 양해 부탁드립니다.</div>
          </div>
          
        </div>
    </div>
  );
}
const Table = styled.table`
    width: 100%;
    margin: 0 auto  ;
`
const Tr = styled.tr`
    overflow: hidden;
    position: relative;
    padding: 14px 0 14px 7px;
    min-height: 50px;
    color: #757575;
    border-bottom: 1px solid #ececec;
`
const Td = styled.td`
    padding:12px;
`
const Th = styled.th`
    padding:12px;
`
const mapStateToProps = (state) => {
  return {
    allProducts: state.allProducts
  }
}

export default connect(mapStateToProps)(ProductPage);