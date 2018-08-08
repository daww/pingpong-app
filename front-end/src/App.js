import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
  Switch
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

import PrivateRoute from "./PrivateRoute";
import MainRouter from "./MainRouter";
import Menu from "./Menu";
import axios from "axios";
import { Layout } from "antd";
import "antd/dist/antd.css";
const { Header, Content, Sider } = Layout;

class App extends React.Component {
  state = {
    username: "",
    password: "",
    isAuthenticated: false,
    collapsed: false
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

  onCollapse = collapsed => {
    // console.log(collapsed);
    this.setState({ collapsed });
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
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <Menu
              activeItem={"bla"}
              isAuthenticated={this.state.isAuthenticated}
              onLogout={this.onLogout}
              userName={this.state.username}
              userId={this.state.userId}
            />
          </Sider>
          <Layout>
            <Header style={{ background: "#fff", padding: 0 }} />
            <Content style={{ margin: "0 16px" }}>
              <Switch>
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
                {this.state.isAuthenticated && (
                  <PrivateRoute
                    path="/"
                    isAuthenticated={this.state.isAuthenticated}
                    userId={this.state.userId}
                    userName={this.state.username}
                    userData={this.state.userData}
                    component={MainRouter}
                  />
                )}
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default App;
