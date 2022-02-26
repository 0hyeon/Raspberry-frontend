import React, { useEffect,useState } from 'react';
import {API_URL} from "../config/constants.js";
import axios from "axios";

const OrderWait = () => {
    const [isOrderWait, setOrderWait] = useState("");
    const orderWaitLength = async () => {//결제대기 갯수
        await axios
        .get(`${API_URL}/v1/order/setOrderWait`)
        .then(function(result){
            console.log(result.data);
            setOrderWait(result.data.result)   
        })
        .catch((err) => {
            console.log("Err: ", err);
        });
    };
    useEffect(() => {
        orderWaitLength()//결제대기 갯수
    },[])
  return (
    <div style={{paddingTop:100, textAlign:'center'}}>
        {isOrderWait && isOrderWait.map((w) => {
                    return (
                      <div key={w.id} >
                        <div className='comment_name'>
                            {w.id}        
                            d                  
                        </div>
                      </div>
                    );
                  })}
    
    </div>
  )
}

export default OrderWait