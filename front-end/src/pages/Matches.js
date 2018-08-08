import _ from "lodash";
import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";

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
            item.results = this.getSetsResult(item.results);
            return newItem;
          }),
          columns: [
            {
              title: "playerOne",
              dataIndex: "playerOne",
              key: "playerOne"
            },
            {
              title: "playerTwo",
              dataIndex: "playerTwo",
              key: "playerTwo"
            },
            {
              title: "results",
              dataIndex: "results",
              key: "results"
            }
          ]
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
    const { columns, data } = this.state;

    return (
      <React.Fragment>
        {data && <Table columns={columns} dataSource={data} />}
      </React.Fragment>
    );
  }
}

export default Matches;
