import React from 'react';
import { Menu, Grid } from 'antd';
import { Link } from "react-router-dom";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const { useBreakpoint } = Grid;

const LeftMenu = (props) => {
  const { md } = useBreakpoint()
  return (
    <Menu mode={md ? "horizontal" : "inline"}>
      {/* <SubMenu key="sub1" title={<span>New</span>}> */}
        {/* <MenuItemGroup title="신상입고"> */}
          <Menu.Item key="setting:1">
            <Link
              style={{ color: "inherit" }}
              className=""
              to={`/NewPage`}
              onClick={() => props.onClose()}
            >New</Link>
          </Menu.Item>
        {/* </MenuItemGroup> */}
      {/* </SubMenu> */}
      {/* <SubMenu key="sub2" title={<span>Outerwear</span>}> */}
        {/* <MenuItemGroup title="Rasberry Outerwear"> */}
          <Menu.Item key="setting:2">
            <Link
              style={{ color: "inherit" }}
              className=""
              to={`/Outerwear`}
              onClick={() => props.onClose()}
            >Outerwear</Link>
          </Menu.Item>
        {/* </MenuItemGroup> */}
        {/* <MenuItemGroup title="2+1">
          <Menu.Item key="setting:4">2+1 event</Menu.Item>
        </MenuItemGroup> */}
      {/* </SubMenu> */}
      <Menu.Item key="setting:3">
        <Link
          style={{ color: "inherit" }}
          className=""
          to={`/Tops`}
          onClick={() => props.onClose()}
        >Tops</Link>
      </Menu.Item>
      <Menu.Item key="setting:4">
        <Link
          style={{ color: "inherit" }}
          className=""
          to={`/Bottoms`}
          onClick={() => props.onClose()}
        >Bottoms</Link>
      </Menu.Item>
      {/* <SubMenu key="sub5" title={<span>Dresses / Skirts</span>}> */}
        {/* <MenuItemGroup title="Dresses / Skirts"> */}
          <Menu.Item key="setting:5">
            <Link
              style={{ color: "inherit" }}
              className=""
              to={`/Dresses`}
              onClick={() => props.onClose()}
            >
            Dresses</Link>
          </Menu.Item>
          <Menu.Item key="setting:6">
            <Link
              style={{ color: "inherit" }}
              className=""
              to={`/Skirts`}
              onClick={() => props.onClose()}
            >
            Skirts</Link>
          </Menu.Item>
        {/* </MenuItemGroup> */}
       {/* </SubMenu> */}
    </Menu>
  );
}

export default LeftMenu;