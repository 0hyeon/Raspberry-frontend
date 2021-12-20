import React from 'react'
import { useHistory,withRouter } from 'react-router-dom';
function Logout() {
    const history = useHistory();
    const onLogout = () => {
    	// sessionStorage 에 user_id 로 저장되어있는 아이템을 삭제한다.
        sessionStorage.removeItem('user_id')
        // App 으로 이동(새로고침)
        alert("로그아웃 되었습니다.");
        document.location.href = '/'
        // history.push("/");
    }
    return (
        <div>
            <div>
                {/* <button type='button' onClick={onLogout}>Logout</button> */}
                <span className="ant-menu-overflow-item ant-menu-item ant-menu-item-only-child" onClick={onLogout}>Logout</span>
            </div>
        </div>
    )
}

export default withRouter(Logout);