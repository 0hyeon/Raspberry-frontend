import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { actionCreators as userActions } from "../_modules/user";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom"
import axios from 'axios';
import {API_URL} from "../config/constants";
import { Form, Input,Divider,Button,Upload,Select } from "antd";
import "../css/QnaWrite.css";
const QnaUpdate = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const history = useHistory();
    const [isTitle, setTitle] = useState("");
    const [isDesc, setDesc] = useState("");
    const [isUserId, setUserId] = useState("");
    const [isDay, setDay] = useState("");
    const [imageUrlQna, setImageUrlQna] = useState(null);
    
    let Session = sessionStorage.getItem('user_id');//세션

    //셀렉트박스
    const { Option } = Select;
    const [isselectVal, setselectVal ] = useState(null);
    function handleChange(value) {
        // console.log(`selected ${value}`);
        setselectVal(value);
    }

    //첨부파일 사진상태관리
    const onChangeImage = (info) => {
        if(info.file.status === 'uploading'){
            return;
        }
        if(info.file.status === 'done'){
            const response = info.file.response;
            const imageUrlQna = response.imageUrlQna;
            setImageUrlQna(imageUrlQna);
        }
    }

    //비밀번호,id로 qnafetch
    const fetchQnaUserCheck = async () => {
        if(Session){
            

            var QnaPassword = prompt("비밀번호를 입력해주세요.");//비밀번호

            let body = {
                id,
                qna_password: QnaPassword,
            }

            const decoded = jwt_decode(Session).user_id;//세션id
              await axios
                .post(`${API_URL}/v1/qna/qnaAnswer`, body)
                .then(function(res){
                  console.log("qnaAnswer : ",res.data);
                  // if(res.data.loginSuccess == false){
                  //   console.log(false);
                  // }else{
                  //   console.log(true);
                  // }
                  if(res.data.Success === true){
                    if(decoded == res.data.data.user_id){
                        setUserId(res.data.data.user_id)

                    }else{
                        alert("작성한 글쓴이가 아닙니다.")
                        history.push("/");
                        return;
                    }
                  }else{
                    alert("잘못된 비밀번호입니다.")
                    history.push("/Qna");
                  }
                })
                .catch((err) => {
                    console.log("Err: ", err);
                });
            //세션 id랑 글썼던 id랑 같을경우만 계속 
        }else{
            alert("작성한 글쓴이가 아닙니다.")
            history.push("/");
            return;
        }
        
    }
    const onSubmit = async (values) => {//제출
        if(!Session){
            alert("로그인 해주세요.");
            document.location.href = '/'
        }
        const body = {
            id,
            title : isselectVal,
            description : values.qnaContents,
        }
        axios.post(`${API_URL}/v1/qna/qnaUpdate`,body)
            .then(res => { 
                console.log(res);
                alert("수정 완료");
                history.goBack()
                return;
            })
            .catch((error) => {
                console.log(error);
                alert("다시 작성해주세요.");    
                return;
            });
    }
    useEffect(() => {
        //로그인체크
        if(!Session){
            alert("로그인을 해주세요.")
            history.push("/QnaWrite");
            return;
        }
        if(Session){
            dispatch(userActions.setUserSV());
        }
        
        //세션id와 파라미터의 글쓴 id가 맞는지 확인
        fetchQnaUserCheck();
        
    },[])
    return (
        <div style={{paddingTop:'100px',textAlign:'center'}}>
            <div className="QnaWirteWrapper" style={{paddingTop:'100px',textAlign:'center'}}>
                <div class="QnaTitle">QnA Modify</div>
                <Form name="Qna 업로드" onFinish={onSubmit}>
                    {/* 제목 */}
                    <Form.Item
                    label={<div className="upload-label">제목 : </div>}
                    name="qnaTitle"
                    rules={[{ required: true, message: "제목을 입력해주세요. " }]}
                    >
                        <Select defaultValue="disabled" style={{ width: 120 }} onChange={handleChange} value={isselectVal}>
                            <Option value="disabled" disabled>
                            제목을 선택해주세요.
                            </Option>
                            <Option value="상품문의">상품문의</Option>
                            <Option value="배송문의">배송문의   </Option>
                            <Option value="교환/반품">교환/반품</Option>
                            <Option value="기타">기타</Option>
                        </Select>
                    </Form.Item>
                    {/* 글내용 */}
                    <Form.Item
                    name="qnaContents"
                    label={<div className="upload-label">내용 : </div>}
                    rules={[{ required: true, message: "내용을 입력해주세요. " }]}
                    >
                        <Input.TextArea
                        name="qnaContents"
                        style={{display:"block"}}
                        size="large"
                        id="qnaContents"
                        showCount
                        maxLength={300}
                        placeholder="내용을 입력해주세요."
                        value=""
                        // onChange={setHtmlContent}
                        />
                        
                        
                    </Form.Item>
                    {/* google api recaptcha */}
                    
                    <Form.Item
                        name="upload"
                        label={<div className="upload-label">사진업로드</div>}
                        >
                        <Upload name="image" action={`${API_URL}/image`} listType="picture" showUploadList={false} onChange={onChangeImage}>
                            {
                            imageUrlQna ? (
                                <img id="upload-img" src= {
                                    process.env.NODE_ENV === 'production'
                                    ?`${imageUrlQna}`
                                    :`${API_URL}/${imageUrlQna}`} /> 
                            ) : (
                            <div id="upload-img-placeholder">
                                <img src="/images/icons/camera.png" />
                                <span>이미지를 업로드해주세요.</span>
                            </div>
                            )
                            }
                        </Upload>
                    </Form.Item>
                    {/* 글작성 */}
                    <Form.Item>
                        <Button id="submit-button" size="large" htmlType="submit">
                            QnA작성
                        </Button>
                    </Form.Item> 
                </Form>
            </div>
        </div>
    )
}

export default QnaUpdate