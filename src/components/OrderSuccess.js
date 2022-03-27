import React, { useEffect,useState } from 'react';
import {API_URL} from "../config/constants.js";
import axios from "axios";
import styled from "styled-components";
import ReactPaginate from "react-paginate";
import { withRouter,Link,useHistory,useRouteMatch } from "react-router-dom";
import { actionCreators as productActions } from "../_modules/product";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input,Divider,Button,Upload,Select } from "antd";
import jwt_decode from "jwt-decode";

const OrderSuccess = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [isOrderSuccess, setOrderSuccess] = useState("");
    const [pageNumber, setPageNumber] = useState(0);

    const { Option } = Select;
    const [isselectVal, setselectVal ] = useState("결제완료");
    function handleChange(value) {
        // console.log(`selected ${value}`);
        setselectVal(value);
    }

    let Session = sessionStorage.getItem('user_id');
    if(!Session){
      alert("관리자 계정으로 로그인 해주세요");
      document.location.href = '/'
    }
    if(Session){
        const decoded = jwt_decode(Session).user_id;
        if(decoded !== "admin"){
            alert("관리자 계정으로 로그인 해주세요");
            document.location.href = '/'
        }
    }
    const ModifySongJangBtn = useRouteMatch("/updateOrderStatus/:index")

    const usersPerPage = 10;//한페이지에 보여주는 갯수
    const pagesVisited = pageNumber * usersPerPage;// 1페이지에 1 * 10 / 2페이지에 2 * 20 //최대갯수인듯
    const ProductsData = useSelector((state) => state.allProducts.products.products);
    const orderWaitLength = async () => {//결제대기 갯수
        await axios
        .get(`${API_URL}/v1/order/setOrderAll`)
        .then(function(result){
            console.log("setOrderSuccess : ", result.data.result.filter(item => item.od_status == "결제완료"));
            setOrderSuccess(result.data.result.filter(item => item.od_status == "결제완료"))   
        })
        .catch((err) => {
            console.log("Err: ", err);
        });
    };
    
    const ModifySubmit =  async (od_id,name,od_addr1,od_cart_price,od_tel) => {//주소 등록업데이트 
        // const od_songjang = document.getElementById('inputAdd').value;
        const od_status = isselectVal
        
        let body = {
            od_id,
            od_status,
            name,
            od_addr1,
            od_cart_price,
            od_tel
        }
        await axios
        .post(`${API_URL}/v1/order/ModifyOrderStatus `, body)
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
    function calculateProduct(it_id,color,size,ordernum){
        
        const it_idSeperate = it_id.split(',');
        const colorSeperate = color.split(',');
        const sizeSeperate = size.split(',');
        const ordernumSeperate = ordernum.split(',');
        const emptyArray = []
        for(let i=0;i<it_idSeperate.length; i++){
            emptyArray.push(<strong key={i}>{`${ProductsData && ProductsData.find((item) => String(item.id) === String(it_idSeperate[i])).name},${colorSeperate[i]},${sizeSeperate[i]},${ordernumSeperate[i]}개`}<br /><br /></strong>)
        }
        return (emptyArray);

        
    }
    

    useEffect(() => {
        orderWaitLength()//결제대기 갯수

        dispatch(productActions.setProductSV());
    },[])
    if(isOrderSuccess === null){
        return <div>Loading...</div>
    }
    const OrderList = 
    isOrderSuccess && isOrderSuccess.slice(pagesVisited, pagesVisited + usersPerPage).map((od) => {
        return (
            <Tr value={od.id}  key={od.id}>
                <Td value={od.id}>
                    <Link to={`/updateOrderStatus/${od.od_id}`}>
                            <span className="marginleft5">
                                {od.od_id}
                            </span>
                    </Link>
                </Td>
                <Td>{od.mb_id}</Td>
                <Td>
                    {od.name}
                    <br /> 
                    <br /> 
                    {calculateProduct(
                        od.product_it_id,
                        od.color,
                        od.size,
                        od.ordernum)
                    }
                </Td>
                <Td>{od.od_tel}</Td>
                <Td>{od.od_cart_price}</Td>
                <Td>{od.od_addr1 + od.od_addr2}</Td>
                {ModifySongJangBtn && ModifySongJangBtn.params.index == od.od_id ? 
                    <Td>
                        <Select defaultValue="disabled" style={{ width: 120 }} onChange={handleChange} value={isselectVal}>
                            <Option value="disabled" disabled>
                            결제상태를 선택해주세요.
                            </Option>
                            <Option value="결제완료">결제완료</Option>
                            <Option value="상품준비중">상품준비중</Option>
                        </Select>
                        <div id='wrapperBtn'>
                            <button onClick={()=>ModifySubmit(od.od_id,od.name,od.od_addr1,od.od_cart_price,od.od_tel)} id="setAddressBtn">저장</button>
                            <button onClick={CloseAddress} id="ClosesetAddressBtn">취소</button>
                        </div>
                    </Td>
                    :
                    <Td>{od.od_status}</Td>
                }
                <Td>{od.od_memo}</Td>
                <Td>{od.od_songjang}</Td>
                <Td>{od.createdAt}</Td>
            </Tr>
        )
    })

    const pageCount = Math.ceil(isOrderSuccess.length / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

  return (
    <div style={{paddingTop:'200px',textAlign:'center'}}>
        <OrderTitle>결제완료내역</OrderTitle>
        <Table>
                <thead>
                    <Tr className="sod_list_head">
                        <Th scope="col" width="*">주문번호</Th>
                        <Th scope="col" width="8%" className="second_td">주문자</Th>
                        <Th scope="col" width="15%">상품명</Th>
                        <Th scope="col" width="8%">연락처</Th>
                        <Th scope="col" width="8%">금액</Th>
                        <Th scope="col" width="8%">주소</Th>
                        <Th scope="col" width="8%">결제현황</Th>
                        <Th scope="col" width="8%">고객메모</Th>
                        <Th scope="col" width="15%">송장번호</Th>
                        <Th scope="col" width="8%">주문시간</Th>
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
        <ToListBtn>
            <Link to={`/adminpage`} style={{color:'white'}}>목록으로</Link>
        </ToListBtn>
    </div>
  )
}

const OrderTitle = styled.div`
    font-family: 'Uiyeun';
    font-size: 40px;
    margin-bottom: 80px;
`
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
const ToListBtn = styled.button`
    font-family: Lato, sans-serif;
    border-radius: 4px;
    color: #fff;
    background-color: #333;
    border: 1px solid transparent;
    height: 50px;
    font-size: 14px;
    width: 120px;
`
export default OrderSuccess