import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

// actions
export const SET_ORDERRESULT ="SET_ORDERRESULT";//완료

//actioncreators

const setOrderResult = createAction(SET_ORDERRESULT, (orderresult) => ({orderresult}));


// initial
const initialState = {
    orderresult : [],
}


//middle
//메인페이지에서 상품 리스트 불러오기
const setOrderResultSV = (id,name,price,color,size,phone,address,memo,orderquantity)=>{
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
        dispatch(setOrderResult({id,name,price,color,size,phone,address,memo,orderquantity}));
    }
}


export default handleActions (
    {
        [SET_ORDERRESULT]: (state, action) =>
        produce(state, (draft)=>{
            draft.orderresult = action.payload.orderresult;
        })

    },
    initialState
);

const actionCreators = {
    setOrderResultSV,
}

export { actionCreators };
