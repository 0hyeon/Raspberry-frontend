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
import "../css/Qna.css";
dayjs.extend(relativeTime);//dayjs에서 확장된 기능 사용 

const Qna = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    let Session = sessionStorage.getItem('user_id');
    
    const [loading, setLoading] = useState(true);
    const [qnaAll, setqnaAll] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);

    const UserData = useSelector((state) => state.user.user);

    const usersPerPage = 2;//한페이지에 보여주는 갯수
    const pagesVisited = pageNumber * usersPerPage;// 1페이지에 1 * 10 / 2페이지에 2 * 20 //최대갯수인듯
    const onClickPage = (e) => {
        e.preventDefault();
        // const QnaConfirm = 
        // prompt("heyy?");
        
        
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
     
    useEffect(() => {
        fetchQnaAll();
        if(Session){
            dispatch(userActions.setUserSV());
        }
        // setLoading(false);
    },[]);
    
    if(qnaAll === null){
        return <div>Loading...</div>
    }
    const displayUsers = 
        qnaAll.slice(0,5).slice(pagesVisited, pagesVisited + usersPerPage).map((qna) => {
            return (
                <Tr value={qna.id}  key={qna.id}>
                    <Link to={`/Qna/${qna.id}`}>
                    <Td value={qna.id}>{qna.title}(0)</Td>
                    </Link>
                    <Td>{qna.user_name}</Td>
                    <Td>{dayjs(qna.createdAt).fromNow()}</Td>
                </Tr>
            )
        })

    const pageCount = Math.ceil(qnaAll.length / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    return(
        <div style={{paddingTop:'100px',textAlign:'center'}}>
            <div className='QnaTitle'>Q&A</div>
            <Table>
                <thead>
                    <Tr className="sod_list_head">
                        <Th scope="col" width="*" className="text_left">제목</Th>
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
