import React , { useEffect,useState } from 'react'
import SearchCopmonent from './search/SearchCopmonent'
import { actionCreators as productActions } from "../_modules/product";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from './SearchBar';
import { history } from "../_reducers/index";
const Serarch = () => {

    const dispatch = useDispatch();
    const [isproduct_list,setproduct_list] = useState([]);
    const product_list = useSelector((state) => state.allProducts.products.products);

    const [product, setProduct] = React.useState([]);// state형태
    useEffect(() => {
        dispatch(productActions.setProductSV());
        setproduct_list(product_list)
        // document.location.href='/Search'
    },[isproduct_list]);
    
    
    if (isproduct_list === null || product_list === null) {//데이터 로딩 
        return <h1>상품 정보를 받고 있습니다...</h1>;
    }
    if (product_list == [] || product_list == null ){//리덕스 새로고침시 state없어져서 루트로 보냄 
        history.push("/");
    }
    return (
        <div style={{paddingTop:'100px',textAlign:'center'}}>
            <SearchBar placeholder='상품을 입력해보세요.' data={product}/>
        </div>
    )
}

export default Serarch
