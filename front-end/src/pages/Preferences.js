import React from "react";
import axios from "axios";
import { Form, Button } from "semantic-ui-react";

class Login extends React.Component {
  state = {
    nickName: "",
    firstName: "",
    lastName: "",
    photo: null
  };
  componentDidMount = () => {
    axios
      .post("http://localhost:9000/user", {
        userId: this.props.match.params.id
      })
      .then(response => {
        // console.log(response.data);

        this.setState({
          nickName: response.data.nickName ? response.data.nickName : "",
          firstName: response.data.firstName ? response.data.firstName : "",
          lastName: response.data.lastName ? response.data.lastName : ""
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  onChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  onSubmit = () => {
    axios
      .post("http://localhost:9000/editprofile", {
        userId: this.props.match.params.id,
        nickName: this.state.nickName ? this.state.nickName : null,
        firstName: this.state.firstName ? this.state.firstName : null,
        lastName: this.state.lastName ? this.state.lastName : null
      })
      .then(response => {
        // console.log(response.data);

        this.setState({
          nickName: response.data.nickName ? response.data.nickName : "",
          firstName: response.data.firstName ? response.data.firstName : "",
          lastName: response.data.lastName ? response.data.lastName : ""
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <h3>Account preferences </h3>
        <Form>
          <Form.Field>
            <label>First Name</label>
            <input
              placeholder="First Name"
              name="firstName"
              onChange={this.onChange}
              value={this.state.firstName}
            />
          </Form.Field>
          <Form.Field>
            <label>Last Name</label>
            <input
              placeholder="Last Name"
              name="lastName"
              onChange={this.onChange}
              value={this.state.lastName}
            />
          </Form.Field>
          <Form.Field>
            <label>Nick Name</label>
            <input
              placeholder="Nick Name"
              name="nickName"
              onChange={this.onChange}
              value={this.state.nickName}
            />
          </Form.Field>

          <Button onClick={this.onSubmit}>Submit</Button>
        </Form>
      </div>
    );
  }
}

export default Login;
