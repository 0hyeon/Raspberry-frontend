import React, { useState, useEffect,useRef } from 'react';
import { Form, Input,Divider,Button } from "antd";
import ReCAPTCHA from "react-google-recaptcha"
import axios from 'axios';
import {API_URL} from "../config/constants";
const QnaWrite = () => {
    const [htmlContents, setHtmlContents] = useState("");
    const [isToken, setToken] = useState("");
    
    //ReCAPTCHA 함수
    // function onChange(value) {
    //     console.log('Captcha value:', value);
    // }

    const reRef = useRef();
    
    const onSubmit = async (values) => {//제출
        
        const token = await reRef.current.executeAsync();
        console.log("token :",token);
        // reRef.current.reset();
        
        const body = {
            qnaTitle : values.qnaTitle,
            qnaContents : values.qnaContents,
        }
        if(!token){
            alert("Please , your not fooling us, bot.");
            return;
        }
        const secretkey = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
        
        const googlesend2= `https://www.google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${token}`

        axios.post(`${API_URL}/v1/product/productQna`,{//결제완료후 2차 db업데이트 
            addresses:googlesend2,
        }).then((result) => {
            // console.log(result.data.success);
            if(result.data.success === true){
                alert("게시글 등록완료");
            }else{
                alert("Please , your not fooling us, bot.");
            }
        }).catch((error) => {
            console.log(error);
        });

        

        
    }


    return(
        <div style={{paddingTop:'100px',textAlign:'center'}}>
            {/* 글제목 */}
            <Form name="상품 업로드" onFinish={onSubmit}>

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

                <Divider />

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
                    value={htmlContents}
                    onChange={setHtmlContents}
                    />
                </Form.Item>
                <ReCAPTCHA
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    size="invisible"
                    ref={reRef}
                    onChange={(token) => {setToken(token)}}
                    onExpired={e => setToken("")}
                />
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
