import React, { useCallback, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {API_URL} from "../config/constants";
import { useHistory,useLocation,useParams }from "react-router-dom";
import "../css/Register.css";
import "../css/OrderPage.css";

import Test from "./Test"
import Payment from "./Payment";
import "../css/Register.css";
import { useSelector,useDispatch } from 'react-redux';

function OrderPage() {
    const dispatch = useDispatch();
    let userState = useSelector(state => state.user.user);
    let useProductOpt = useSelector(state => state.productoptionDetails.productoptionDetails);
    let [inputVal, inputChangeVal] = useState(userState.user_name);
    let [inputValPhone, inputChangeValPhone] = useState(userState.user_phonenumber);
    let [inputValEmail, inputChangeValEmail] = useState(userState.user_email);
    let [inputValMemo, inputChangeValMemo] = useState(null);
    let [siwpeOrder, setsiwpeOrder] = useState(false);//true면 paymeny컴포넌트 false면 유효성검사 component

    const { id } = useParams();//파라미터를 가져옴

    let Session = sessionStorage.getItem('user_id');


    //주소에 따른 배송비
    let userStateAddress = useSelector(state => state.setaddress.setaddress);
    let [isuserStateAddress, setuserStateAddress] = useState(null);
    let [deliveryconst, setdeliveryconst] = useState(100);


    //비회원 개인정보 체크박스 
    const [isAllChecked, setIsAllChecked] = useState(false)
    const [checkedItems, setCheckedItems] = useState([])

    const allAgreeHandler = (checked) => {
        setIsAllChecked(!isAllChecked)
        if (checked) {
          setCheckedItems([...checkedItems, 'provision', 'privacy'])
        } else if ((!checked && checkedItems.includes('provision')) || (!checked && checkedItems.includes('privacy'))) {
          setCheckedItems([])
        }
    }
    const agreeHandler = (checked, value) => {
        if (checked) {
            setCheckedItems([...checkedItems, value])
        } else if (!checked && checkedItems.includes(value)) {
            setCheckedItems(checkedItems.filter((el) => el !== value))
        }
    }

    const [htmlData, setHtmlData] = useState(userState.user_address);
    const [htmlDatadetail, setHtmlDatadetail] = useState(userState.user_address_detail);
    const location = useLocation()
    const history = useHistory();
    const product_option_id = String(useProductOpt.isProductId)
    const Producttitle = useProductOpt.p_name
    const Productcolor = useProductOpt.isColorName
    const Productsize = useProductOpt.isShowSizeName
    const Productprice = useProductOpt.p_price
    const Productimg = useProductOpt.p_imgUrl
    const ProductStock = useProductOpt.isnowProductNum
    const ProductOrderNum = useProductOpt.isCartUi
    const product_it_id = useProductOpt.it_id

    const initialValues = {
        user_name: "",
        user_address:"",
        user_address_detail:"",
        user_phonenumber:"",
        user_email:"",
        picked: "card"
    };

    let [ispayMethod, setpayMethod] = useState(initialValues.picked);

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const validationSchema = Yup.object().shape({
        user_name: Yup.string().min(2, '아이디는 2글자 이상입니다.').max(10, '아이디는 10글자를 넘지 못해요.'),
        user_email: Yup.string().email('이메일형식이 아닙니다.').max(255),
        user_phonenumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid')
    });
    
    const onSubmit = useCallback(
        (data) => {
            const name_naming = document.getElementById('inputCreatePostuser_name').value;
            const phone_naming = document.getElementById('inputCreatePostuser_phone').value;
            const email_naming = document.getElementById('inputCreatePostuser_email').value;
            const user_address1 = document.getElementById('inputAdd').value;
            const user_address2 = document.getElementById('inputdetailAdd').value;
            data.user_address =  user_address1;
            data.user_address_detail = user_address2;
            console.log("data",data);
            if (name_naming == ""){
                alert('주문자명을 확인해주세요.')
                return;
            }else if(user_address1 == "" || user_address2 == ""){
                alert('주소, 상세주소를 입력해주세요.')
                return;
            }else if(phone_naming.length < 10 ){
                alert('핸드폰번호를 확인해주세요.')
                return;
            }else if(email_naming == ""){
                alert('이메일을 입력해주세요.')
                return;
            }else if(isAllChecked == false){
                alert('약관을 모두동의해주세요')
                return;
            }
            setpayMethod(data.picked)
            // axios.post(`${API_URL}/v1/user_inform`, data).then(()=>{
            //     console.log(data);
            // })
        },[isAllChecked],
    );
    // useEffect(()=>{
    //     setpayMethod(ispayMethod)
    // },[ispayMethod])
    useEffect(() => {

        setHtmlData(document.getElementById("inputAdd").value)
        setHtmlDatadetail(document.getElementById("inputdetailAdd").value)
        setuserStateAddress(userStateAddress)
        // console.log("isuserStateAddress",isuserStateAddress);
        
        //주소에따른 배송비
        if(isuserStateAddress == null || isuserStateAddress == [] ){
            return;
        }else{
            const delivery2 = Number(isuserStateAddress.zonecode);
        
            if(delivery2 === 63000 || delivery2 === 63001 ){//제주 추자면 : 7,000원
                setdeliveryconst(7000);
            }else if(delivery2 === 63365){//제주 우도 : 6,000원
                setdeliveryconst(6000);
            }else if(delivery2 >= 59781 && delivery2 <= 59790 ){//전남 여수 섬지역3 : 8,000원
                setdeliveryconst(8000);
            }else if(delivery2 === 59766 ){//전남 여수 섬지역2 : 8,000원
                setdeliveryconst(8000);
            }else if(delivery2 === 59650 ){//전남 여수 섬지역1 : 8,000원
                setdeliveryconst(8000);
            }else if(delivery2 === 59658 ){//전남 고흥 섬지역4 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 59563 ){//전남 고흥 섬지역3 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 59551 ){//전남 고흥 섬지역2 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 59531 ){//전남 고흥 섬지역1 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 59421 ){//전남 보성 섬지역 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 >= 59137 && delivery2 <= 59166 ){//전남 완도 섬지역5 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 59129 ){//전남 완도 섬지역4 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 59127 ){//전남 완도 섬지역3 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 59106 ){//전남 완도 섬지역2 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 59102 || delivery2 === 59103 ){// 전남 완도 섬지역1 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 >= 58953 && delivery2 <= 58958 ){// 전남 진도 섬지역 : 7,000원
                setdeliveryconst(7000);
            }else if(delivery2 >= 58828 && delivery2 <= 58866 ){//전남 신안 섬지역4 : 7,000원
                setdeliveryconst(7000);
            }else if(delivery2 === 58826 ){//전남 신안 섬지역3 : 7,000원
                setdeliveryconst(7000);
            }else if(delivery2 >= 58816 && delivery2 <= 58818 ){//전남 신안 섬지역2 : 7,000원
                setdeliveryconst(7000);
            }else if(delivery2 >= 58800 && delivery2 <= 58810 ){//전남 신안 섬지역1 : 7,000원
                setdeliveryconst(7000);
            }else if(delivery2 >= 58760 && delivery2 <= 58762 ){//전남 목포 섬지역 : 6,000원
                setdeliveryconst(6000);
            }else if(delivery2 >= 57068 && delivery2 <= 57069 ){//전남 영광 섬지역 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 >= 56347 && delivery2 <= 56349 ){//전북 부안 섬지역 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 >= 46768 && delivery2 <= 46771 ){//부산 강서구 섬지역 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 === 54000 ){//경남 통영 섬지역3 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 >= 53089 && delivery2 <= 53104 ){//경남 통영 섬지역2 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 >= 53031 && delivery2 <= 53033 ){//경남 통영 섬지역1 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 >= 52570 && delivery2 <= 52571 ){//경남 사천 섬지역 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 >= 40200 && delivery2 <= 40240 ){//경북 울릉도 전지역 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 === 33411 ){//충남 보령 섬지역 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 32133 ){//충남 태안 섬지역 : 5,000원
                setdeliveryconst(5000);
            }else if(delivery2 === 31708 ){//충남 당진 섬지역 : 4,000원
                setdeliveryconst(4000);
            }else if(delivery2 >= 23124 && delivery2 <= 23136 ){//인천 옹진 섬지역2 : 6,000원
                setdeliveryconst(6000);
            }else if(delivery2 >= 23100 && delivery2 <= 23116 ){//인천 옹진 섬지역1 : 6,000원
                setdeliveryconst(6000);
            }else if(delivery2 >= 23004 && delivery2 <= 23010 ){//인천 강화 섬지역 : 4,500원
                setdeliveryconst(4500);
            }else if(delivery2 >= 22386 && delivery2 <= 22388 ){//인천 중구 섬지역 : 6,000원
                setdeliveryconst(6000);
            }else{
                setdeliveryconst(100);//그외 전부 3000원
            }
        }

    },[htmlData,htmlDatadetail,inputValMemo,isuserStateAddress,userStateAddress,deliveryconst])
    const formik = useFormik({
        initialValues
    })
    useEffect(() => {
            const name_naming = document.getElementById('inputCreatePostuser_name').value;
            const phone_naming = document.getElementById('inputCreatePostuser_phone').value;
            const email_naming = document.getElementById('inputCreatePostuser_email').value;
            const user_address1 = document.getElementById('inputAdd').value;
            const user_address2 = document.getElementById('inputdetailAdd').value;
            if (name_naming == ""){
                setsiwpeOrder(false);
                return;
            }else if(user_address1 == ""){
                setsiwpeOrder(false);
                return;
            }else if(phone_naming.length < 10 ){
                setsiwpeOrder(false);
                return;
            }else if(email_naming == ""){
                setsiwpeOrder(false);
                return;
            }else if(isAllChecked == false){
                setsiwpeOrder(false);
                if(Session !== null){
                    setsiwpeOrder(true);    
                }
                return
            }else{
                setsiwpeOrder(true);    
            }
    }, [inputValEmail,siwpeOrder,isAllChecked])
    
    useEffect(() => {
        if (checkedItems.length >= 2) {
            setIsAllChecked(true)
        } else {
            setIsAllChecked(false)
        }
    }, [checkedItems])
    
    if (useProductOpt == "" || useProductOpt == null || useProductOpt == undefined ){//리덕스 새로고침시 state없어져서 루트로 보냄 
        history.push("/");
    }

    console.log("useProductOpt :", useProductOpt);
    // const heyy = {"name":3}
    // console.log(heyy.name);
    return (
        <div>
            <Formik
                initialValues = {formik.initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    {Session == null ?<div className="registerTop">(비회원)주문</div> : <div className="registerTop">주문상품</div> }
                        <div className='OrderPage_productArea_wrapper'>
                            <div className='OrderPage_productArea_wrapper_left'>
                                <img style={{width:'90px'}}src={`${API_URL}/${Productimg}`} alt="ThumbImage" />
                            </div>
                            <div className='OrderPage_productArea_wrapper_right'>
                                <div>{`${Producttitle} / ${Productsize} / ${Productcolor} / ${ProductOrderNum}개` }</div>
                                <div className='OrderPage_Productprice'>{Productprice * ProductOrderNum} won + 
                                <span style={{fontSize:'25px'}}> 배송비 </span>
                                <span id="deliveryconst">({deliveryconst} won)</span>
                                </div>
                            </div>
                            
                        </div>
                        <div className='totalPriced'>
                            총비용 : {Productprice * ProductOrderNum + deliveryconst} won
                        </div>
                    <h2 className="registerTop">배송지</h2>
                    {/* 아이디 */}
                    <label className='borderLine'> 주문자명 :</label>
                    <ErrorMessage name="user_name" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_name"
                        name="user_name"
                        placeholder="이름"
                        className="input_id"
                        value={inputVal}
                        onChange={ (e)=>{inputChangeVal(e.target.value)} }
                    />
                    {/* 주소 */}
                    <label> 주소 :</label>
                    <span style={{color:'black',padding:'10px'}}>(제주 및 도서 산간 지역의 배송은 추가 배송비가 발생할 수 있습니다.)</span>
                    <Test value={htmlData} 
                        onChange={ (e)=>{setHtmlData(e.target.value)} }
                    />
                    
                    <label> 핸드폰번호 :</label>
                    <ErrorMessage name="user_phonenumber" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_phone"
                        name="user_phonenumber"
                        placeholder="(-) 없이입력해주세요"
                        className="input_id"
                        value={inputValPhone}
                        onChange={ (e)=>{inputChangeValPhone(e.target.value)} }
                    />
                    {/* 이메일주소 */}
                    <label> 이메일 :</label>
                    <ErrorMessage name="user_email" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_email"
                        name="user_email"
                        placeholder="abc@naver.com"
                        className="input_id"
                        value={inputValEmail}
                        onChange={ (e)=>{inputChangeValEmail(e.target.value)} }
                    />
                    {/* 메모 */}
                    <label> 배송 시 요청 사항 :</label>
                    <ErrorMessage name="user_momo" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePostuser_momo"
                        name="user_momo"
                        placeholder=""
                        className="input_id"
                        value={inputValMemo}
                        onChange={ (e)=>{inputChangeValMemo(e.target.value)} }
                    />
                    
                    {/* 비회원일경우  */}
                    {
                        Session == null 
                        ? 
                        <>
                            {/* 이용약관 */}
                            <strong>[필수]이용약관 동의</strong>
                            <div className='contents'>
                                <div className="contentinPre">
                                    <pre style={{whiteSpace:'break-spaces'}}>
                                        <br/>
                                        이용약관
                                        <br/><br/>
                                        제1조(목적)
                                        <br/><br/>
                                        이 약관은 라즈베리베리 (전자상거래 사업자)가 운영하는 라즈베리베리(이하 “몰”이라 한다)에서 제공하는 인터넷 관련 서비스(이하 “서비스”라 한다)를 이용함에 있어 사이버 몰과 이용자의 권리․의무 및 책임사항을 규정함을 목적으로 합니다.
                                        <br/>
                                        ※「PC통신, 무선 등을 이용하는 전자상거래에 대해서도 그 성질에 반하지 않는 한 이 약관을 준용합니다.」
                                        <br/><br/>
                                        제2조(정의)
                                        <br/><br/>
                                        ① “몰”이란 OO 회사가 재화 또는 용역(이하 “재화 등”이라 함)을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이버몰을 운영하는 사업자의 의미로도 사용합니다.
                                        <br/>
                                        ② “이용자”란 “몰”에 접속하여 이 약관에 따라 “몰”이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
                                        <br/>
                                        ③ ‘회원’이라 함은 “몰”에 회원등록을 한 자로서, 계속적으로 “몰”이 제공하는 서비스를 이용할 수 있는 자를 말합니다.
                                        <br/>
                                        ④ ‘비회원’이라 함은 회원에 가입하지 않고 “몰”이 제공하는 서비스를 이용하는 자를 말합니다.
                                        <br/><br/>
                                        제3조 (약관 등의 명시와 설명 및 개정) 
                                        <br/><br/>
                                        ① “몰”은 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호․모사전송번호․전자우편주소, 사업자등록번호, 통신판매업 신고번호, 개인정보관리책임자등을 이용자가 쉽게 알 수 있도록 라즈베리베리의 초기 서비스화면(전면)에 게시합니다. 다만, 약관의 내용은 이용자가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.
                                        <br/>
                                        ② “몰은 이용자가 약관에 동의하기에 앞서 약관에 정하여져 있는 내용 중 청약철회․배송책임․환불조건 등과 같은 중요한 내용을 이용자가 이해할 수 있도록 별도의 연결화면 또는 팝업화면 등을 제공하여 이용자의 확인을 구하여야 합니다.
                                        <br/>
                                        ③ “몰”은 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」, 「전자문서 및 전자거래기본법」, 「전자금융거래법」, 「전자서명법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「방문판매 등에 관한 법률」, 「소비자기본법」 등 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
                                        <br/>
                                        ④ “몰”이 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 몰의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다. 다만, 이용자에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 공지합니다.이 경우 "몰“은 개정 전 내용과 개정 후 내용을 명확하게 비교하여 이용자가 알기 쉽도록 표시합니다. 
                                        <br/>
                                        ⑤ “몰”이 약관을 개정할 경우에는 그 개정약관은 그 적용일자 이후에 체결되는 계약에만 적용되고 그 이전에 이미 체결된 계약에 대해서는 개정 전의 약관조항이 그대로 적용됩니다. 다만 이미 계약을 체결한 이용자가 개정약관 조항의 적용을 받기를 원하는 뜻을 제3항에 의한 개정약관의 공지기간 내에 “몰”에 송신하여 “몰”의 동의를 받은 경우에는 개정약관 조항이 적용됩니다.
                                        <br/>
                                        ⑥ 이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제 등에 관한 법률, 공정거래위원회가 정하는 전자상거래 등에서의 소비자 보호지침 및 관계법령 또는 상관례에 따릅니다.
                                        <br/><br/>
                                        제4조(서비스의 제공 및 변경) 
                                        <br/><br/>
                                        ① “몰”은 다음과 같은 업무를 수행합니다.
                                        <br/>
                                        1. 재화 또는 용역에 대한 정보 제공 및 구매계약의 체결
                                        2. 구매계약이 체결된 재화 또는 용역의 배송
                                        3. 기타 “몰”이 정하는 업무
                                        <br/>
                                        ② “몰”은 재화 또는 용역의 품절 또는 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 제공할 재화 또는 용역의 내용을 변경할 수 있습니다. 이 경우에는 변경된 재화 또는 용역의 내용 및 제공일자를 명시하여 현재의 재화 또는 용역의 내용을 게시한 곳에 즉시 공지합니다.
                                        <br/>
                                        ③ “몰”이 제공하기로 이용자와 계약을 체결한 서비스의 내용을 재화등의 품절 또는 기술적 사양의 변경 등의 사유로 변경할 경우에는 그 사유를 이용자에게 통지 가능한 주소로 즉시 통지합니다.
                                        <br/>
                                        ④ 전항의 경우 “몰”은 이로 인하여 이용자가 입은 손해를 배상합니다. 다만, “몰”이 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
                                        <br/><br/>
                                        제5조(서비스의 중단) 
                                        <br/><br/>
                                        ① “몰”은 컴퓨터 등 정보통신설비의 보수점검․교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
                                        <br/>
                                        ② “몰”은 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, “몰”이 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
                                        <br/>
                                        ③ 사업종목의 전환, 사업의 포기, 업체 간의 통합 등의 이유로 서비스를 제공할 수 없게 되는 경우에는 “몰”은 제8조에 정한 방법으로 이용자에게 통지하고 당초 “몰”에서 제시한 조건에 따라 소비자에게 보상합니다. 다만, “몰”이 보상기준 등을 고지하지 아니한 경우에는 이용자들의 마일리지 또는 적립금 등을 “몰”에서 통용되는 통화가치에 상응하는 현물 또는 현금으로 이용자에게 지급합니다.
                                        <br/><br/>
                                        제6조(회원 가입) 
                                        <br/><br/>
                                        ① 이용자는 “몰”이 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원 가입을 신청합니다.
                                        <br/>
                                        ② “몰”은 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
                                        <br/>
                                        1. 가입신청자가 이 약관 제7조제3항에 의하여 이전에 회원자격을 상실한 적이 있는 경우, 다만 제7조제3항에 의한 회원자격 상실 후 3년이 경과한 자로서 “몰”의 회원재가입 승낙을 얻은 경우에는 예외로 한다.
                                        2. 등록 내용에 허위, 기재누락, 오기가 있는 경우
                                        3. 기타 회원으로 등록하는 것이 “몰”의 기술상 현저히 지장이 있다고 판단되는 경우
                                        <br/>
                                        ③ 회원 가입계약의 성립 시기는 “몰”의 승낙이 회원에게 도달한 시점으로 합니다.
                                        <br/>
                                        ④ 회원은 회원 가입 시 등록한 사항에 변경이 있는 경우, 상당한 기간 이내에 “몰”에 대하여 회원정보 수정 등의 방법으로 그 변경사항을 알려야 합니다.
                                        <br/><br/>
                                        제7조(회원 탈퇴 및 자격 상실 등) 
                                        <br/><br/>
                                        ① 회원은 “몰”에 언제든지 탈퇴를 요청할 수 있으며 “몰”은 즉시 회원탈퇴를 처리합니다.
                                        <br/>
                                        ② 회원이 다음 각 호의 사유에 해당하는 경우, “몰”은 회원자격을 제한 및 정지시킬 수 있습니다.
                                        <br/>
                                        1. 가입 신청 시에 허위 내용을 등록한 경우
                                        2. “몰”을 이용하여 구입한 재화 등의 대금, 기타 “몰”이용에 관련하여 회원이 부담하는 채무를 기일에 지급하지 않는 경우
                                        3. 다른 사람의 “몰” 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우
                                        4. “몰”을 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우
                                        <br/>
                                        ③ “몰”이 회원 자격을 제한․정지 시킨 후, 동일한 행위가 2회 이상 반복되거나 30일 이내에 그 사유가 시정되지 아니하는 경우 “몰”은 회원자격을 상실시킬 수 있습니다.
                                        <br/>
                                        ④ “몰”이 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이 경우 회원에게 이를 통지하고, 회원등록 말소 전에 최소한 30일 이상의 기간을 정하여 소명할 기회를 부여합니다.
                                        <br/><br/>
                                        제8조(회원에 대한 통지)
                                        <br/><br/>
                                        ① “몰”이 회원에 대한 통지를 하는 경우, 회원이 “몰”과 미리 약정하여 지정한 전자우편 주소로 할 수 있습니다.
                                        <br/>
                                        ② “몰”은 불특정다수 회원에 대한 통지의 경우 1주일이상 “몰” 게시판에 게시함으로서 개별 통지에 갈음할 수 있습니다. 다만, 회원 본인의 거래와 관련하여 중대한 영향을 미치는 사항에 대하여는 개별통지를 합니다.
                                        <br/><br/>
                                        제9조(구매신청 및 개인정보 제공 동의 등) 
                                        <br/><br/>
                                        ① “몰”이용자는 “몰”상에서 다음 또는 이와 유사한 방법에 의하여 구매를 신청하며, “몰”은 이용자가 구매신청을 함에 있어서 다음의 각 내용을 알기 쉽게 제공하여야 합니다. 
                                        <br/>
                                        1. 재화 등의 검색 및 선택
                                        2. 받는 사람의 성명, 주소, 전화번호, 전자우편주소(또는 이동전화번호) 등의 입력
                                        3. 약관내용, 청약철회권이 제한되는 서비스, 배송료․설치비 등의 비용부담과 관련한 내용에 대한 확인
                                        4. 이 약관에 동의하고 위 3.호의 사항을 확인하거나 거부하는 표시(예, 마우스 클릭)
                                        5. 재화등의 구매신청 및 이에 관한 확인 또는 “몰”의 확인에 대한 동의
                                        6. 결제방법의 선택
                                        <br/>
                                        ② “몰”이 제3자에게 구매자 개인정보를 제공할 필요가 있는 경우 1) 개인정보를 제공받는 자, 2)개인정보를 제공받는 자의 개인정보 이용목적, 3) 제공하는 개인정보의 항목, 4) 개인정보를 제공받는 자의 개인정보 보유 및 이용기간을 구매자에게 알리고 동의를 받아야 합니다. (동의를 받은 사항이 변경되는 경우에도 같습니다.)
                                        <br/>
                                        ③ “몰”이 제3자에게 구매자의 개인정보를 취급할 수 있도록 업무를 위탁하는 경우에는 1) 개인정보 취급위탁을 받는 자, 2) 개인정보 취급위탁을 하는 업무의 내용을 구매자에게 알리고 동의를 받아야 합니다. (동의를 받은 사항이 변경되는 경우에도 같습니다.) 다만, 서비스제공에 관한 계약이행을 위해 필요하고 구매자의 편의증진과 관련된 경우에는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에서 정하고 있는 방법으로 개인정보 취급방침을 통해 알림으로써 고지절차와 동의절차를 거치지 않아도 됩니다.
                                        <br/><br/>
                                        제10조 (계약의 성립)
                                        <br/><br/>
                                        ①“몰”은 제9조와 같은 구매신청에 대하여 다음 각 호에 해당하면 승낙하지 않을 수 있습니다. 다만, 미성년자와 계약을 체결하는 경우에는 법정대리인의 동의를 얻지 못하면 미성년자 본인 또는 법정대리인이 계약을 취소할 수 있다는 내용을 고지하여야 합니다.
                                        <br/>
                                        1. 신청 내용에 허위, 기재누락, 오기가 있는 경우
                                        2. 미성년자가 담배, 주류 등 청소년보호법에서 금지하는 재화 및 용역을 구매하는 경우
                                        3. 기타 구매신청에 승낙하는 것이 “몰” 기술상 현저히 지장이 있다고 판단하는 경우
                                        <br/>
                                        ② “몰”의 승낙이 제12조제1항의 수신확인통지형태로 이용자에게 도달한 시점에 계약이 성립한 것으로 봅니다.
                                        <br/>
                                        ③ “몰”의 승낙의 의사표시에는 이용자의 구매 신청에 대한 확인 및 판매가능 여부, 구매신청의 정정 취소 등에 관한 정보 등을 포함하여야 합니다.
                                        <br/><br/>
                                        제11조(지급방법)
                                        <br/><br/>
                                        “몰”에서 구매한 재화 또는 용역에 대한 대금지급방법은 다음 각 호의 방법중 가용한 방법으로 할 수 있습니다. 단, “몰”은 이용자의 지급방법에 대하여 재화 등의 대금에 어떠한 명목의 수수료도추가하여 징수할 수 없습니다.
                                        <br/>
                                        1. 폰뱅킹, 인터넷뱅킹, 메일 뱅킹 등의 각종 계좌 이체 
                                        2. 선불카드, 직불카드, 신용카드 등의 각종 카드 결제
                                        3. 온라인 무통장 입금
                                        4. 전자화폐에 의한 결제
                                        5. 수령 시 대금지급
                                        6. 마일리지 등 “몰”이 지급한 포인트에 의한 결제
                                        7. “몰”과 계약을 맺었거나 “몰”이 인정한 상품권에 의한 결제
                                        8. 기타 전자적 지급 방법에 의한 대금 지급 등
                                        <br/><br/>
                                        제12조(수신확인통지․구매신청 변경 및 취소)
                                        <br/><br/>
                                        ① “몰”은 이용자의 구매신청이 있는 경우 이용자에게 수신확인통지를 합니다.
                                        <br/>
                                        ② 수신확인통지를 받은 이용자는 의사표시의 불일치 등이 있는 경우에는 수신확인통지를 받은 후 즉시 구매신청 변경 및 취소를 요청할 수 있고 “몰”은 배송 전에 이용자의 요청이 있는 경우에는 지체 없이 그 요청에 따라 처리하여야 합니다. 다만 이미 대금을 지불한 경우에는 제15조의 청약철회 등에 관한 규정에 따릅니다.
                                        <br/><br/>
                                        제13조(재화 등의 공급)
                                        <br/><br/>
                                        ① “몰”은 이용자와 재화 등의 공급시기에 관하여 별도의 약정이 없는 이상, 이용자가 청약을 한 날부터 7일 이내에 재화 등을 배송할 수 있도록 주문제작, 포장 등 기타의 필요한 조치를 취합니다. 다만, “몰”이 이미 재화 등의 대금의 전부 또는 일부를 받은 경우에는 대금의 전부 또는 일부를 받은 날부터 3영업일 이내에 조치를 취합니다.이때 “몰”은 이용자가 재화 등의 공급 절차 및 진행 사항을 확인할 수 있도록 적절한 조치를 합니다.
                                        <br/>
                                        ② “몰”은 이용자가 구매한 재화에 대해 배송수단, 수단별 배송비용 부담자, 수단별 배송기간 등을 명시합니다. 만약 “몰”이 약정 배송기간을 초과한 경우에는 그로 인한 이용자의 손해를 배상하여야 합니다. 다만 “몰”이 고의․과실이 없음을 입증한 경우에는 그러하지 아니합니다.
                                        <br/><br/>
                                        제14조(환급)
                                        <br/><br/>
                                        “몰”은 이용자가 구매신청한 재화 등이 품절 등의 사유로 인도 또는 제공을 할 수 없을 때에는 지체 없이 그 사유를 이용자에게 통지하고 사전에 재화 등의 대금을 받은 경우에는 대금을 받은 날부터 3영업일 이내에 환급하거나 환급에 필요한 조치를 취합니다.
                                        <br/><br/>
                                        제15조(청약철회 등)
                                        <br/><br/>
                                        ① “몰”과 재화등의 구매에 관한 계약을 체결한 이용자는 「전자상거래 등에서의 소비자보호에 관한 법률」 제13조 제2항에 따른 계약내용에 관한 서면을 받은 날(그 서면을 받은 때보다 재화 등의 공급이 늦게 이루어진 경우에는 재화 등을 공급받거나 재화 등의 공급이 시작된 날을 말합니다)부터 7일 이내에는 청약의 철회를 할 수 있습니다. 다만, 청약철회에 관하여 「전자상거래 등에서의 소비자보호에 관한 법률」에 달리 정함이 있는 경우에는 동 법 규정에 따릅니다. 
                                        <br/>
                                        ② 이용자는 재화 등을 배송 받은 경우 다음 각 호의 1에 해당하는 경우에는 반품 및 교환을 할 수 없습니다.
                                        <br/>
                                        1. 이용자에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우(다만, 재화 등의 내용을 확인하기 위하여 포장 등을 훼손한 경우에는 청약철회를 할 수 있습니다)
                                        2. 이용자의 사용 또는 일부 소비에 의하여 재화 등의 가치가 현저히 감소한 경우
                                        3. 시간의 경과에 의하여 재판매가 곤란할 정도로 재화등의 가치가 현저히 감소한 경우
                                        4. 같은 성능을 지닌 재화 등으로 복제가 가능한 경우 그 원본인 재화 등의 포장을 훼손한 경우
                                        <br/>
                                        ③ 제2항제2호 내지 제4호의 경우에 “몰”이 사전에 청약철회 등이 제한되는 사실을 소비자가 쉽게 알 수 있는 곳에 명기하거나 시용상품을 제공하는 등의 조치를 하지 않았다면 이용자의 청약철회 등이 제한되지 않습니다.
                                        <br/>
                                        ④ 이용자는 제1항 및 제2항의 규정에 불구하고 재화 등의 내용이 표시·광고 내용과 다르거나 계약내용과 다르게 이행된 때에는 당해 재화 등을 공급받은 날부터 3월 이내, 그 사실을 안 날 또는 알 수 있었던 날부터 30일 이내에 청약철회 등을 할 수 있습니다.
                                        <br/><br/>
                                        제16조(청약철회 등의 효과)
                                        <br/><br/>
                                        ① “몰”은 이용자로부터 재화 등을 반환받은 경우 3영업일 이내에 이미 지급받은 재화 등의 대금을 환급합니다. 이 경우 “몰”이 이용자에게 재화등의 환급을 지연한때에는 그 지연기간에 대하여 「전자상거래 등에서의 소비자보호에 관한 법률 시행령」제21조의2에서 정하는 지연이자율을 곱하여 산정한 지연이자를 지급합니다.
                                        <br/>
                                        ② “몰”은 위 대금을 환급함에 있어서 이용자가 신용카드 또는 전자화폐 등의 결제수단으로 재화 등의 대금을 지급한 때에는 지체 없이 당해 결제수단을 제공한 사업자로 하여금 재화 등의 대금의 청구를 정지 또는 취소하도록 요청합니다.
                                        <br/>
                                        ③ 청약철회 등의 경우 공급받은 재화 등의 반환에 필요한 비용은 이용자가 부담합니다. “몰”은 이용자에게 청약철회 등을 이유로 위약금 또는 손해배상을 청구하지 않습니다. 다만 재화 등의 내용이 표시·광고 내용과 다르거나 계약내용과 다르게 이행되어 청약철회 등을 하는 경우 재화 등의 반환에 필요한 비용은 “몰”이 부담합니다.
                                        <br/>
                                        ④ 이용자가 재화 등을 제공받을 때 발송비를 부담한 경우에 “몰”은 청약철회 시 그 비용을누가 부담하는지를 이용자가 알기 쉽도록 명확하게 표시합니다.
                                        <br/><br/>
                                        제17조(개인정보보호)
                                        <br/><br/>
                                        ① “몰”은 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다. 
                                        <br/>
                                        ② “몰”은 회원 가입시 구매계약이행에 필요한 정보를 미리 수집하지 않습니다. 다만, 관련 법령상 의무이행을 위하여 구매계약 이전에 본인확인이 필요한 경우로서 최소한의 특정 개인정보를 수집하는 경우에는 그러하지 아니합니다.
                                        <br/>
                                        ③ “몰”은 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다. 
                                        <br/>
                                        ④ “몰”은 수집된 개인정보를 목적외의 용도로 이용할 수 없으며, 새로운 이용목적이 발생한 경우 또는 제3자에게 제공하는 경우에는 이용·제공단계에서 당해 이용자에게 그 목적을 고지하고 동의를 받습니다. 다만, 관련 법령에 달리 정함이 있는 경우에는 예외로 합니다.
                                        <br/>
                                        ⑤ “몰”이 제2항과 제3항에 의해 이용자의 동의를 받아야 하는 경우에는 개인정보관리 책임자의 신원(소속, 성명 및 전화번호, 기타 연락처), 정보의 수집목적 및 이용목적, 제3자에 대한 정보제공 관련사항(제공받은자, 제공목적 및 제공할 정보의 내용) 등 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제22조제2항이 규정한 사항을 미리 명시하거나 고지해야 하며 이용자는 언제든지 이 동의를 철회할 수 있습니다.
                                        <br/>
                                        ⑥ 이용자는 언제든지 “몰”이 가지고 있는 자신의 개인정보에 대해 열람 및 오류정정을 요구할 수 있으며 “몰”은 이에 대해 지체 없이 필요한 조치를 취할 의무를 집니다. 이용자가 오류의 정정을 요구한 경우에는 “몰”은 그 오류를 정정할 때까지 당해 개인정보를 이용하지 않습니다.
                                        <br/>
                                        ⑦ “몰”은 개인정보 보호를 위하여 이용자의 개인정보를 취급하는 자를최소한으로 제한하여야 하며 신용카드, 은행계좌 등을 포함한 이용자의 개인정보의 분실, 도난, 유출, 동의 없는 제3자 제공, 변조 등으로 인한 이용자의 손해에 대하여 모든 책임을 집니다.
                                        <br/>
                                        ⑧ “몰” 또는 그로부터 개인정보를 제공받은 제3자는 개인정보의 수집목적 또는 제공받은 목적을 달성한 때에는 당해 개인정보를 지체 없이 파기합니다.
                                        <br/>
                                        ⑨ “몰”은 개인정보의 수집·이용·제공에 관한 동의 란을 미리 선택한 것으로 설정해두지 않습니다. 또한 개인정보의 수집·이용·제공에 관한 이용자의 동의거절시 제한되는 서비스를 구체적으로 명시하고, 필수수집항목이 아닌 개인정보의 수집·이용·제공에 관한 이용자의 동의 거절을 이유로 회원 가입 등 서비스 제공을 제한하거나 거절하지 않습니다.
                                        <br/><br/>
                                        제18조(정보의 제공 및 광고의 게제)
                                        <br/><br/>
                                        ① “몰”은 서비스 이용 중 필요하다고 인정되는 다양한 마케팅 정보 등을 전자우편이나 서신 우편, SMS, 전화, 알림 메시지(Push Notification), 회원 연락처와 연동된 SNS 서비스 등의 방법으로 회원에게 제공할 수 있으며, 회원은 이에 동의합니다. 이 경우, 회원의 통신환경 또는 요금구조 등에 따라 회원이 데이터 요금 등을 부담할 수 있습니다.
                                        <br/>
                                        ② 회원은 관련법에 따른 거래 관련 정보 및 고객 문의 등에 대한 답변 등을 제외하고는 언제든지 전항의 전자우편 등에 대해서 수신 거절을 할 수 있으며, 이 경우 “몰”은 즉시 전항의 마케팅 정보 등을 제공하는 행위를 중단합니다.
                                        <br/><br/>
                                        제19조(“몰“의 의무)
                                        <br/><br/>
                                        ① “몰”은 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 안정적으로 재화․용역을 제공하는데 최선을 다하여야 합니다.
                                        <br/>
                                        ② “몰”은 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보(신용정보 포함)보호를 위한 보안 시스템을 갖추어야 합니다.
                                        <br/>
                                        ③ “몰”이 상품이나 용역에 대하여 「표시․광고의 공정화에 관한 법률」 제3조 소정의 부당한 표시․광고행위를 함으로써 이용자가 손해를 입은 때에는 이를 배상할 책임을 집니다.
                                        <br/>
                                        ④ “몰”은 이용자가 원하지 않는 영리목적의 광고성 전자우편을 발송하지 않습니다.
                                        <br/><br/>
                                        제20조(회원의 ID 및 비밀번호에 대한 의무)
                                        <br/><br/>
                                        ① 제17조의 경우를 제외한 ID와 비밀번호에 관한 관리책임은 회원에게 있습니다.
                                        <br/>
                                        ② 회원은 자신의 ID 및 비밀번호를 제3자에게 이용하게 해서는 안됩니다.
                                        <br/>
                                        ③ 회원이 자신의 ID 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 바로 “몰”에 통보하고 “몰”의 안내가 있는 경우에는 그에 따라야 합니다.
                                        <br/><br/>
                                        제21조(이용자의 의무)
                                        <br/><br/>
                                        이용자는 다음 행위를 하여서는 안 됩니다.
                                        <br/>
                                        1. 신청 또는 변경시 허위 내용의 등록
                                        2. 타인의 정보 도용
                                        3. “몰”에 게시된 정보의 변경
                                        4. “몰”이 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시
                                        5. “몰” 기타 제3자의 저작권 등 지적재산권에 대한 침해
                                        6. “몰” 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
                                        7. 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 몰에 공개 또는 게시하는 행위
                                        <br/><br/>
                                        제22조(연결“몰”과 피연결“몰” 간의 관계)
                                        <br/><br/>
                                        ① 상위 “몰”과 하위 “몰”이 하이퍼링크(예: 하이퍼링크의 대상에는 문자, 그림 및 동화상 등이 포함됨)방식 등으로 연결된 경우, 전자를 연결 “몰”(웹 사이트)이라고 하고 후자를 피연결 “몰”(웹사이트)이라고 합니다.
                                        <br/>
                                        ② 연결“몰”은 피연결“몰”이 독자적으로 제공하는 재화 등에 의하여 이용자와 행하는 거래에 대해서 보증 책임을 지지 않는다는 뜻을 연결“몰”의 초기화면 또는 연결되는 시점의 팝업화면으로 명시한 경우에는 그 거래에 대한 보증 책임을 지지 않습니다.
                                        <br/><br/>
                                        제23조(저작권의 귀속 및 이용제한)
                                        <br/><br/>
                                        ① “몰“이 작성한 저작물에 대한 저작권 기타 지적재산권은 ”몰“에 귀속합니다.
                                        <br/>
                                        ② 이용자는 “몰”을 이용함으로써 얻은 정보 중 “몰”에게 지적재산권이 귀속된 정보를 “몰”의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
                                        <br/>
                                        ③ “몰”은 약정에 따라 이용자에게 귀속된 저작권을 사용하는 경우 당해 이용자에게 통보하여야 합니다.
                                        <br/><br/>
                                        제24조(분쟁해결)
                                        <br/><br/>
                                        ① “몰”은 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치․운영합니다.
                                        <br/>
                                        ② “몰”은 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 즉시 통보해 드립니다.
                                        <br/>
                                        ③ “몰”과 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해구제신청이 있는 경우에는 공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
                                        <br/><br/>
                                        제25조(재판권 및 준거법)
                                        <br/><br/>
                                        ① “몰”과 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 다만, 제소 당시 이용자의 주소 또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의 관할법원에 제기합니다.
                                        <br/>
                                        ② “몰”과 이용자 간에 제기된 전자상거래 소송에는 한국법을 적용합니다.
                                        <br/>
                                        부 칙(시행일) 이 약관은 2019년03월13일부터 시행합니다.
                                        <br/>
                                    </pre>
                                </div>
                            </div>
                            
                            <p className="check">
                                <span>이용약관에 동의하십니까?</span> 
                                <div className="icheckbox_minimal" >
                                    <input value="provision" id="agree_service_check"  type="checkbox" onChange={(e) => agreeHandler(e.currentTarget.checked, e.target.value)}
                                    checked={checkedItems.includes('provision') ? true : false}
                                    />
                                </div>
                                <label className="agree_service_check0" for="agree_service_check">동의함</label>
                                
                            </p>
                            {/* 개인정보 수집 및 이용동의 */}
                            <strong>[필수]비회원구매 개인정보처리방침</strong>
                            <div className='contents'>
                                <div className="contentinPre">
                                    <pre>
                                        <br />   
                                        비회원 구매 개인정보처리방침
                                        <br />   
                                        ■ 개인정보 수집목적 및 이용목적
                                        <br />   
                                        비회원 구매 서비스 제공
                                        <br />   
                                        ■ 수집하는 개인정보 항목
                                        <br />   
                                        성명, 주소, 전화번호, 이메일, 결제 정보
                                        <br />   
                                        ■ 개인정보의 보유기간 및 이용기간
                                        <br />   
                                        원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.
                                        <br />   
                                        ο 회사 내부 방침에 의한 정보 보유 사유· 부정거래 방지 및 쇼핑몰 운영방침에 따른 보관: 5년
                                        <br />   
                                        ο 관련 법령에 의한 정보보유 사유
                                        <br />   
                                        가. 계약 또는 청약철회 등에 관한 기록
                                        <br />   
                                        - 보존이유: 전자상거래등에서의소비자보호에관한법률
                                        <br />   
                                        - 보존기간: 5년
                                        <br />   
                                        나. 대금 결제 및 재화 등의 공급에 관한 기록
                                        <br />   
                                        - 보존이유: 전자상거래등에서의소비자보호에관한법률
                                        <br />   
                                        - 보존기간: 5년
                                        <br />   
                                        다. 소비자 불만 또는 분쟁처리에 관한 기록
                                        <br />   
                                        - 보존이유: 전자상거래등에서의소비자보호에관한법률
                                        <br />   
                                        - 보존기간: 3년
                                        <br />   
                                        라. 로그 기록
                                        <br />   
                                        - 보존이유: 통신비밀보호법
                                        <br />   
                                        - 보존기간: 3개월
                                        <br />   
                                        ※ 동의를 거부할 수 있으나 거부 시 비회원 구매 서비스 이용이 불가능합니다.
                                        <br />   
                                    </pre>
                                </div>
                            </div>
                            
                            <p className="check">
                                <span>개인정보 수집 및 이용에 동의하십니까?</span> 
                                <div className="icheckbox_minimal" >
                                    <input value="privacy" id="agree_service_check2" type="checkbox" onChange={(e) => agreeHandler(e.currentTarget.checked, e.target.value)}  
                                    checked= {checkedItems.includes('privacy') ? true : false}
                                    />
                                </div>
                                <label className="agree_service_check0" for="agree_service_check2">동의함</label>
                            </p>

                            
                            <p className="check">
                                <span>약관에 모두동의</span> 
                                <div className="icheckbox_minimal" >
                                    <input value="agree" id="agree_service_check3" name=""  type="checkbox" onChange={(e) => allAgreeHandler(e.currentTarget.checked)} checked={isAllChecked} 
                                    />
                                </div>
                                <label className="agree_service_check0" for="agree_service_check3">동의함</label>
                            </p>
                        </>
                        : 
                        null
                    }
                    {/* 결제방법 */}
                    <label> 결제방법 :</label>
                    <div name="checkbox-group" role="group" aria-labelledby="checkbox-group" className='checkbox-group'>
                        <label>
                            <Field type="radio" name="picked" value="card" checked={ispayMethod=="card" ? true : false } onChange={ ( (e)=>setpayMethod(e.target.value) )} />
                            신용 / 체크카드
                        </label>
                        <label>
                            <Field type="radio" name="picked" value="trans" checked={ispayMethod =="trans"?  true : false } onChange={ ((e)=>{setpayMethod(e.target.value)})} />
                            계좌이체
                        </label>
                        <label>
                            <Field type="radio" name="picked" value="vbank" checked={ispayMethod =="vbank"?  true : false } onChange={ ((e)=>{setpayMethod(e.target.value)})} />
                            가상계좌
                        </label>
                    </div>
                    {
                        siwpeOrder 
                        ? 
                        <Payment userName={inputVal} userAddress={htmlData} userAddressdetail={htmlDatadetail} userPhone={inputValPhone} userEmail={inputValEmail} userMemo={inputValMemo} name={Producttitle} size={Productsize} color={Productcolor} price={(Productprice *  ProductOrderNum)+deliveryconst} product_option_id={product_option_id} ProductStock={ProductStock} ProductOrderNum={ProductOrderNum} ispayMethod={ispayMethod} product_it_id={id} style={{width:'100%'}}/> 
                        : 
                        <button type="submit" style={{width:"100%"}}>결제하기 !</button>
                    }
                </Form>
            </Formik>
        </div>
    );
}

export default OrderPage
