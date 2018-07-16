import { Menu } from "semantic-ui-react";
import React from "react";
import { Link } from "react-router-dom";

export default props => {
  const { activeItem, isAuthenticated } = props;
  return (
    <Menu>
      <Link to="/">
        <Menu.Item name="home" active={activeItem === "home"} />
      </Link>
      <Link to="/rankings">
        <Menu.Item name="rankings" active={activeItem === "rankings"} />
      </Link>
      <Link to="/duorankings">
        <Menu.Item name="duorankings" active={activeItem === "duorankings"} />
      </Link>
      <Menu.Menu position="right">
        <Link to={isAuthenticated ? "/logout" : "/login"}>
          <Menu.Item name={isAuthenticated ? "logout" : "login"} />
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
