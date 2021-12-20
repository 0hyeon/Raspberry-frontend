import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";	// 추가
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "../css/Swiper_custom.css";
import {API_URL} from "../config/constants.js";
SwiperCore.use([Navigation, Pagination, Autoplay])	// 추가

function MainPage(props) {
  return(
    <div className="paddingT75">
       <Swiper 
         className="banner"
         spaceBetween={100}
         slidesPerView={1}
         navigation
         pagination={{ clickable: true }}
       >
        <SwiperSlide><img src={`${API_URL}/uploads/5.jpg`} /></SwiperSlide>
        <SwiperSlide><img src={`${API_URL}/uploads/5.jpg`} /></SwiperSlide>
        <SwiperSlide><img src={`${API_URL}/uploads/5.jpg`} /></SwiperSlide>
      </Swiper>
    </div>
  )
}

export default MainPage;