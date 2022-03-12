import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";	// 추가
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "./css/Swiper_custom.css";
import {API_URL} from "./config/constants.js";
import { Link } from "react-router-dom";
SwiperCore.use([Navigation, Pagination, Autoplay])	// 추가

function MainPage(props) {

  // const [size, setCurrentSize] = useState(null);

  
  // useEffect(() => {
    
  //   let size = { width: window.innerWidth || document.body.clientWidth, height: window.innerHeight || document.body.clientHeight };

  //   setCurrentSize(size)
  // },[size])
  
  console.log(window.innerWidth);
  return(
    <div className="main_Swiper">
        <Swiper 
            // breakpoints={{
            //   // when window width is >= 640px
            //   640: {
            //     width: 640,
            //     slidesPerView: 1,
            //   },
            //   // when window width is >= 768px
            //   768: {
            //     width: 768,
            //     slidesPerView: 2,
            //   },
            // }}
            // breakpoints={{
            //   // when window width is >= 640px
            //   // when window width is >= 768px
            //   767: {
            //     slidesPerView:1.2,
            //     spaceBetween: 20,
            //     speed:500,
            //     loop:true,
            //     autoplay:true
            //   },
            // }}

            className="banner"
            spaceBetween={0}
            speed={500}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            autoplay={true}

            centeredSlides={true} 
            // slidesOffsetBefore={true}
            // grabCursor={true}
        >
          {window.innerWidth > 767 ? 
          <>
            <SwiperSlide>
              <Link to="/products/1">
                <img src={`${API_URL}/uploads/bn3.jpg`} alt="메인배너이미지3"/>
              </Link>
              </SwiperSlide>
            <SwiperSlide>
              <Link to="/products/1">
                <img src={`${API_URL}/uploads/bn1.jpg`} alt="메인배너이미지1"/>
              </Link>
            </SwiperSlide>
            <SwiperSlide><img src={`${API_URL}/uploads/bn2.jpg`} alt="메인배너이미지2"/></SwiperSlide>
          </>
            :
            <>
            <SwiperSlide><img src={`${API_URL}/uploads/bnm1.jpg`} alt="메인배너이미지1"/></SwiperSlide>
            <SwiperSlide><img src={`${API_URL}/uploads/bnm2.jpg`} alt="메인배너이미지2"/></SwiperSlide>
            <SwiperSlide><img src={`${API_URL}/uploads/bnm3.jpg`} alt="메인배너이미지3"/></SwiperSlide>
            </>
            }
        </Swiper>
    </div>
  )
}

export default MainPage;