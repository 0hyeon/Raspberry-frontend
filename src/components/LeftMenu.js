import React from 'react';
import { Menu, Grid } from 'antd';
import { Link } from "react-router-dom";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const { useBreakpoint } = Grid;

const LeftMenu = () => {
  const { md } = useBreakpoint()
  return (
    <Menu mode={md ? "horizontal" : "inline"}>
      <SubMenu key="sub1" title={<span>New</span>}>
        <MenuItemGroup title="신상입고">
          <Menu.Item key="setting:1">
            <Link
              style={{ color: "inherit" }}
              className=""
              to={`/NewPage`}
            >
            New</Link>
          </Menu.Item>
        </MenuItemGroup>
      </SubMenu>
      <SubMenu key="sub2" title={<span>Outerwear</span>}>
        <MenuItemGroup title="♥가을이벤트♥">
          <Menu.Item key="setting:2"><a href="">간지나는</a></Menu.Item>
        </MenuItemGroup>
        <MenuItemGroup title="겨울나기이벤트">
          <Menu.Item key="setting:4">겨울 재큇</Menu.Item>
        </MenuItemGroup>
      </SubMenu>
      <Menu.Item key="sub3">
        <a href="">Tops</a>
      </Menu.Item>
      <Menu.Item key="sub4">
        <a href="">Bottoms</a>
      </Menu.Item>
      <SubMenu key="sub5" title={<span>Dresses / Skirts</span>}>
        <MenuItemGroup title="Dresses / Skirts">
          <Menu.Item key="setting:5">
            <Link
              style={{ color: "inherit" }}
              className=""
              to={`/DRESSESSKIRTS`}
            >
            Dresses / Skirts</Link>
          </Menu.Item>
        </MenuItemGroup>
      </SubMenu>
    </Menu>
  );
}

export default LeftMenu;