import _ from "lodash";
import axios from "axios";
import React, { Component } from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";

export default class Rankings extends Component {
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
            newItem.mu = item.rating[0].mu;
            newItem.sigma = item.rating[0].sigma;
            return newItem;
          }),
          columns: [
            {
              title: "username",
              dataIndex: "username",
              key: "username",
              render: (text, record) => (
                <Link to={`/user/${record._id}`}>{text}</Link>
              )
            },
            {
              title: "mu",
              dataIndex: "mu",
              key: "mu"
            },
            {
              title: "sigma",
              dataIndex: "sigma",
              key: "sigma"
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
  render() {
    const { columns, data } = this.state;

    return (
      <React.Fragment>
        {data && <Table columns={columns} dataSource={data} />}
      </React.Fragment>
    );
  }
}
