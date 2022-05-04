import React, {useState} from 'react';
import { Tabs, Tab } from "@tarragon/swipeable-tabs/dist";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {API_URL} from "../config/constants.js";
const BestCategory = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const changeTab = (updatedTab)  => {
    setSelectedTab(updatedTab.label);
  }
  const products = useSelector((state) => state.products.products);

  const uniqueCategory = products.map((it)=>(it.category));
  let uniqueCategory2 = [...new Set(uniqueCategory)]
  return (
    <div style={{background:'', backgroundSize:"cover"}} className="bestCategoryWrap">
        <h1 className="product-headline">BEST CATEGORY</h1>
        <Tabs 
            value={selectedTab} 
            onChange={changeTab} 
            styleProps={{
                selectedHeaderTextColor: "#1890ff",
                headerTextColor: "black",
                activeInkBarColor: "#1890ff",
                inkBarColor: "hsla(0,0%,100%,.45)",
                size: "medium",
                barColor: "transparent"
            }}
        >
        {uniqueCategory2.map((it,i)=>{
            return(<Tab label={it} key={i || 0}>
                {products.length > 0 ? (
                    products
                    .filter(goods => goods.category === it)
                    .slice(0,6)
                    .map((goods, index) => (
                        <>
                            <Link
                                style={{ color: "inherit"}}
                                className="product-link"
                                to={`/products/${goods.id}`}
                            >
                                <div className='objectMenu' style={{width:'33.33%',display:'inline-block',pointerEvents:'inherit'}}>
                                        <img key={`goods-${index}`}  src={
                                        process.env.NODE_ENV === 'production'
                                        ?`${goods.imageUrl}`
                                        :`${API_URL}/${goods.imageUrl}`} alt={`${i}번째사진`} style={{width:'100%',pointerEvents:'none'}}/> 
                                </div>
                            </Link>
                        </>
                    ))
                ) : (
                    <div className="no-goods">상품 없음</div>
                )}
            </Tab>)
        })}
        </Tabs>
    </div>
  )
}

export default BestCategory