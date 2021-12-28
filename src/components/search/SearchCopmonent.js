// import React, { useState ,useMemo, useEffect } from "react";
// import { actionCreators as productActions } from "../../_modules/product";
// import { useSelector, useDispatch } from "react-redux";
// const SearchCopmonent = (props) => {
//     const dispatch = useDispatch();
//     const product_list = useSelector(state=> state.allProducts.products.products);//등록된 상품 
//     const [isProductList ,setProductList ] = useState(product_list);
    
//     useEffect(() => {
//         dispatch(productActions.setProductSV());
//         setProductList(product_list);
//         console.log('product_list',product_list)
//     },[isProductList]);

//     if(isProductList == undefined  ){
//         return;
//     }
//     return(
//         <React.Fragment>
//             <div padding="132px 12px 12px 28px">총개의 상품이 검색되었습니다.</div>
//         </React.Fragment>
//     )
// }

// export default SearchCopmonent
