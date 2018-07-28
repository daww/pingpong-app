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
import { Container } from "semantic-ui-react";
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
        this.setState({
          isAuthenticated: true,
          userId: response.data.userId
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
        <div>
          <Menu
            activeItem={"bla"}
            isAuthenticated={this.state.isAuthenticated}
            onLogout={this.onLogout}
            userName={this.state.username}
            userId={this.state.userId}
          />

          <Container>
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
              component={MainRouter}
            />
          </Container>
        </div>
      </Router>
    );
  }
}

const Protected = () => <h3>Protected</h3>;

export default App;
