import React, { useState, useEffect,useRef } from 'react';
import { Form, Input,Divider,Button,Upload } from "antd";
import ReCAPTCHA from "react-google-recaptcha"
import axios from 'axios';
import dotenv from 'dotenv'
import jwt_decode from "jwt-decode";
import { useHistory }from "react-router-dom";
import {API_URL} from "../config/constants";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as userActions } from "../_modules/user";
const QnaWrite = () => {
    dotenv.config()//secretkey, sitekey setting
    const dispatch = useDispatch();
    // const [htmlContent, setHtmlContent] = useState("");
    const UserData = useSelector((state) => state.user.user);
    const history = useHistory();//리액트훅
    const [isToken, setToken] = useState("");
    const [imageUrlQna, setImageUrlQna] = useState(null);
    //ReCAPTCHA 함수
    // function onChange(value) {
        //     console.log('Captcha value:', value);
        // }
    const quillRef = useRef(); //🌈
    const reRef = useRef();
    let Session = sessionStorage.getItem('user_id');
    
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

    const onSubmit = async (values) => {//제출
        
        if(!Session){
            alert("로그인 해주세요.");
            document.location.href = '/'
        }
        if(Session){
            //세션 복호화 
            const decoded = jwt_decode(Session).user_id;
            //token값 받아오기
            const token = await reRef.current.executeAsync();
            // console.log("token :",token);
            
            const secretkey = process.env.REACT_APP_RECAPTCHA_SECRET_KEY
    
            if(!token){
                alert("Please , your not fooling us, bot.");
                return;
            }
            
            const body = {
                user_id:decoded,
                user_name:UserData.user_name,
                qna_password:values.qna_password,
                title : values.qnaTitle,
                description : values.qnaContents,
            }
            
            const googlesend2= `https://www.google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${token}`
    
            axios.post(`${API_URL}/v1/product/productQna`,{//구글 recaptcha토큰값 받아오기 
                addresses:googlesend2,
            }).then((result) => {
                // console.log(result.data.success);
                if(result.data.success === true){
    
                    //aixos post qna.qnaregister
                    
                    axios.post(`${API_URL}/v1/qna/qnaregister`,body)
                    .then(res => { 
                        console.log(res);
                        alert("게시글 등록완료");
                        history.goBack()
                        return;
                    })
                    .catch((error) => {
                        console.log(error);
                        alert("다시 작성해주세요.");    
                        return;
                    });
    
                    // end
                }else{
                    alert("Please , your not fooling us, bot.");
                }
            }).catch((error) => {
                console.log(error);
            });
    
            reRef.current.reset();
            setToken("");
        }
        
    }
    useEffect(() => {
        dispatch(userActions.setUserSV());
    },[]);
    return(
        <div style={{paddingTop:'100px',textAlign:'center'}}>
            {/* 글제목 */}
            <Form name="Qna 업로드" onFinish={onSubmit}>
                {/* 제목 */}
                <Form.Item
                label={<div className="upload-label">제목 : </div>}
                name="qnaTitle"
                rules={[{ required: true, message: "제목을 입력해주세요. " }]}
                >
                    <Input
                        name="qnaTitle"
                        className="qnaTitle"
                        size="large"
                        placeholder="제목을 입력해주세요. "
                    />
                </Form.Item>
                {/* 비밀번호 */}
                <Form.Item
                label={<div className="upload-label">비밀번호 : </div>}
                name="qna_password"
                rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
                >
                    <Input
                        name="qna_password"
                        className="qna_password"
                        size="large"
                        placeholder="비밀번호를 입력해주세요."
                        
                    />
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
                <ReCAPTCHA
                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                    size="invisible"
                    ref={reRef}
                    onChange={(token) => {setToken(token)}}
                    onExpired={e => setToken("")}
                />
                <Form.Item
                    name="upload"
                    label={<div className="upload-label">사진업로드</div>}
                    >
                    <Upload name="image" action={`${API_URL}/image`} listType="picture" showUploadList={false} onChange={onChangeImage}>
                        {
                        imageUrlQna ? (
                            <img id="upload-img" src= {`${API_URL}/${imageUrlQna}`} /> 
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
                        글쓰기
                    </Button>
                </Form.Item> 
            </Form>
        </div>
    ) 
};

export default QnaWrite;
