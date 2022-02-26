import React, { useEffect,useState } from 'react';
import {API_URL} from "../config/constants.js";
import axios from "axios";
import styled from "styled-components";
import ReactPaginate from "react-paginate";
import { withRouter,Link,useHistory,useRouteMatch } from "react-router-dom";

const OrderSuccess = () => {
    const history = useHistory();
    const [isOrderSuccess, setOrderSuccess] = useState("");
    const [pageNumber, setPageNumber] = useState(0);
    const [sjvalue, setsjvalue] = useState("");

    const ModifySongJangBtn = useRouteMatch("/updateSongJang/:index")

    const usersPerPage = 10;//한페이지에 보여주는 갯수
    const pagesVisited = pageNumber * usersPerPage;// 1페이지에 1 * 10 / 2페이지에 2 * 20 //최대갯수인듯
    const orderWaitLength = async () => {//결제대기 갯수
        await axios
        .get(`${API_URL}/v1/order/setOrderSuccess`)
        .then(function(result){
            setOrderSuccess(result.data.result)   
        })
        .catch((err) => {
            console.log("Err: ", err);
        });
    };
    const handleFilter = (event) => {
        
        const searchWord = event.target.value; //검색의 input value 
        setsjvalue(searchWord);
    }
    const ModifySubmit =  async (od_id) => {//주소 등록업데이트 
        // const od_songjang = document.getElementById('inputAdd').value;
        const od_songjang = sjvalue
        
        let body = {
            od_id,
            od_songjang
        }
        await axios
        .post(`${API_URL}/v1/order/ModifySongJang `, body)
        .then(function(result){
            orderWaitLength();
            history.push("/OrderSuccess"); 
            alert("수정되었습니다.");

        })
        .catch((err) => {
            console.log("Err: ", err);
        });
    }
    const CloseAddress =  () => {
        history.push("/OrderSuccess");
    }
    useEffect(() => {
        orderWaitLength()//결제대기 갯수
    },[])
    if(isOrderSuccess === null){
        return <div>Loading...</div>
    }
    const OrderList = 
    isOrderSuccess && isOrderSuccess.slice(pagesVisited, pagesVisited + usersPerPage).map((od) => {
        return (
            <Tr value={od.id}  key={od.id}>
                <Link to={`/updateSongJang/${od.od_id}`}>
                    <Td value={od.id}>
                        <span className="marginleft5">
                            {od.od_id}
                        </span>
                    </Td>
                </Link>
                    <Td>
                        {od.mb_id}
                    </Td>
                    <Td>
                        {od.name}
                    </Td>
                    {ModifySongJangBtn && ModifySongJangBtn.params.index == od.od_id ? 
                    <Td>
                        <input type='text' placeholder="송장번호를 입력해주세요." value={sjvalue}  onChange={handleFilter} />
                        <button onClick={()=>ModifySubmit(od.od_id)} id="setAddressBtn">저장</button>
                        <button onClick={CloseAddress} id="ClosesetAddressBtn">취소</button>
                    </Td>
                    :
                    <Td>
                        {od.od_songjang}
                    </Td>
                    }
                    <Td>
                        {od.od_status}
                    </Td>
            </Tr>
        )
    })

    const pageCount = Math.ceil(isOrderSuccess.length / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

  return (
    <div style={{paddingTop:'200px',textAlign:'center',height:'100vh'}}>
        <h1>결제완료내역</h1>
        <Table>
                <thead>
                    <Tr className="sod_list_head">
                        <Th scope="col" width="*">주문번호</Th>
                        <Th scope="col" width="15%" className="second_td">주문자</Th>
                        <Th scope="col" width="25%">상품명</Th>
                        <Th scope="col" width="15%">송장번호</Th>
                        <Th scope="col" width="15%">결제현황</Th>
                    </Tr>
                </thead>
                <tbody>
                    {OrderList}   
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
    </div>
  )
}
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
export default OrderSuccess