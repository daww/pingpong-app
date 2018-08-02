import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

import PrivateRoute from "./PrivateRoute";
import MainRouter from "./MainRouter";
import Menu from "./Menu";
import axios from "axios";
import { Container, Grid } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

class App extends React.Component {
  state = {
    username: "",
    password: "",
    isAuthenticated: false
  };

  componentDidMount = () => {
    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "jwtToken"
    );
    const userName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("jwtToken");

    if (token) {
      axios
        .get("http://localhost:9000/users")
        .then(response => {
          // console.log(response);

          this.setState({
            userData: response.data
          });
        })
        .catch(err => {
          console.log(err);
        });
    }

    this.setState({
      isAuthenticated: token ? token : null,
      username: userName ? userName : null,
      userId: userId ? userId : null
    });
  };

  onLogout = () => {
    this.setState({
      isAuthenticated: false
    });
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");

    window.location = "/";
  };

  onLoginClick = () => {
    axios
      .post("http://localhost:9000/login", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        localStorage.setItem("jwtToken", response.data.token);
        localStorage.setItem("userName", this.state.username);
        localStorage.setItem("userId", response.data.userId);
        const loginRes = response.data;
        axios
          .get("http://localhost:9000/users")
          .then(response => {
            // console.log(response);

            this.setState({
              userData: response.data,
              isAuthenticated: true,
              userId: loginRes.userId
            });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(error => {
        console.log(error);
      });
  };

  onRegisterClick = () => {
    axios
      .post("http://localhost:9000/register", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        window.location = "/";
      })
      .catch(error => {
        console.log(error);
      });
  };

  onFormItemChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <Router>
        <Container>
          <Grid stretched={true} centered={true} columns={2}>
            <Grid.Column width={"four"}>
              <Menu
                activeItem={"bla"}
                isAuthenticated={this.state.isAuthenticated}
                onLogout={this.onLogout}
                userName={this.state.username}
                userId={this.state.userId}
              />
            </Grid.Column>
            <Grid.Column width={"twelve"} stretched={true}>
              <Route
                path="/register"
                render={props => (
                  <Register
                    username={this.state.username}
                    password={this.state.password}
                    onRegisterClick={this.onRegisterClick}
                    onFormItemChange={this.onFormItemChange}
                    {...props}
                  />
                )}
              />
              <Route
                path="/login"
                render={props => (
                  <Login
                    username={this.state.username}
                    password={this.state.password}
                    onLoginClick={this.onLoginClick}
                    isAuthenticated={this.state.isAuthenticated}
                    onFormItemChange={this.onFormItemChange}
                    {...props}
                  />
                )}
              />
              <PrivateRoute
                path="/"
                isAuthenticated={this.state.isAuthenticated}
                userId={this.state.userId}
                userName={this.state.username}
                userData={this.state.userData}
                component={MainRouter}
              />
            </Grid.Column>
          </Grid>
        </Container>
      </Router>
    );
  }
}

export default App;
