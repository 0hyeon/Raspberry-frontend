import React, { useState,useEffect } from 'react';
import PopupDom from './PopupDom';
import PopupPostCode from './PopupPostCode';
import { useSelector } from 'react-redux';
const Test = () => {
	// 팝업창 상태 관리
    let userState = useSelector(state => state.user.user);   
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [htmlData, setHtmlData] = useState(userState.user_address);
    const [detailhtmlData, detailsetHtmlData] = useState(null);
 
	// 팝업창 열기
    const openPostCode = () => {
        setIsPopupOpen(true)
    }
 
	// 팝업창 닫기
    const closePostCode = () => {
        setIsPopupOpen(false)
    }

    const onChange1 = (event) => {
        detailsetHtmlData(event.target.value);
    }
    useEffect(() => {
        // return () => {
        //     cleanup
        // }
    }, [htmlData,detailhtmlData])
 
    return(
        <>
            <input id="inputAdd" className='input_id' readOnly style={{background:'#f2f2f2'}} value={htmlData} onChange={ (e)=>{setHtmlData(e.target.value)} }></input>
            <input id="inputdetailAdd" className='input_id' placeholder='상세주소' value={detailhtmlData} onChange={onChange1}></input>
        	{/* // 버튼 클릭 시 팝업 생성 */}
            {detailhtmlData === null || detailhtmlData === ""
                ? <button type='button' onClick={openPostCode}>우편번호 검색</button> 
                : <button type='button' className='btn-ok' onClick={openPostCode}>완료</button> 
            }
            
            {/* // 팝업 생성 기준 div */}
            <div id='popupDom'>
                {isPopupOpen && (
                    <PopupDom>
                        <PopupPostCode onClose={closePostCode} setHtmlData={setHtmlData} />
                    </PopupDom>
                )}
                
            </div>
        </>
    )
}
 
export default Test;