import React from 'react'
import "../css/Footer.css";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className='Footer'>
      <div className='FooterWrapper'>
        <div className='Policy' style={{marginBottom:'30px'}}>
          <Link style={{color:'black',marginRight:'20px'}} className="" to="/AGREEMENT">AGREEMENT</Link>
          <Link style={{color:'black'}} className="" to="/PRIVACYPOLICY">PRIVACY POLICY</Link>
        </div>
        <div>
          <div className='dpspan'>업체명 : 라즈베리베리 </div>
          <div className='dpspan'>대표자 : 김영현 </div>
          <div className='dpspan'>사업장소재지 : 서울 강북구 인수봉로 23길 28(수유동,청화타운) 302호 </div>
        </div>
        <div>
          <div className='dpspan'>사업자번호 : 248-13-01765 </div>
          <div className='dpspan'>대표전화 : 010-4109-6590 </div>
          <div className='dpspan'>통신판매업 신고번호: 2022-서울강북-0258호 </div>
        </div>
        <div className='dpspan'>계좌번호:국민은행 856701-04-176572(김영현) </div>
        <div>
          <div style={{padding:'10px'}}>djdjdjk@hanmail.com </div>
          <div style={{marginBottom:'20px'}}>Copyright Reserved. </div>
        </div>
      </div>
    </div>
  )
}

export default Footer