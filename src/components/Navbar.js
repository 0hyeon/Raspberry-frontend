import React, { Component } from 'react';
import LeftMenu from './LeftMenu'
import RightMenu from './RightMenu'
import RightMenu2 from './RightMenu2'
import "../css/navbar.css";
import { Drawer, Button} from 'antd';
import { Link } from "react-router-dom";
import { InstagramOutlined } from "@ant-design/icons";
class Navbar extends Component {
  state = {
    current: 'mail',
    visible: false,
  }
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  onClose = () => {
      this.setState({
        visible: false,
      });
    };
  handlerOver = (event) => {
    event.target.style.backgroundColor = "#000"
  }
  
render() {
    return (
        <nav className="menuBar">
          <div className="menuCon">
            {/* leftMenu */}
            <div className="leftMenu">
              <LeftMenu />
            </div>
            {/* logo */}
            <div className="logo">
            <Link to="/">
              <img src="/images/raspberrylogo.png" alt="로고" id="Logo_style"/>
            </Link>
            </div>
            {/* rightMenu */}
            <div className="rightMenu">
                <RightMenu />
            </div>
            <a href="https://www.instagram.com/j_i_hi/">
              <InstagramOutlined style={{ fontSize: '30px', color: '#000' }} />
            </a>
            <Button className="barsMenu" type="primary" onClick={this.showDrawer}>
              <span className="barsBtn"></span>
            </Button>
            <Drawer
              title="Menu"
              placement="right"
              closable={false}
              onClose={this.onClose}
              visible={this.state.visible}
            >
              <LeftMenu />
              <br />
              <RightMenu2 />
            </Drawer>
          </div>
        </nav>
    );
  }
}
export default Navbar;
