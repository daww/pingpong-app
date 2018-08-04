import React from "react";
import axios from "axios";
import { Message, Form, Button } from "semantic-ui-react";

class Login extends React.Component {
  constructor() {
    super();
    this.fileInput = React.createRef();
  }
  state = {
    nickName: "",
    firstName: "",
    lastName: "",
    photo: null,
    imageValid: true
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

  onProfileUpload = event => {
    const file = this.fileInput.current.files[0];
    if (!file.type.includes("image")) {
      // not an image
      console.log("not an image");
      this.fileInput.current.value = "";
      this.setState({
        imageValid: true
      });
    } else {
      const fileReader = new FileReader();
      fileReader.onload = read => {
        const img = new Image();
        img.onload = () => {
          if (img.width <= 500 && img.height <= 500) {
            this.setState({
              imageValid: true
            });
          } else {
            this.setState({
              imageValid: false
            });
          }
        };
        img.src = read.target.result;
      };
      fileReader.readAsDataURL(file);
    }
  };

  onSubmit = () => {
    const formData = new FormData();
    formData.append("userId", this.props.match.params.id);
    this.state.nickName && formData.append("nickName", this.state.nickName);
    this.state.firstName && formData.append("firstName", this.state.firstName);
    this.state.lastName && formData.append("lastName", this.state.lastName);
    this.state.imageValid &&
      formData.append("photo", this.fileInput.current.files[0]);
    axios
      .post("http://localhost:9000/editprofile", formData)
      .then(response => {
        // console.log(response.data);
        // this.setState({
        //   nickName: response.data.nickName ? response.data.nickName : "",
        //   firstName: response.data.firstName ? response.data.firstName : "",
        //   lastName: response.data.lastName ? response.data.lastName : ""
        // });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <Message header="Account preferences" attached />
        <Form className="attached fluid segment">
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
          <Form.Field>
            <label>Profile picture (max 500x500)</label>
            <input
              type="file"
              ref={this.fileInput}
              // name="nickName"
              onChange={this.onProfileUpload}
              // value={this.state.nickName}
            />
          </Form.Field>

          <Button disabled={!this.state.imageValid} onClick={this.onSubmit}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default Login;
