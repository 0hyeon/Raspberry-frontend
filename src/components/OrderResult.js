import React from 'react'

const OrderResult = () => {
    return (
        <div className='orderResult' style={{paddingTop:'100px'}}>
            주문내역 : 
            {/* db shop_order요청해서 결제완료, 주소, 이름,전하번호,배송상태 가져온다   */}
             <p style={{color:"darkblue" ,lineHeight:"2"}}>주문이 성공적으로 완료되었습니다. (상단메뉴 주문조회에서 확인가능합니다. )</p>

        </div>
    )
}

export default OrderResult
