import React from "react";
import { Form, Message, Button } from "semantic-ui-react";
import axios from "axios";

class NewMatch extends React.Component {
  state = {
    opponents: null,
    games: [{ playerOneScore: "", playerTwoScore: "" }]
  };
  componentDidMount = () => {
    axios
      .get("http://localhost:9000/users")
      .then(response => {
        this.setState({
          opponents: response.data
            .map(item => {
              const newItem = {
                key: item._id,
                value: item._id,
                text: item.username
              };
              return newItem;
            })
            .filter(item => {
              return item.key !== this.props.userId;
            })
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  onChange = e => {
    const index = parseInt(e.target.name.slice(0, 1), 10);
    const player = e.target.name.slice(1);
    const newGames = this.state.games;
    newGames[index][player] = e.target.value;

    if (
      newGames[newGames.length - 1].playerOneScore ||
      newGames[newGames.length - 1].playerTwoScore
    ) {
      newGames.push({
        playerOneScore: "",
        playerTwoScore: ""
      });
    } else if (
      newGames.length > 2 &&
      (!newGames[newGames.length - 2].playerOneScore &&
        !newGames[newGames.length - 2].playerTwoScore)
    ) {
      newGames.pop();
    }
    this.setState({
      games: newGames
    });
  };

  onOpponentChange = (e, data) => {
    this.setState({
      opponent: data.value
    });
  };

  onRegister = () => {
    const loggableGames = this.state.games.filter(game => {
      return game.playerOneScore && game.playerTwoScore;
    });

    if (loggableGames && this.state.opponent) {
      axios.post("http://localhost:9000/registermatch", {
        playerOneId: this.props.userId,
        playerTwoId: this.state.opponent,
        games: loggableGames
      });
    }
  };
  render() {
    return (
      <div>
        <Message attached header="Log new game" />
        {this.state.opponents && (
          <Form className="attached fluid segment">
            <Form.Group widths="equal">
              <Form.Input value="You" disabled />
              <Form.Select
                placeholder="Select Opponent"
                fluid
                search
                selection
                options={this.state.opponents}
                onChange={this.onOpponentChange}
              />
            </Form.Group>
            {this.state.games.map((game, index) => (
              <Form.Group widths="equal" key={index}>
                <Form.Input
                  type="number"
                  placeholder="0"
                  name={index + "playerOneScore"}
                  onChange={this.onChange}
                  value={game.playerOneScore}
                />

                <Form.Input
                  type="number"
                  placeholder="0"
                  name={index + "playerTwoScore"}
                  onChange={this.onChange}
                  value={game.playerTwoScore}
                />
              </Form.Group>
            ))}
            <Button onClick={this.onRegister}>Register</Button>
          </Form>
        )}
      </div>
    );
  }
}

export default NewMatch;
