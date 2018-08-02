import { Menu } from "semantic-ui-react";
import React from "react";
import { Link } from "react-router-dom";

export default props => {
  const { activeItem, isAuthenticated, onLogout, userName, userId } = props;
  return (
    <Menu vertical>
      <Menu.Item>
        <Menu.Header>Singles</Menu.Header>
        <Menu.Menu>
          <Link to="/rankings">
            <Menu.Item name="rankings" active={activeItem === "rankings"} />
          </Link>
          <Link to="/matches">
            <Menu.Item name="matches" active={activeItem === "matches"} />
          </Link>

          <Link to="/newmatch">
            <Menu.Item name="newmatch" active={activeItem === "newmatch"} />
          </Link>
        </Menu.Menu>
      </Menu.Item>
      <Menu.Item>
        {/* <Link to="/">
        <Menu.Item name="home" active={activeItem === "home"} />
      </Link> */}
        <Menu.Header>Doubles</Menu.Header>
        <Menu.Menu>
          <Link to="/duorankings">
            <Menu.Item
              name="duorankings"
              active={activeItem === "duorankings"}
            />
          </Link>
        </Menu.Menu>
      </Menu.Item>
      <Menu.Item>
        <Menu.Header>Hello, {userName}</Menu.Header>

        <Menu.Menu position="right">
          {isAuthenticated ? (
            <React.Fragment>
              <Link to={`/preferences/${userId}`}>
                <Menu.Item name="preferences" />
              </Link>
              <Menu.Item name="logout" onClick={onLogout} />
            </React.Fragment>
          ) : (
            <Link to="/login">
              <Menu.Item name="login" />
            </Link>
          )}
        </Menu.Menu>
      </Menu.Item>
    </Menu>
  );
};
