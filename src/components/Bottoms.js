import React, {useState} from 'react';
import "../css/NewPage.css";
import "../css/Paging.css";
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {API_URL} from "../config/constants.js";
import dayjs from "dayjs";
import ReactPaginate from "react-paginate";
import { actionCreators as productActions } from "../_modules/product";
import { actionCreators as productOptionActions } from "../_modules/productoptions";
const Bottoms = () => {
    const dispatch = useDispatch();
    const [pageNumber, setPageNumber] = useState(0);
    const [loading, setLoading] = useState(true);
    const products = useSelector((state) => state.products.products);
    // const products = useSelector((state) => state.products.products.category == 'NEW');
    const usersPerPage = 5;//한페이지에 보여주는 갯수
    const pagesVisited = pageNumber * usersPerPage;// 1페이지에 1 * 10 / 2페이지에 2 * 20 //최대갯수인듯

    React.useEffect(function () {
        // 상품관련
        // fetchProducts();
        dispatch(productActions.setProductSV());
        dispatch(productOptionActions.setProductOptionsSV(products.name));
        setLoading(false);
    }, []);
    function AddComma(value) {
        return Number(value).toLocaleString('en');
    }

    const displayUsers = products.slice(0,5)//50중에 
        .slice(pagesVisited, pagesVisited + usersPerPage)// 최대갯수 ~  최대갯수 + 10
        .filter(item => item.category == "Bottoms").map((product) => {
        // .filter(item => item.category == "DRESSES/SKIRTS").map((product) => {
            return (
                <div className="product-card">
                {
                    product.soldout === 100 && <div className="product-blur" />
                }
                    <Link
                        style={{ color: "inherit" }}
                        className="product-link"
                        to={`/products/${product.id}`}
                    >
                        <div className="wrppper-product-img">
                            <img className="product-img" src={
                                process.env.NODE_ENV === 'production'
                                ?`${product.imageUrl}`
                                :`${API_URL}/${product.imageUrl}`} alt="." />
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
    console.log("in New category page products",products);
    return <div style={{paddingTop:"100px",textAlign:'center'}}>
        { loading ? <div>Loading...</div>  :
            <>
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
            </>
        }
    </div>;

};

export default Bottoms;
