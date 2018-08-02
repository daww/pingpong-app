import _ from "lodash";
import axios from "axios";
import React, { Component } from "react";
import { Table } from "semantic-ui-react";

export default class MatchDetail extends Component {
  state = {
    column: null,
    user: null,
    direction: null
  };
  componentDidMount = () => {
    axios
      .post("http://localhost:9000/match", {
        matchId: this.props.match.params.id
      })
      .then(response => {
        this.setState({
          match: response.data
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
    const { column, match, direction } = this.state;

    return (
      <React.Fragment>
        <ul>
          {match &&
            Object.keys(match).map(item => (
              <li>
                {item} - {JSON.stringify(match[item])}
              </li>
            ))}
        </ul>
      </React.Fragment>
    );
  }
}
