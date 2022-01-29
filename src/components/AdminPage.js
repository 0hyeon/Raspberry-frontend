import React, { useEffect,useState } from 'react';
import { withRouter,Link,useHistory } from "react-router-dom";
import {API_URL} from "../config/constants.js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {setProducts,} from "../_actions/userAction";
import "../css/AdminPage.css";
import dayjs from "dayjs";
import { Button,Divider } from "antd";
import { DownloadOutlined} from "@ant-design/icons";
import jwt_decode from "jwt-decode";
const AdminPage = () => {
    const products = useSelector((state) => state.allProducts.products);
    const dispatch = useDispatch();
    let state = useSelector(state => state);
    let Session = sessionStorage.getItem('user_id');
    const history = useHistory();
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
    const fetchProducts = async () => { 
        await axios
        .get(`${API_URL}/v1/product/products`)
        .then(function(result){
            dispatch(setProducts(result.data));
        })
        .catch((err) => {
            console.log("Err: ", err);
        });
    };
    const ProductUpdate = (id) => {
        if(window.confirm("item_id "+id+ "설정 하시겠습니까?")){
            history.push(`/ProductsUpdate/${id}`);
        }else{
            return;
        }
    }
    const ProductDelete = async(id) => {
        if(window.confirm("item_id "+id+ "삭제 하시겠습니까?")){
            // history.push("/CartPage");
            console.log(id + '삭제됨');
            
            const body = {ItemId: id};

            await axios
            .post(`${API_URL}/v1/product/AdmdeleteToItem`, body)
            .then(function(result){
                console.log(result.data);
            })
            .catch((err) => {
                console.log("Err: ", err);
            });

            fetchProducts();

        }else{
            return;
        }
    }
    useEffect(() => {
        fetchProducts()
        console.log(products);
    },[])

    return (
        <div style={{textAlign:'center'}}>
            <h1 id="product-headline">Admin Page</h1>
            <div className='product-delivery-wrapper'>
                <ul>
                    <li>결제완료
                        <div>0</div>
                    </li>
                    <li>배송준비
                        <div>1</div>
                    </li>
                    <li>배송중
                        <div>0</div>
                    </li>
                    <li>배송완료
                        <div>0</div>
                    </li>
                </ul>
            </div>
            <div className="product-list-wrapper" id="product-list">
                {/* 상품리스트 */}
                {products.products && products.products.map(function (product, index) {
                return (
                    <div className="adm-product-card">
                        {
                            product.soldout === 1 && <div className="product-blur" />
                        }
                            <div className='product-img-wrapper'>
                                
                                <img className="adm-product-img" src={`${API_URL}/${product.imageUrl}`} alt={product.imageUrl} />
                            </div>
                        <div className="admCommon adm-product-name"><span>Item_ID :</span> {product.id}</div>
                        <div className="admCommon adm-name"><span>Name: :</span> {product.name}</div>
                        <div className="admCommon adm-product-name"><span>Price :</span> {product.price}</div>
                        <div className="admCommon adm-product-name"><span>category :</span> {product.category}</div>
                        <button id="admLoginButton"type='button' onClick={ ()=> ProductUpdate(product.id) } >상품수정</button>
                        <button id="admDelete"type='button' onClick={ ()=> ProductDelete(product.id) } >삭제</button>
                    </div>
                );
                })}
            </div>
                    <Button
                    size="large"
                    onClick={function () {
                        history.push("/Admin");
                    }}
                    icon={<DownloadOutlined />}
                    >
                    상품 등록준비
                    </Button>
        </div>
    );
    // return (
    //     <div>
    //         <h1 id="product-headline">NEW ARRIVALS</h1>
    //     </div>
    // );
};

export default withRouter(AdminPage);