import React, {useState} from 'react';
import "../css/index.css";
import "../css/Paging.css";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import {API_URL} from "../config/constants.js";
import MainPage from "../swiperSlide";

import { useDispatch, useSelector } from "react-redux";
import {setProducts,setCartItem,setRequestLoding2} from "../_actions/userAction";
import { actionCreators as productActions } from "../_modules/product";
import { actionCreators as productOptionActions } from "../_modules/productoptions";

import ReactPaginate from "react-paginate";
import jwt_decode from "jwt-decode";
dayjs.extend(relativeTime);//dayjs에서 확장된 기능 사용 

function Main(props) {
    // 슬라이드,상품
    // const [products, setProducts] = React.useState([]);// state형태
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); //현재 페이지
    const [postPerPage] = useState(4); //페이지당 포스트 개수
    const [isproduct_list,setproduct_list] = useState([]);
    // const [banners, setBanners] = React.useState([]);
    // const state = useSelector((state) => state);
    // const products = useSelector((state) => state.allProducts.products);
    const products = useSelector((state) => state.products.products);
    const dispatch = useDispatch();
    // const fetchProducts = async () => { 
    //     await axios
        
    //       .get(`${API_URL}/products`)
    //     //   .get('https://jsonplaceholder.typicode.com/posts')
    //       .then(function(result){
    //         // setLoading(true);
    //         // const products = result.data.products;
    //         // setProducts(products);
    //         // console.log(result.data.products);
    //         dispatch(setProducts(result.data));
    //         setPosts(result.data.products);
    //         // console.log(result.data.products);
    //         // console.log(products);
    //         // setLoading(false);
    //         // console.log(result.data.products);
            
    //     })
    //     .catch((err) => {
    //         console.log("Err: ", err);
    //     });
        
    // };
   
     //현재 페이지 가져오기
    // console.log(posts);

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
                // const products = result.data.products;
                // setProducts(products);
                // dispatch(setRequestLoding())//loding true로 장바구니 랜더링
                dispatch(setCartItem(result.data));
                // dispatch(setRequestLoding())//loding true로 장바구니 랜더링
                // console.log(result.data);
                // console.log(result.data.cartItem);
                // console.log('state : ',state);
            })
            .catch((err) => {
                console.log("Err: ", err);
                dispatch(setRequestLoding2())//loding true로 장바구니 랜더링
            });
            
        } 
        
        // dispatch(setProducts(result.data));
    };
    React.useEffect(function () {
        // 상품관련
        // fetchProducts();
        dispatch(productActions.setProductSV());
        dispatch(productOptionActions.setProductOptionsSV(products.name));
        setproduct_list(products);
        fetchCartItem();
        setLoading(false);
    }, []);

	
    //콤마 함수
    function AddComma(value) {
        return Number(value).toLocaleString('en');
    }
    
    
    console.log("products",products); // ok 
    // 여기서부터 pagenation
    // const [users, setUsers] = useState(products.slice(0,2));//전체 데이터를 자른다 역순이아닌 정순서대로
    // console.log("users",users);
    const [pageNumber, setPageNumber] = useState(0);

    const usersPerPage = 5;//한페이지에 보여주는 갯수
    const pagesVisited = pageNumber * usersPerPage;// 1페이지에 1 * 10 / 2페이지에 2 * 20 //최대갯수인듯

    const displayUsers = products.slice(0,5)//50중에 
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
                        <div>
                            <img className="product-img" src={`${API_URL}/${product.imageUrl}`} alt="" />
                        </div>
                        <div className="product-contents">
                            {product.soldout === 1 
                                ?<span className="product-name" style={{textDecoration: 'line-through' }}>{product.name}</span> 
                                :<span className="product-name">{product.name}</span>
                            }
                            
                            {product.soldout === 1 
                                ?<span className="product-price">Soldout.</span> 
                                :<span className="product-price">{AddComma(product.price)} won</span> 
                            }
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

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };
    return(
        <div>
            { loading ? <div>Loading...</div>
                : 
                <>
                    <MainPage />
                    <div style={{background:'', backgroundSize:"cover"}}>
                        <h1 id="product-headline">New Arrivals.</h1>
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
                        
                    </div>
                </>
            }
        </div>
    )
}
export default Main;