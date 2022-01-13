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
dayjs.extend(relativeTime);//dayjs에서 확장된 기능 사용 

function Main(props) {
    // 슬라이드,상품
    // const [products, setProducts] = React.useState([]);// state형태
    // const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); //현재 페이지
    const [postPerPage] = useState(4); //페이지당 포스트 개수
    const [isproduct_list,setproduct_list] = useState([]);
    // const [banners, setBanners] = React.useState([]);
    // const state = useSelector((state) => state);
    // const products = useSelector((state) => state.allProducts.products);
    const products = useSelector((state) => state.products.products);
    const [isproducts,setproducts] = useState(null);
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
        let body = {
          seSsionId: Session
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
        
        // dispatch(setProducts(result.data));
    };
    React.useEffect(function () {
        // 상품관련
        // fetchProducts();
        dispatch(productActions.setProductSV());
        console.log("doing productOptionActions!!!",products.name);
        let Session = sessionStorage.getItem('user_id');
        setproduct_list(products);
        // console.log(products);
        // console.log(posts);
        fetchCartItem();
        // console.log(state.allProducts.cartItem)
        
    }, [isproduct_list]);

    React.useEffect(() => {
        console.log('!!!!!!!')
        console.log('products.name!!!!!!!',products.name)
        dispatch(productOptionActions.setProductOptionsSV(products.name));
    }, [isproduct_list,dispatch])
    //로그아웃
	// App 컴포넌트에서 전달받은 props 값은 아래와 같이 받아온다.
	const isLogin = props.isLogin
    
    const onLogout = () => {
    	// sessionStorage 에 user_id 로 저장되어있는 아이템을 삭제한다.
        sessionStorage.removeItem('user_id')
        // App 으로 이동(새로고침)
        document.location.href = '/'
    }
    //콤마 함수
    function AddComma(value) {
        return Number(value).toLocaleString('en');
    }
   
    return(
        <div>
            {/* <div>
                <button type='button' onClick={onLogout}>Logout</button>
            </div> */}
            <MainPage />
            {/* <div style={{background:'url("https://i.pinimg.com/originals/05/86/7e/05867e0b50799fc48e91e2f3d5460b1e.gif")', backgroundSize:"cover"}}> */}
            <div style={{background:'', backgroundSize:"cover"}}>
            {/* <div style={{background:'url("https://i.pinimg.com/originals/a7/7f/62/a77f6215e2f77eb5a6e4e77d7298809d.gif")', backgroundSize:"cover"}}> */}
                <h1 id="product-headline">NEW ARRIVALS</h1>
                <div className="product-list-wrapper" id="product-list">
                    {/* 상품리스트 */}
                    {products && products.map(function (product, index) {
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
                            <div>
                            <img className="product-img" src={`${API_URL}/${product.imageUrl}`} alt="" />
                            </div>
                            <div className="product-contents">
                            <span className="product-name">{product.name}</span>
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
                    })}
                </div>
                <div id="product-headline">Best Items</div>
                <div className="product-list-wrapper" id="product-list">
                </div>
            </div>
        </div>
    )
}
 
export default Main;