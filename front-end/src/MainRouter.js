import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Rankings from "./pages/Rankings";
import DuoRankings from "./pages/DuoRankings";
import Matches from "./pages/Matches";
import UserDetail from "./pages/UserDetail";
import MatchDetail from "./pages/MatchDetail";
import Preferences from "./pages/Preferences";
import NewMatch from "./pages/NewMatch";

export default class MainRouter extends Component {
  render() {
    return (
      <Switch>
        <Route path="/newmatch" exact isAuthenticated={this.props.isAuthenticated} render={() => <NewMatch userId={this.props.userId} />} />
        <Route path="/rankings" exact isAuthenticated={this.props.isAuthenticated} component={Rankings} />
        <Route path="/duorankings" exact isAuthenticated={this.props.isAuthenticated} component={DuoRankings} />
        <Route
          path="/matches"
          exact
          isAuthenticated={this.props.isAuthenticated}
          render={() => <Matches userData={this.props.userData} />}
        />
        <Route path="/user/:id" isAuthenticated={this.props.isAuthenticated} component={UserDetail} />
        <Route path="/match/:id" isAuthenticated={this.props.isAuthenticated} component={MatchDetail} />
        <Route path="/preferences/:id" isAuthenticated={this.props.isAuthenticated} component={Preferences} />
      </Switch>
    );
  }
}
