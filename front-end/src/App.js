import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from "./PrivateRoute";
import Menu from "./Menu";
import axios from "axios";
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
          <ul>
            <li>
              <Link to="/register">register Page</Link>
            </li>
            <li>
              <Link to="/protected">Protected Page</Link>
            </li>
          </ul>
          <Route path="/register" component={Register} />
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
            path="/protected"
            isAuthenticated={this.state.isAuthenticated}
            render={props => <Protected {...props} />}
          />
        </div>
      </Router>
    );
  }
}

const Register = () => <h3>Register</h3>;
const Protected = () => <h3>Protected</h3>;

export default App;
