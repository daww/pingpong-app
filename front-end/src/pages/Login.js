import React from "react";
import { Redirect, Link } from "react-router-dom";
import { Input, Button } from "antd";

class Login extends React.Component {
  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      return <Redirect to={"/"} />;
    }

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <p>
          No account? <Link to="/register">Register a new account</Link>
        </p>
        <Input
          type="text"
          onChange={this.props.onFormItemChange}
          name="username"
          placeholder="username"
          value={this.props.username}
        />
        <Input
          type="text"
          onChange={this.props.onFormItemChange}
          name="password"
          placeholder="password"
          value={this.props.password}
        />
        <Button onClick={this.props.onLoginClick}>Log in</Button>
      </div>
    );
  }
}

export default Login;
