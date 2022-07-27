import React, {useState} from 'react';
import "../css/Paging.css";
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import {API_URL} from "../config/constants.js";
import dayjs from "dayjs";
import ReactPaginate from "react-paginate";
import { actionCreators as productActions } from "../_modules/product";
import { actionCreators as productOptionActions } from "../_modules/productoptions";
const OuterWear = () => {
    const dispatch = useDispatch();
    const [pageNumber, setPageNumber] = useState(0);
    const [loading, setLoading] = useState(true);
    const [reviewAll, setreviewAll] = useState([]);
    const products = useSelector((state) => state.products.products);
    // const products = useSelector((state) => state.products.products.category == 'NEW');
    const usersPerPage = 10;//한페이지에 보여주는 갯수
    const pagesVisited = pageNumber * usersPerPage;// 1페이지에 1 * 10 / 2페이지에 2 * 20 //최대갯수인듯

    React.useEffect(function () {
        // 상품관련
        // fetchProducts();
        dispatch(productActions.setProductSV());
        dispatch(productOptionActions.setProductOptionsSV(products.id));
        fetchreviewAll();
        setLoading(false);
    }, []);
    function AddComma(value) {
        return Number(value).toLocaleString('en');
    }
    function PdSalePercent(price,maketPrice) {
        return Math.round((1 - ( price/ maketPrice )) * 100)
    }
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
    const displayUsers = products.slice(0,50)//50중에 
        .slice(pagesVisited, pagesVisited + usersPerPage)// 최대갯수 ~  최대갯수 + 10
        .filter(item => item.category === "Outerwear").map((product) => {
        // .filter(item => item.category == "DRESSES/SKIRTS").map((product) => {
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
                                            ? <div className="productSalePercent2">{PdSalePercent(product.price,product.marketPrice)}%</div> 
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

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };
    return <div style={{paddingTop:"100px",textAlign:'center'}}>
        { loading ? <div>Loading...</div>  :
            <>
                <h1 className="product-headline">Outerwear.</h1>
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

export default OuterWear;
