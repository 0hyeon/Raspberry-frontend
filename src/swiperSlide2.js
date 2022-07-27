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
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])	// 추가

function MainPage(props) {
  const [isBanner, setBanner] = useState(null);
  const [isMobileBanner, setMobileBanner] = useState(null);

  // const [size, setCurrentSize] = useState(null);

  
  // useEffect(() => {
    
  //   let size = { width: window.innerWidth || document.body.clientWidth, height: window.innerHeight || document.body.clientHeight };

  //   setCurrentSize(size)
  // },[size])
  
  // console.log(window.innerWidth);useEffect(() => {
    const fetchBanner = async () => { 
        await axios
        .get(`${API_URL}/v1/banner/fetchBanner`)
        .then(function(res){
            // console.log(res.data.result.imageUrl);

            // console.log(res.data.result);
            // console.log(res.data.result.filter(ct => ct.category == "pc").map((ct)=>(ct.imageUrl)));   
            setBanner(res.data.result.filter(ct => ct.category == "pc").map((ct)=>(ct.imageUrl))[0]);   
            setMobileBanner(res.data.result.filter(ct => ct.category == "mobile").map((ct)=>(ct.imageUrl))[0]);   
        })
        .catch((err) => {
            console.log("Err: ", err);
        });
    };
    useEffect(() => {
      fetchBanner();//배너조회
    },[])
    if(isBanner === '' || isMobileBanner === ''){
      return <div>Loading...</div>;
    }
  return(
    <div className="main_Swiper">
        <Swiper 
            className="banner"
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            slidesPerView={2}
            navigation
            scrollbar={{ draggable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
        >
          {window.innerWidth > 767 ? 
          <>
            {isBanner ?
              <>
                {isBanner && isBanner.map((bn,index)=>(
                  <>
                    {/* <div className='BannerList' key={index}>
                      <img id="" src= {`${API_URL}/${bn}`} alt="."/> 
                    </div> */}
                    <SwiperSlide>
                      {/* <Link to="/products/1"> */}
                        <img src= {
                          process.env.NODE_ENV === 'production' 
                          ?`${bn}`
                          :`${API_URL}/${bn}`
                          } alt={`메인배너이미지 ${index}`}
                        />
                      {/* </Link> */}
                    </SwiperSlide>
                  </>
                  ))}
              </>
            : null 
            }
          </>
          :
          <>
            {isBanner ?
              <>
                {isMobileBanner && isMobileBanner.map((bn,index)=>(
                  <>
                    {/* <div className='BannerList' key={index}>
                      <img id="" src= {`${API_URL}/${bn}`} alt="."/> 
                    </div> */}
                    <SwiperSlide>
                      {/* <Link to={`/products/${bn}`}> */}
                        <img src= {
                          process.env.NODE_ENV === 'production' 
                          ?`${bn}`
                          :`${API_URL}/${bn}`
                          } alt={`메인배너이미지 ${index}`}
                        />
                      {/* </Link> */}
                    </SwiperSlide>
                  </>
                  ))}
              </>
            : null 
            }
          </> 
          }
        </Swiper>
    </div>
  )
}

export default MainPage;