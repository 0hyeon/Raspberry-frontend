import React, {useState} from 'react';
import "../css/index.css";
import "../css/Paging.css";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import {API_URL} from "../config/constants.js";
// import MainPage from "../swiperSlide";
import styled from "styled-components";

import { useDispatch, useSelector } from "react-redux";
import {setProducts,setCartItem,setRequestLoding2} from "../_actions/userAction";
import { actionCreators as productActions } from "../_modules/product";
import { actionCreators as productOptionActions } from "../_modules/productoptions";

import ReactPaginate from "react-paginate";
import jwt_decode from "jwt-decode";

import loadable from '@loadable/component'
import { Tabs, Tab } from "@tarragon/swipeable-tabs/dist";

const MainPage = loadable(() => import('../swiperSlide'));
const BestCategory = loadable(() => import('./BestCategory'));

dayjs.extend(relativeTime);//dayjs에서 확장된 기능 사용 

function Main(props) {
    // 슬라이드,상품
    // const [products, setProducts] = React.useState([]);// state형태
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); //현재 페이지
    const [postPerPage] = useState(4); //페이지당 포스트 개수
    const [isproduct_list,setproduct_list] = useState([]);
    const [isproductsOptionsAll, setproductsOptionsAll] = useState([]);
    const [reviewAll, setreviewAll] = useState([]);
    // const [banners, setBanners] = React.useState([]);
    // const state = useSelector((state) => state);
    // const products = useSelector((state) => state.allProducts.products);
    const products = useSelector((state) => state.products.products);
    const whyerrorObject = useSelector((state) => state.productoptions.productoptions.products);
    // console.log("whyerrorObject",whyerrorObject);
    const dispatch = useDispatch();
    const [pageNumber, setPageNumber] = useState(0);
    const [, setSelectedTab] = useState(0);

    


    const productsOptionsAll = async (limitNum) => {
        let body = {
            limitNum
        }
        await axios
            .post(`${API_URL}/v1/product/productsOptionsAll`, body)
            .then(function(result){
            // console.log('productsOptionsAll : ',result.data);
            setproductsOptionsAll(result.data.result);
        })
        .catch((err) => {
            console.log("Err: ", err);
            dispatch(setRequestLoding2())//loding true로 장바구니 랜더링
        });
    }
    const fetchCartItem = async () => {
        let Session = sessionStorage.getItem('user_id');
        if(Session){
            
            const decoded = jwt_decode(Session).user_id;
            let body = {
                seSsionId: decoded
              // heyt: session_redux
            }
            // dispatch(setRequestLoding())//loding true로 장바구니 랜더링
            await axios
                .post(`${API_URL}/v1/cart/setCartItem`, body)
                .then(function(result){
                dispatch(setCartItem(result.data));
            })
            .catch((err) => {
                console.log("Err: ", err);
                dispatch(setRequestLoding2())//loding true로 장바구니 랜더링
            });
            
        } 
    };
    //fetchreviewAll
    const fetchreviewAll = async () => {
        await axios
        .get(`${API_URL}/v1/review/reviewAll`)
        .then(function(result){
            // console.log(result.data);
            setreviewAll(result.data.result)   
            console.log("setreviewAll :",result.data.result);
        })
        .catch((err) => {
            console.log("Err: ", err);
        });
        
  };

    //mobile check
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;

    function mouserOverHover(e,imageUrl2,imageUrl){
        if (isMobile){
            return;
        }else{
            if(imageUrl2 == null){return;}
            document.getElementById(`${e.target.id}`).src = process.env.NODE_ENV === 'production' ?`${imageUrl2}` : `${API_URL}/${imageUrl2}`;
        }
    }
    function mouserOutHover(e,imageUrl){
        if (isMobile){
            return;
        }else{
            document.getElementById(`${e.target.id}`).src = process.env.NODE_ENV === 'production' ?`${imageUrl}` : `${API_URL}/${imageUrl}`;
        }
    }
    const ItemFetchLength = 50;//모든페이지에 들어가는 아이템수
    const usersPerPage = 10;//한페이지에 보여주는 갯수
    const pagesVisited = pageNumber * usersPerPage;// 1페이지에 1 * 10 / 2페이지에 2 * 20 //최대갯수인듯
    
    const displayUsers = products.slice(0,ItemFetchLength)//50중에 
        .slice(pagesVisited, pagesVisited + usersPerPage)// 최대갯수 ~  최대갯수 + 10
        .map((product) => {
            return (
                <div className="product-card" key={product.id}>
                {
                    product.soldout === 100 && <div className="product-blur" />
                }
                    <Link
                        style={{ color: "inherit" }}
                        className="product-link"
                        to={`/products/${product.id}`}
                    >
                        <div className="wrppper-product-img">
                            <img
                                id={product.id} 
                                className="product-img" src={
                                process.env.NODE_ENV === 'production'
                                    ?`${product.imageUrl}`
                                    :`${API_URL}/${product.imageUrl}`
                                } alt="." 
                                onMouseOver={(e) => mouserOverHover(e,product.imageUrl2,product.imageUrl)}
                                onMouseOut={(e) => mouserOutHover(e,product.imageUrl)}
                            />
                        </div>
                        <div className="product-contents">
                            {product.soldout === 1 
                                ?<span className="product-name" style={{textDecoration: 'line-through' }}>{product.name}</span> 
                                :<span className="product-name">{product.name}</span>
                            }
                            
                            
                            {product.soldout === 1 
                                ?null
                                :<span className="product-subName">{product.subDescription}</span>
                            }
                            {product.soldout === 1 
                                ?<span className="product-price">Soldout.</span> 
                                :
                                <>
                                    <div className='product_price_wrapper' style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'9px'}}>
                                        <div>
                                            <div className="product-price">{AddComma(product.price)} won</div> 
                                            {product.marketPrice !== null 
                                                ? <div className="product-marketPrice">{AddComma(product.marketPrice)} won</div>  
                                                : null 
                                            }
                                        </div>
                                        {product.marketPrice !== null 
                                            ? <div className="productSalePercent">{PdSalePercent(product.price,product.marketPrice)}%</div> 
                                            : null} 
                                        
                                    </div>
                                </>
                                
                            }
                            
                            {product.soldout === 1 
                                ? null
                                :<span className="product-Colors">
                                    {product.color1 && product.color1.map((qna) => {
                                        return (
                                                <div className='ColorCircle' style={{backgroundColor:`${qna}`}} />
                                            )
                                        })
                                    }
                                </span> 
                            }
                            {/* 리뷰수 & 구매수 */}
                            <div className='product_price_wrapper' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                <div>
                                    {product.sellCount !== null 
                                        ? <span className="product-reviewAndsellNum">구매 {product.sellCount} </span>  
                                        : null 
                                    }
                                    {reviewAll && reviewAll.filter(item => String(item.response_result) === String(product.id)).length > 0 
                                    ? <span className="product-reviewAndsellNum">
                                        | 리뷰 {reviewAll && reviewAll.filter(item => String(item.response_result) === String(product.id)).length}
                                    </span>
                                    : null
                                    }
                                </div>
                            </div>
                            <div className="product-footer">
                                <div className="product-seller">
                                    <img
                                        className="product-avatar"
                                        src="images/icons/avatar.png" alt=""
                                    />
                                    <span>{product.seller}</span>
                                </div>
                                <span className="product-date">{dayjs(product.createdAt).fromNow()}</span>
                            </div>
                        </div>
                    </Link>
                </div>
            );
        });

    const pageCount = Math.ceil(products.length / usersPerPage);
    React.useEffect(function () {
        // 상품관련
        // fetchProducts();
        dispatch(productActions.setProductSV());
        dispatch(productOptionActions.setProductOptionsSV(products.id));
        setproduct_list(products);
        productsOptionsAll(ItemFetchLength);
        fetchreviewAll();
        fetchCartItem();
        setLoading(false);
    }, []);

	
    //콤마 함수
    function AddComma(value) {
        return Number(value).toLocaleString('en');
    }
    //퍼센트 계산
    function PdSalePercent(price,maketPrice) {
        return Math.round((1 - ( price/ maketPrice )) * 100)
    }
    
        
    
    // console.log("products",products); // ok 
    // 여기서부터 pagenation
    // const [users, setUsers] = useState(products.slice(0,2));//전체 데이터를 자른다 역순이아닌 정순서대로
    // console.log("users",users);
    

    const changePage = ({ selected }) => {
        var location = document.querySelector("#product-list-arrivals").offsetTop;
        window.scrollTo({top:location, behavior:'smooth'});
        setPageNumber(selected);
    };
    if (isproductsOptionsAll == null || reviewAll == null){
        return <div>Loading...</div>
    }
    console.log("products : ",products);
    console.log("reviewAll : ",reviewAll);
    return(
        <div>
            { loading ? <div>Loading...</div>
                : 
                <>
                    <MainPage />
                    <BestCategory />
                    <h1 className="product-headline" id="product-list-arrivals">New Arrivals.</h1>
                    <div className="product-list-wrapper" id="product-list">
                        {displayUsers}
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
                        
                    
                </>
            }
        </div>
    )
}

const ColorCircle = styled.span`
    width: 20px;
    height: 20px;
`

export default Main;