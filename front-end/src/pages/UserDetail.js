import _ from "lodash";
import axios from "axios";
import React, { Component } from "react";

export default class UserDetail extends Component {
  state = {
    column: null,
    user: null,
    direction: null
  };
  componentDidMount = () => {
    axios
      .post("http://localhost:9000/user", {
        userId: this.props.match.params.id
      })
      .then(response => {
        this.setState({
          user: response.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: "ascending"
      });

      return;
    }

    this.setState({
      data: data.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending"
    });
  };
  render() {
    const { column, user, direction } = this.state;

    return (
      <React.Fragment>
        <ul>
          {user &&
            Object.keys(user).map(item => (
              <li>
                {item} - {JSON.stringify(user[item])}
              </li>
            ))}
        </ul>
      </React.Fragment>
    );
  }
}
