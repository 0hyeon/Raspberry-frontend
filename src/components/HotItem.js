import React, {useEffect, useState} from 'react';
import Post from "./Post"
import Pagination from "./Pagination"
import { useDispatch,useSelector, connect } from 'react-redux';
function HotItem(props) {

    let state = useSelector(state => state);
    
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); //현재 페이지
    const [postPerPage] = useState(4); //페이지당 포스트 개수

    

    const indexOfLastPost = currentPage * postPerPage; //1*10 = 10번 포스트
    const indexOfFirstPost = indexOfLastPost - postPerPage; //10-10 = 0번 포스트
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); //0~10번까지 포스트
    const paginate = pageNum => setCurrentPage(pageNum);

    
    useEffect(() => {
        console.log(state);
        let guys = state.allProducts.products.products;
        console.log(guys);
        if(guys == undefined){
            return;
        }
         const HotFilter = guys.filter(man => man.quantity1 == 5); 
        setPosts(HotFilter);
        
        // if(guys){
        //     return () => {
        //         setPosts(HotFilter);
        //     }
        // }
    },[state]);
    // if(guys)
    return (
        <div>
            <div className="product-list-wrapper" id="product-list_third">
                <Post posts={currentPosts}/>
            </div>
                <Pagination 
                    postPerPage={postPerPage} 
                    totalPosts={posts.length} 
                    paginate={paginate}  
                />
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
      allProducts: state.allProducts
    }
}
  
export default connect(mapStateToProps)(HotItem);