import { Menu, Icon } from "antd";
import React from "react";
import { Link } from "react-router-dom";
const SubMenu = Menu.SubMenu;

export default props => {
  const { isAuthenticated, onLogout, userName, userId } = props;
  return (
    <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
      <Menu.Item>
        <Link to="/rankings">
          <Icon type="idcard" /> Rankings
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/matches">
          <Icon type="profile" /> Matches
        </Link>
      </Menu.Item>

      <Menu.Item>
        <Link to="/newmatch">
          <Icon type="plus" /> New Match
        </Link>
      </Menu.Item>

      <Menu.Item>
        <Link to="/duorankings">
          <Icon type="idcard" /> Duo Rankings
        </Link>
      </Menu.Item>

      {isAuthenticated && (
        <Menu.Item>
          <Link to={`/preferences/${userId}`}>
            <Icon type="user" /> Preferences
          </Link>
        </Menu.Item>
      )}
      {isAuthenticated ? (
        <Menu.Item onClick={onLogout}>
          <Icon type="logout" /> Logout
        </Menu.Item>
      ) : (
        <Menu.Item>
          <Link to="/login">
            <Icon type="login" /> Login
          </Link>
        </Menu.Item>
      )}
    </Menu>
  );
};
