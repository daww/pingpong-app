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
import Rankings from "./pages/Rankings";
import DuoRankings from "./pages/DuoRankings";
import PrivateRoute from "./PrivateRoute";
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
  };

  onLoginClick = () => {
    axios
      .post("http://localhost:9000/login", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        this.setState({
          isAuthenticated: true
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
              path="/rankings"
              isAuthenticated={this.state.isAuthenticated}
              component={Rankings}
            />
            <PrivateRoute
              path="/duorankings"
              isAuthenticated={this.state.isAuthenticated}
              component={DuoRankings}
            />
          </Container>
        </div>
      </Router>
    );
  }
}

const Protected = () => <h3>Protected</h3>;

export default App;
