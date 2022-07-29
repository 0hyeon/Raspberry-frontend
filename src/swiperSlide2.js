import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";	// 추가
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";
import "./css/Swiper_custom.css";
import {API_URL,S3_URL} from "./config/constants.js";
import { Link } from "react-router-dom";
import axios from "axios";
import { actionCreators as productActions } from "./_modules/product";
import { useDispatch, useSelector } from "react-redux";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])	// 추가

function MainPage(props) {
  const [isBanner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [size, setCurrentSize] = useState(null);

  
  // useEffect(() => {
    
  //   let size = { width: window.innerWidth || document.body.clientWidth, height: window.innerHeight || document.body.clientHeight };

  //   setCurrentSize(size)
  // },[size])
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  function AddComma(value) {
    return Number(value).toLocaleString('en');
  }
  function PdSalePercent(price,maketPrice) {
    return Math.round((1 - ( price/ maketPrice )) * 100)
  }
  React.useEffect(function () {
    // 상품관련
    // fetchProducts();
    dispatch(productActions.setProductSV());
    console.log("products",products);
    setLoading(false);
  }, []);
  // console.log(window.innerWidth);useEffect(() => {
    const ItemFetchLength = 12;
  return(
    <div className="Sub_Swiper" style={{width:'100%'}}>
        { loading ? <div>Loading...</div> :
          <>
            <img src='/images/1655805409_0.jpg' style={{position:'relative'}}></img>
            <Swiper 
                style={{position:'absolute',bottom: '0.8%',left: '7vw',overflow: 'inherit',width:'85vw'}}
                className="banner"
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={10}
                slidesPerView={3}
                navigation
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
            >
                {/* {displayUsers} */}
                  {/* <Link to="/products/1"> */}
                  {/* </Link> */}
                {  products.slice(0,ItemFetchLength)//50중에 
              .filter(item => item.category === "Dresses").map((product) => {
                return (
                  <SwiperSlide>
                      <Link 
                        to={`/products/${product.id}`}
                        style={{ color: "inherit" }}
                      >
                        <div className='sub_product_wrapper'>
                          <img
                              id={product.id} 
                              style={{height: 'auto',width:'100%'}} src={
                              process.env.NODE_ENV === 'production'
                                  ?`${product.imageUrl}`
                                  :`${API_URL}/${product.imageUrl}`
                              } alt="." 
                          />
                          <div className='sub_product_Box' style={{backgroundColor: '#fff',padding: 5,fontSize:'10px'}}>
                            <div style={{height: 25,    overflow:'hidden',display: '-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',}}>{product.subDescription}</div>
                            <div className='product_price_wrapper' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                              <div>{AddComma(product.price)} won</div>
                              {product.marketPrice !== null 
                              ? <div style={{    fontSize: 11,fontWeight: 700,color: '#ff9995',fontFamily: "Poppins"}} >{PdSalePercent(product.price,product.marketPrice)}%</div> 
                              : null} 
                            </div>
                          </div>
                        </div>
                      </Link>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </>
        }
    </div>
  )
}

export default MainPage;