import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

// actions
export const SET_PRODUCTSOPTIONDETAILS ="SET_PRODUCTSOPTIONDETAILS";//완료

//actioncreators

const setProductoptionDetails = createAction(SET_PRODUCTSOPTIONDETAILS, (productoptionDetails) => ({productoptionDetails}));


// initial
const initialState = {
    productoptionDetails : [],
}


//middle
//메인페이지에서 상품 리스트 불러오기
const setProductDetailSV = (id,name,color,size,price,imageurl,colortype,quantity1,orderquantity)=>{
    // console.log("id!!!!!!!!받는곳",id);
    // console.log("name!!!!!!!!받는곳",name);
    // console.log("color!!!!!!!!받는곳",color);
    // console.log("size!!!!!!!!!받는곳",size);
    // console.log("price!!!!!!!!!받는곳",price);
    // console.log("imageurl!!!!!!!!!받는곳",imageurl);
    // console.log("colortype!!!!!!!!!받는곳",colortype);

    //남은수량
    //주문한수량
    return function(dispatch) {
        dispatch(setProductoptionDetails({id,name,color,size,price,imageurl,colortype,quantity1,orderquantity}));
    }
}


export default handleActions (
    {
        [SET_PRODUCTSOPTIONDETAILS]: (state, action) =>
        produce(state, (draft)=>{
            draft.productoptionDetails = action.payload.productoptionDetails;
        })

    },
    initialState
);

const actionCreators = {
    setProductDetailSV,
}

export { actionCreators };
