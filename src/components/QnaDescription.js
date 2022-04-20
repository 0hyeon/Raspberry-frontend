import React,{useState,useEffect,useRef} from 'react';
import { useParams } from "react-router-dom";
import {API_URL} from "../config/constants";
import ReCAPTCHA from "react-google-recaptcha"
import axios from 'axios';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { Form, Input,Button,Upload } from "antd";
import { useHistory }from "react-router-dom";
import "../css/QnaDescription.css";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as userActions } from "../_modules/user";
import { EnterOutlined } from "@ant-design/icons";
import dotenv from 'dotenv'
import { actionCreators as productActions } from "../_modules/product";
dayjs.extend(relativeTime);//dayjs에서 확장된 기능 사용 

const QnaDescription = () => {
  dotenv.config()//secretkey, sitekey setting
  const dispatch = useDispatch();
  const { id } = useParams();//파라미터를 가져옴
  const [isLoading, setLoading] = useState(true);
  const [isToken, setToken] = useState("");
  const [isTitle, setTitle] = useState("");
  const [isDesc, setDesc] = useState("");
  const [isUserId, setUserId] = useState("");
  const [isDay, setDay] = useState("");
  const [isId, setId] = useState("");
  const [isComment, setComment] = useState(false);
  const UserData = useSelector((state) => state.user.user);
  const reRef = useRef();
  let Session = sessionStorage.getItem('user_id');
  const ProductsData = useSelector((state) => state.allProducts.products.products);
  const history = useHistory();

  const onSubmit = async (values) => {//댓글작성
        
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
            description : values.qnaContents,
        }
        
        const googlesend2= `https://www.google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${token}`

        axios.post(`${API_URL}/v1/product/productQna`,{//구글 recaptcha토큰값 받아오기 
            addresses:googlesend2,
        }).then((result) => {
            // console.log(result.data.success);
            if(result.data.success === true){

                axios.post(`${API_URL}/v1/qna/qnaComment/${id}`,body)
                .then(res => { 
                    console.log(res);
                    alert("댓글등록 성공");
                    fetchQnaAllComent();
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

  const fetchQnaDescription = async () => {
    if(Session){
      const decoded = jwt_decode(Session).user_id;
      
      var QnaPassword = prompt("비밀번호를 입력해주세요.");
  
      let body = {
        id,
        qna_password: QnaPassword,
      }
      await axios
        .post(`${API_URL}/v1/qna/qnaAnswer`, body)
        .then(function(res){
          console.log(res.data.Success);
          // if(res.data.loginSuccess == false){
          //   console.log(false);
          // }else{
          //   console.log(true);
          // }
          if(res.data.Success === true){
            if(decoded == res.data.data.user_id){
              setTitle(res.data.data.title)
              setDesc(res.data.data.description)
              setUserId(res.data.data.user_name)
              setDay(dayjs(res.data.data.createdAt).fromNow())
              setId(res.data.data.product_id)
              setLoading(false)
            }else{
              console.log("res.data.data.user_id : ",res.data.data.user_id);
              console.log("decoded : ",decoded);
              alert("작성자의 ID가 아닙니다.")
            history.push("/Qna");  
            }
          }else{
            alert("잘못된 비밀번호입니다.")
            history.push("/Qna");
          }
        })
        .catch((err) => {
            console.log("Err: ", err);
        });

    }
      
  };
  const updateQnaClick= () => {
    if(window.confirm("글을 수정하시겠습니까?")){
      history.push(`/QnaUpdate/${id}`);
    }else{
      return;
    }
  }
  const listQnaClick= () => {
    history.push(`/Qna`);
  }
  const deleteComent= (coment_id) => {
    if(window.confirm("댓글을 삭제하시겠습니까?")){
      
      if(!Session){
        alert("로그인 해주세요.");
        document.location.href = '/'
      }

      const body = {
          id:coment_id,
      }
      axios.post(`${API_URL}/v1/qna/qnaComentDelete`,body)
        .then(res => { 
            console.log(res);
            alert("삭제 되었습니다.");
            fetchQnaAllComent();
            return;
        })
        .catch((error) => {
            console.log(error);
            alert("다시 시도해주세요.");    
            return;
        });

    }else{
      return;
    }
  }
  const deleteQnaClick = () => {
    if(window.confirm("글을 삭제하시겠습니까?")){
      
      if(!Session){
        alert("로그인 해주세요.");
        document.location.href = '/'
      }

      const body = {
          id,
      }
      axios.post(`${API_URL}/v1/qna/qnaDelete`,body)
          .then(res => { 
              console.log(res);
              alert("삭제 완료");
              history.goBack()
              return;
          })
          .catch((error) => {
              console.log(error);
              alert("다시 시도해주세요.");    
              return;
          });
    }else{
      return;
    }
  }
  const fetchQnaAllComent = async () => {
    let body = {
      id,
    }

    await axios
      .post(`${API_URL}/v1/qna/qnaAllComent`, body)
      .then(function(res){
          setComment(res.data.result);
      })
      .catch((err) => {
          console.log("Err: ", err);
      });
  };

  useEffect(() => {
    if(!Session){
        alert("로그인 해주세요.");
        document.location.href = '/'
        return;
    }
    fetchQnaDescription();
    dispatch(userActions.setUserSV());
    dispatch(productActions.setProductSV());
    fetchQnaAllComent();
  },[]);
  return (
      <>
      {isLoading === false 
      ? 
      <div style={{paddingTop:'100px',textAlign:'center'}}>
        <div className='QnaWrapper'>
          <div className='QnaWrapper_title_wrapper'>
            <div className='QnaWrapper_title'>{isTitle}</div>
            <span className='QnaWrapper_title2'>{isUserId} / {isDay}</span>
          </div>
          <div className='isDesc'>
            {
                ProductsData && ProductsData.find((item) => String(item.id) === String(isId)) 
                ?
                <div className='ProductTitle'>
                    <img src={
                        process.env.NODE_ENV === 'production'
                        ?`${ProductsData && ProductsData.find((item) => String(item.id) === String(isId)).imageUrl }`
                        :`${API_URL}/${ProductsData && ProductsData.find((item) => String(item.id) === String(isId)).imageUrl }`} alt="대표사진" />
                    <div className='ProductName'>{ProductsData && ProductsData.find((item) => String(item.id) === String(isId)).name}</div>
                    {isDesc}
                </div>
                :null
            }
            
            </div>
          <div className='button_wrapper'>
            <button className='listQna' onClick={listQnaClick}>목록</button>
            <button className='updateQna' onClick={updateQnaClick}>수정</button>
            <button className='deleteQna' onClick={deleteQnaClick}>삭제</button>
          </div>
          
              <div className='CommentWrapper'>
                {
                  isComment && isComment.map((Qna) => {
                    return (
                      <div key={Qna.id} className="p">
                        <div className='comment_name'>
                          {Qna.user_name} / {dayjs(Qna.createdAt).fromNow()}
                          <span className='closeBoxWrapper' value={Qna.id} onClick={ (e) => {deleteComent(Qna.id) }}>
                          X</span>
                        </div>
                        <span className='comment_desc'>{Qna.description}</span>
                        <EnterOutlined style={{ fontSize: '11px', color: 'black' }}/>
                      </div>
                    );
                  })
                }
                
              </div>
              <Form name="QnaForm" onFinish={onSubmit}>
                  {/* 댓글내용 */}
                  <Form.Item
                  name="qnaContents"
                  label={<div className="">댓글작성 : </div>}
                  rules={[{ required: true, message: "댓글을 입력해주세요. " }]}
                  >
                    <Input.TextArea
                    name="qnaContents"
                    style={{display:"block"}}
                    size="large"
                    id="qnaContents"
                    showCount
                    maxLength={300}
                    placeholder="댓글을 입력해주세요."
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
                  {/* 글작성 */}
                  <Form.Item>
                      <Button id="submit-button" size="large" htmlType="submit">
                          댓글작성
                      </Button>
                  </Form.Item> 
              </Form>
        </div>
      </div>
      
      : null }
      </>
  )
};

export default QnaDescription;
