import React, { useEffect,useState } from 'react';
import { useHistory } from "react-router-dom"
import { Button } from "antd";
import {API_URL} from "../config/constants.js";
import ReactPaginate from "react-paginate";
import axios from 'axios';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import styled from "styled-components";
import { actionCreators as userActions } from "../_modules/user";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";
import "../css/Qna.css";
dayjs.extend(relativeTime);//dayjs에서 확장된 기능 사용 

const Qna = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    let Session = sessionStorage.getItem('user_id');
    
    const [loading, setLoading] = useState(true);
    const [qnaComentAll, setqnaComentAll] = useState(null);
    const [qnaAll, setqnaAll] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);

    const UserData = useSelector((state) => state.user.user);

    const usersPerPage = 10;//한페이지에 보여주는 갯수
    const pagesVisited = pageNumber * usersPerPage;// 1페이지에 1 * 10 / 2페이지에 2 * 20 //최대갯수인듯
    const onClickPage = (e) => {
        e.preventDefault();
        // const QnaConfirm = 
        // prompt("heyy?");
        
        
    }
    //댓글갯수
    
    //댓글갯수(모든)
    const fetchqnaAllComent = async () => {
        await axios
        .get(`${API_URL}/v1/qna/qnaAllComentGET`)
        .then(function(result){
            // console.log("fetchqnaAllComent : ",result.data);
            setqnaComentAll(result.data.result.slice(0, 5));
        })
        .catch((err) => {
            console.log("Err: ", err);
        });
    }
    const fetchQnaAll = async () => {
        await axios
        .get(`${API_URL}/v1/qna/qnaAll`)
        .then(function(result){
            console.log(result.data);
            setqnaAll(result.data.result)   
        })
        .catch((err) => {
            console.log("Err: ", err);
        });
        
    };
    function AddNew(day){
        
        const createDay = day
        // const createDay.split("T");
        let today = new Date();   
        let year = today.getFullYear(); // 년도
        let month = today.getMonth() + 1;  // 월
        let date = today.getDate();  // 날짜
        const dummyday = `${year}-${month}-${date}`
        console.log(dummyday);
        console.log(createDay);

        if(dummyday == createDay){
            return 'New'
        }else{
            return;
        }
    }
    const commentsLength = () => {//0번째만 3개들어감
        if (qnaAll && qnaAll.length > 0) { 
        // console.log("질문글 : ",qnaAll);
            for (var article in qnaAll) {//질문글반복
                const comments = [];
                for (var comment in qnaComentAll) {//질문의댓글반복
                if(
                    qnaComentAll[comment].Qna_id === 
                    qnaAll[article].id
                ){
                    comments.push(qnaComentAll[comment].id);
                }
                }
                qnaAll[article]["comments"] = comments;
            }
        }
    }
    useEffect(() => {
        fetchqnaAllComent();
        fetchQnaAll();
        
        if(Session){
            dispatch(userActions.setUserSV());
        }
    },[]);
    commentsLength();
    
    
    if(qnaAll === null){
        return <div>Loading...</div>
    }
    const displayUsers = 
    qnaAll && qnaAll.slice(pagesVisited, pagesVisited + usersPerPage).map((qna) => {
        return (
            <Tr value={qna.id}  key={qna.id}>
                <Link to={`/Qna/${qna.id}`}>
                <Td value={qna.id}>
                    <span className="marginleft5">
                        <LockOutlined style={{ fontSize: '16px', color: 'black' }} /> 
                    </span>
                    {qna.title}
                    ({qna.comments && qna.comments.length}) 
                    <span className='designNew'>{AddNew(qna.createDate)}</span>
                </Td>
                </Link>
                <Td>{qna.user_id}</Td>
                <Td>{dayjs(qna.createdAt).fromNow()}</Td>
            </Tr>
        )
    })

    const pageCount = Math.ceil(qnaAll.length / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    return(
        <div style={{paddingTop:'100px',textAlign:'center',height:'100vh'}}>
            <div className='QnaTitle'>Q&A</div>
            <Table>
                <thead>
                    <Tr className="sod_list_head">
                        <Th scope="col" width="*">제목</Th>
                        <Th scope="col" width="15%" className="second_td">작성자</Th>
                        <Th scope="col" width="25%">작성일</Th>
                    </Tr>
                </thead>
                <tbody>
                    {displayUsers}
                </tbody>
            </Table>
            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
            />
            {
                Session 
                ?
                <Button
                size="large"
                onClick={function () {
                    history.push("/QnaWrite");
                }}
                >
                글쓰기
                </Button>
                :
                null
            }
            
        </div>
    ) 
};
const Table = styled.table`
    margin: 0 auto  ;
`
const Tr = styled.tr`
    overflow: hidden;
    position: relative;
    padding: 14px 0 14px 7px;
    min-height: 50px;
    color: #757575;
    border-bottom: 1px solid #ececec;
`
const Td = styled.td`
    padding:12px;
`
const Th = styled.th`
    padding:12px;
`

export default Qna;
