import React from 'react';
import { useHistory } from "react-router-dom"
import { Button } from "antd";
const Qna = () => {
    const history = useHistory();

    return(
        <div style={{paddingTop:'100px',textAlign:'center'}}>
            
            <Button
            size="large"
            onClick={function () {
                history.push("/QnaWrite");
            }}
            >
            글쓰기
            </Button>
        </div>
    ) 
};

export default Qna;
