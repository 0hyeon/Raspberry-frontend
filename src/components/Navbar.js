import React, { Component } from 'react';
import LeftMenu from './LeftMenu'
import RightMenu from './RightMenu'
import "../css/navbar.css";
import { Drawer, Button } from 'antd';
import { Link } from "react-router-dom";
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
              <RightMenu />
            </Drawer>
          </div>
        </nav>
    );
  }
}
export default Navbar;
