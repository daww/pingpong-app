import React from "react";
import { Input, Button } from "semantic-ui-react";

class Login extends React.Component {
  render() {

    return (
      <div>
        <h3>Register account</h3>
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
        <Button onClick={this.props.onRegisterClick}>Register</Button>
      </div>
    );
  }
}

export default Login;
