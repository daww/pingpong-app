import React from "react";
import { Grid, Dropdown, GridRow } from "semantic-ui-react";
import { Input, Button } from "semantic-ui-react";
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
        <h3>Log game</h3>
        {this.state.opponents && (
          <React.Fragment>
            <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column>You</Grid.Column>
                <Grid.Column>
                  <Dropdown
                    placeholder="Select Opponent"
                    fluid
                    search
                    selection
                    options={this.state.opponents}
                    onChange={this.onOpponentChange}
                  />
                </Grid.Column>
              </Grid.Row>
              {this.state.games.map((game, index) => (
                <Grid.Row key={index}>
                  <Grid.Column>
                    <Input
                      type="number"
                      placeholder="0"
                      name={index + "playerOneScore"}
                      onChange={this.onChange}
                      value={game.playerOneScore}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Input
                      type="number"
                      placeholder="0"
                      name={index + "playerTwoScore"}
                      onChange={this.onChange}
                      value={game.playerTwoScore}
                    />
                  </Grid.Column>
                </Grid.Row>
              ))}
            </Grid>
            <Button onClick={this.onRegister}>Register</Button>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default NewMatch;
