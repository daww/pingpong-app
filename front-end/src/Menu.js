import { Menu } from "semantic-ui-react";
import React from "react";
import { Link } from "react-router-dom";

export default props => {
  const { activeItem, isAuthenticated, onLogout, userName, userId } = props;
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
        {isAuthenticated ? (
          <React.Fragment>
            <Link to={`/preferences/${userId}`}>
              <Menu.Item name="preferences" />
            </Link>
            {userName && <Menu.Item>Hello, {userName}</Menu.Item>}
            <Menu.Item name="logout" onClick={onLogout} />
          </React.Fragment>
        ) : (
          <Link to="/login">
            <Menu.Item name="login" />
          </Link>
        )}
      </Menu.Menu>
    </Menu>
  );
};
