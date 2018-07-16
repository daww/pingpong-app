import React from "react";
import { Redirect } from "react-router-dom";
import { Input, Button } from "semantic-ui-react";

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
