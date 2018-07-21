import _ from "lodash";
import axios from "axios";
import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default class DuoRankings extends Component {
  state = {
    column: null,
    data: null,
    direction: null
  };
  componentDidMount = () => {
    axios
      .get("http://localhost:9000/users")
      .then(response => {
        this.setState({
          data: response.data.map(item => {
            const newItem = item;
            newItem.mu = item.duoRating[0].mu;
            newItem.sigma = item.duoRating[0].sigma;
            return newItem;
          })
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
    const { column, data, direction } = this.state;

    return (
      <React.Fragment>
        {data && (
          <Table sortable celled fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  sorted={column === "username" ? direction : null}
                  onClick={this.handleSort("username")}
                >
                  Username
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === "mu" ? direction : null}
                  onClick={this.handleSort("mu")}
                >
                  Duo rating
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === "sigma" ? direction : null}
                  onClick={this.handleSort("sigma")}
                >
                  Duo rating confidence
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {_.map(data, ({ mu, sigma, username, _id }) => (
                <Table.Row key={_id}>
                  <Table.Cell>
                    <Link to={`/user/${_id}`}>{username}</Link>
                  </Table.Cell>
                  <Table.Cell>{mu}</Table.Cell>
                  <Table.Cell>{sigma}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </React.Fragment>
    );
  }
}
