import React, { useState,Component } from 'react';
import LeftMenu from './LeftMenu'
import RightMenu from './RightMenu'
import RightMenu2 from './RightMenu2'
import "../css/navbar.css";
import { Drawer, Button} from 'antd';
import { Link } from "react-router-dom";
import { InstagramOutlined } from "@ant-design/icons";
import { useDispatch, useSelector,connect } from "react-redux";
const Navbar = (props) => {
  
  const user = useSelector(state => state.allProducts)
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  
    return (
        <nav className="menuBar">
          <div className="menuCon">
            {/* leftMenu */}
            <div className="leftMenu">
              <LeftMenu onClose={onClose} />
            </div>
            {/* logo */}
            <div className="logo">
            <Link to="/">
              <img src="/images/raspberryberryLogo.png" alt="로고" id="Logo_style"/>
            </Link>
            </div>
            {/* rightMenu */}
            <div className="rightMenu">
                <RightMenu />
            </div>
            {/* 모바일시 반응 */}
            <a href="https://www.instagram.com/j_i_hi/">
              <InstagramOutlined style={{ fontSize: '30px', color: '#000' }} />
            </a>
            <Button className="barsMenu" type="primary" onClick={showDrawer}>
              <span className="barsBtn"></span>
            </Button>
            <div className="cartCount2">{user.cartItem.length}</div> 
            <Drawer
              title="Menu"
              placement="right"
              closable={false}
              onClose={onClose}
              visible={visible}
            >
              <LeftMenu  onClose={onClose} /> 
    
              <br />
              <RightMenu2 onClose={onClose} />
            </Drawer>
          </div>
        </nav>
    );
}
export default Navbar;
