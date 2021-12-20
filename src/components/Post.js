import React from 'react';
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import relativeTime from "dayjs/plugin/relativeTime"
import {API_URL} from "../config/constants.js";
dayjs.extend(relativeTime);//dayjs에서 확장된 기능 사용 
const Post = ({posts, loading}) => {
    if(loading) {
        return <h2>...loading</h2>;
    }
    function AddComma(value) {
        return Number(value).toLocaleString('en');
    }
    return (
        <>
            {posts.map(post => 
                        <div className="product-card">
                        {
                            post.soldout === 1 && <div className="product-blur" />
                        }
                        <Link
                            style={{ color: "inherit" }}
                            className="product-link"
                            to={`/products/${post.id}`}
                        >
                                <div>
                                <img className="product-img" src={`${API_URL}/${post.imageUrl}`} alt="" />
                                </div>
                                <div className="product-contents">
                                <span className="product-name">{post.name}</span>
                                <span className="product-price">{AddComma(post.price)} won</span>
                                <div className="product-color">
                                        {post.color1 ? <div className="product-color_1" style={{backgroundColor:post.color1}}></div> : null}
                                        {post.color2 ? <div className="product-color_1" style={{backgroundColor:post.color2}}></div> : null}
                                        {post.color3 ? <div className="product-color_1" style={{backgroundColor:post.color3}}></div> : null}
                                </div>
                                <div className="product-footer">
                                    
                                    <div className="product-seller">
                                    <img
                                        className="product-avatar"
                                        src="images/icons/avatar.png" alt=""
                                    />
                                    <span>{post.seller}</span>
                                    </div>
                                    <span className="product-date">{dayjs(post.createdAt).fromNow()}</span>
                                </div>
                                </div>
                            </Link>
                        </div>
            )}
        </>
    );
};

export default Post;