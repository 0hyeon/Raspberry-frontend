import React,{useState} from 'react';
import DaumPostcode from "react-daum-postcode";
import { actionCreators as userActions } from "../_modules/setaddress";
import { useDispatch,useSelector, connect } from 'react-redux';
const PopupPostCode = (props) => {
  const [isaddress,setaddress] = useState(null);
  const dispatch = useDispatch();

	// 우편번호 검색 후 주소 클릭 시 실행될 함수, data callback 용
    const handlePostCode = (data) => {
        let fullAddress = data.address;
        let extraAddress = ''; 
        
        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
          }
          fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }


        // console.log(data)
        // console.log(fullAddress)
        // console.log(data.zonecode)
        props.onClose()
        props.setHtmlData(fullAddress);
        dispatch(userActions.setAddressSV(data));
    }
 
    const postCodeStyle = {
        display: "block",
        position: "absolute",
        top: "10%",
        width: "600px",
        height: "600px",
        padding: "7px",
      };
      
      
    return(
        <div>
            <DaumPostcode style={postCodeStyle} onComplete={handlePostCode} />
            {/* // 닫기 버튼 생성 */}
            <button type='button' onClick={() => {props.onClose()}} className='postCode_btn' style={{right:'-242px',fontSize:'23px',width:'40px',height:'40px',top:'-230px',marginTop:'0'}}>X</button>
        </div>
    )
}
 
export default PopupPostCode;