import React , {useEffect, useState} from 'react'
import "../css/SearchBar.css";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { actionCreators as productActions } from "../_modules/product";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function SearchBar({placeholder}) {

    const dispatch = useDispatch();
    const product_list = useSelector((state) => state.allProducts.products.products);

    const [product, setProduct] = React.useState([]);// state형태

    useEffect(() => {
        dispatch(productActions.setProductSV());
        setProduct(product_list)
    },[]);
    // if ( product == []) {
    //     return <h1>상품 정보를 받고 있습니다...</h1>;
    // }
    const [filteredData, setFilteredData] = useState([]);
    const [wordEnterd, setWordEnterd] = useState("");
    const handleFilter = (event) => {
        
        const searchWord = event.target.value; //검색의 input value 
        setWordEnterd(searchWord);
        const newFilter = product_list.filter((value) => {
            return value.name.toLowerCase().includes(searchWord.toLowerCase());
        });
        if(searchWord === ""){
            setFilteredData([]);
        }else{
            setFilteredData(newFilter);
        }
    
    }
    const clearInput = () => {
        setFilteredData([]);
        setWordEnterd("");
        
    }
    return (
        <div className='search'>
            <div className='searchInputs'>
                <input type='text' placeholder={placeholder} value={wordEnterd}  onChange={handleFilter} />
                <div className='searIcon'>
                    {filteredData.length === 0 ? <SearchOutlined style={{fontSize:'26px'}}/> : <CloseOutlined style={{fontSize:'26px'}} id="ClearBtn" onClick={clearInput} /> }
                </div>
            </div>
            {filteredData.length !== 0 &&(
                <div className='dataResult'>
                    {filteredData.slice(0,15).map((value, key) => {
                        return (
                            <Link style={{ color: "inherit" }} key={value.id} to={`/products/${value.id}`}>
                                {value.name}
                            </Link>
                        )
                    })}
                </div>
            )}
            {filteredData.length === 0 &&(
                <div style={{marginTop:'20px'}}>No items were found.</div>
            )}
        </div>
    )
}

export default SearchBar
