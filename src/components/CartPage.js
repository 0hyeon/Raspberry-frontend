import React,{ useEffect, useState} from "react";
import "../css/CartPage.css";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import {API_URL} from "../config/constants.js";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import Payment from "./Payment";
import {removefromcart,increment,decrement,setCartItem,setRequestLoding2} from '../_actions/userAction'
import { DeleteOutlined } from '@ant-design/icons';
import { actionCreators as productActions } from "../_modules/product";
import { actionCreators as productOptionActions } from "../_modules/productoptions";
import { actionCreators as productOptionActionsDetails } from "../_modules/productoptionDetails";
import { Button } from "antd";
import axios from "axios";
import { actionCreators as userActions } from "../_modules/user";
import jwt_decode from "jwt-decode";
function CartPage(props) {
    const [isinputqty, setinputqty] = useState(null);
    const CartList = useSelector((state) => state.allProducts.cartItem);
    const products = useSelector((state) => state.products.products);
    const pdopt = useSelector((state) => state.productoptionDetails.productoptionDetails);
    const [isCart, setCart] = useState(false);
    const [isCartUi, setCartUi] = useState();
    const [istotalPrice, settotalPrice] = useState(null);
    const [isdeleveryPrice, setisdeleveryPrice] = useState(null);
    const [isproduct_list,setproduct_list] = useState([]);

    const dispatch = useDispatch();
    const fetchCartItem = async () => {

        let Session = sessionStorage.getItem('user_id');
        if (Session){

            const decoded = jwt_decode(Session).user_id;
            let body = {
                seSsionId: decoded
              // heyt: session_redux
            }
            // dispatch(setRequestLoding())//loding true로 장바구니 랜더링
            await axios
                .post(`${API_URL}/v1/cart/setCartItem`, body)
                .then(function(result){
                    console.log('cartpage result.data : ',result.data);
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
    useEffect(() => {
        dispatch(productActions.setProductSV());//product
        // console.log("CartList.cartItem",CartList.cartItem.map((item)=> item));
        const cartList_map = CartList && CartList.map((item)=> item);
        console.log("cartList_map!",cartList_map);
        dispatch(productOptionActionsDetails.setProductDetailSV(cartList_map));
    }, [dispatch,CartList])

    useEffect(function () {
        // 상품관련
        // fetchProducts();
        let Session = sessionStorage.getItem('user_id');
        dispatch(productActions.setProductSV());
        if (Session){
            dispatch(userActions.setUserSV());
        }

        dispatch(productOptionActions.setProductOptionsSV(products.id));
        setproduct_list(products);
        fetchCartItem();
        setCart(true);
    }, [dispatch,isCart]);

    
    const Delete_Handelr = async(e) => {
        let Session = sessionStorage.getItem('user_id');
        let cartId = e.target.id;
        if (Session){
            let body = {
            cartId: cartId
            }
            await axios
            .post(`${API_URL}/v1/cart/deleteToCart`, body)
            .then(function(result){
                console.log(result.data);
            })
            .catch((err) => {
                console.log("Err: ", err);
            });
            fetchCartItem();

        }else{
            console.log("cartId" ,cartId);
            dispatch(removefromcart(cartId));
        }
    }
    //수량클릭시 수량변경 state && 수량dispatch
    const input_qty_handler = (product,e) => {
        // console.log(e.target.id)
        // console.log(product);

        if(e.target.id == "input_qty_plus"){
            dispatch(increment(product))
            setinputqty(product.it_Detail_quanity)
        }else{
            if(product.it_Detail_quanity < 2){return;}
            dispatch(decrement(product))
            setinputqty(product.it_Detail_quanity)
        }
    }
    
    
    function AddComma(value) {
        return Number(value).toLocaleString('en');
    }

    
    //총가격
    const TotalPrice = CartList && CartList.map(function (product) {
        return(
            Number(product.it_Detail_quanity * product.it_sc_price)
        );
    })

    

    let TotalPrice2 = []

    for(let i = 0;i<TotalPrice.length;i++){
        TotalPrice2 = Number(TotalPrice2) + Number(TotalPrice[i])
    }
    if (isCart == 0) {
        return <h1>.</h1>;
    }
    return (
        <div className="CartPage_Wrapper">
            
            {/* 카트개수 */}
            <div className="CartPage_HeadLine">Cart ({CartList.length})</div>
            {/* 카트리스트 */}
            <div id="">
                <table id="sod_list" className="table">
                    <thead>
                        <tr className="sod_list_head">
                            <th scope="col" width="*" className="text_left">상품명</th>
                            <th scope="col" width="15%" className="second_td">수량</th>
                            <th scope="col" width="25%">가격</th>
                            <th scope="col" width="25%">배송비</th>
                            <th scope="col" width="10%">삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                    {CartList && CartList.map(function (product) {
                        return (
                            <tr key={product.id}>
                            <td className="first_td">
                                <div>
                                <Link
                                    style={{ color: "inherit" }}
                                    className="product-link2"
                                    to={`/products/${product.it_id}`}
                                >
                                    <img className="thumb_img" src={
                                        process.env.NODE_ENV === 'production'
                                        ?`${product.thumb_name}`
                                        :`${API_URL}/${product.thumb_name}`} alt={product.it_id} />
                                </Link>
                                <Link
                                    style={{ color: "inherit" }}
                                    className="product-link2"
                                    to={`/products/${product.it_id}`}
                                >
                                    <span className="thumb_text">{product.it_name}</span>
                                    <span className="thumb_text_Detail">{product.it_Detail_color}/{product.it_Detail_size}</span>
                                </Link>
                                </div>
                            </td>
                            <td className="second_td">
                                <div className="input_qty input_qty_side" id="input_qty_minus" onClick={(e) => {input_qty_handler(product,e)}}>-</div>
                                <input className="input_qty" id={product.id} type="number" autoComplete="off" min="1" max="100" value={product.it_Detail_quanity || ''} onChange={(e) => setinputqty(e.target.value)} />
                                <div className="input_qty input_qty_side" id="input_qty_plus" onClick={(e) => {input_qty_handler(product,e)}}>+</div>
                            </td>
                            <td>{AddComma( product.it_Detail_quanity * product.it_sc_price)}</td>
                            <td rowSpan={CartList.length}  className="targetRowspan">2500원
                                (100,000이상 무상)
                            </td>
                            <td className="remove_box_wrapper" >
                                <div id={product.id} className="DeleteButton"  onClick={ Delete_Handelr }>삭제</div>
                            </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                {CartList == 0 ? <div className="Cart_empty">장바구니가 비었습니다.</div> : null}
            </div>
            {/* 카트토탈가격 */}
            {CartList == 0 ? null :
            
                <div className="total_Price_wrpper">
                    <div className="total_Price">
                        <div className="total_Price_Text">상품합계</div>    
                        <div className="total_Price_Number">{AddComma(TotalPrice2)}won</div>
                    </div>  
                    <div className="total_post_price">
                        <div className="total_Price_Text">배송비</div>
                        <div className="total_Price_Number" 
                            id="isdeleveryPrice" 
                            value={TotalPrice2 < 100000 ? 2500 : 0}
                        >
                            {TotalPrice2 < 100000 ? AddComma(2500) : 0} won
                    </div>
                    </div>
                    <div className="last_total_price">
                        <div className="total_Price_Text textAlignB">합계</div>
                        <div className="total_Price_Number textAlignB">{AddComma(TotalPrice2 < 100000 ? TotalPrice2+2500 : TotalPrice2)} won</div>
                    </div>
                    {/* <Payment name={CartList.cartItem.length+"개상품"} price={TotalPrice2 < 100000 ? TotalPrice2+2500 : TotalPrice2} /> */}
                    <Button id="purchase-button">
                        <Link  
                            style={{color:'inherit'}}
                            to={`/OrderPageMulti`}
                        >주문하기</Link>
                    </Button>
                    
                    <br />
                    
                </div>
            }
        </div>
    )
}

export default withRouter(CartPage);