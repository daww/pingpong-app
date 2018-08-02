import _ from "lodash";
import axios from "axios";
import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import { Link } from "react-router-dom";

class Matches extends Component {
  state = {
    column: null,
    data: null,
    direction: null
  };
  componentDidMount = () => {
    axios
      .get("http://localhost:9000/matches")
      .then(response => {
        this.setState({
          data: response.data.map(item => {
            const newItem = item;
            item.playerOneName = this.props.userData.find(
              user => user._id === item.playerOne.id
            ).username;
            item.playerTwoName = this.props.userData.find(
              user => user._id === item.playerTwo.id
            ).username;
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

  getSetsResult = input => {
    let playerOneScore = 0;
    let playerTwoScore = 0;

    input.forEach(item => {
      if (item.playerOneScore > item.playerTwoScore) {
        playerOneScore += 1;
      } else {
        playerTwoScore += 1;
      }
    });
    return `${playerOneScore} - ${playerTwoScore}`;
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
                  sorted={column === "playerOneName" ? direction : null}
                  onClick={this.handleSort("playerOneName")}
                >
                  Player One
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === "playerTwoName" ? direction : null}
                  onClick={this.handleSort("playerTwoName")}
                >
                  Player Two
                </Table.HeaderCell>
                <Table.HeaderCell>Sets</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {_.map(
                data,
                ({
                  _id,
                  playerOneName,
                  playerOne,
                  playerTwoName,
                  playerTwo,
                  results
                }) => (
                  <Table.Row key={_id}>
                    <Table.Cell>{playerOneName}</Table.Cell>
                    <Table.Cell>{playerTwoName}</Table.Cell>
                    <Table.Cell>
                      <Link to={`/match/${_id}`}>
                        {this.getSetsResult(results)}
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                )
              )}
            </Table.Body>
          </Table>
        )}
      </React.Fragment>
    );
  }
}

export default Matches;
