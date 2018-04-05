import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import axios from 'axios';

// Custom components
import Overview from './components/overview/Overview';
import RecentGames from './components/recentgames/RecentGames';
import AppTitle from './components/apptitle/AppTitle';
import LogGame from './components/loggame/LogGame';
import PlayerView from './components/playerview/PlayerView';

// Header includes
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import Card, { CardContent } from 'material-ui/Card';




const styles = (theme) => ({
    toolbar : {
        display: 'flex',
        justifyContent: 'space-between'
    },
    bottomNavigation: {
        position: 'fixed',
        bottom: 0,
        width: '100%'
    },
    spacer: {
        maxWidth: theme.spacing.unit * 100,
        margin: theme.spacing.unit * 1 + 'px auto ' + theme.spacing.unit * 7 + 'px auto'
    },
    app: {
        fontFamily: 'Roboto',
        backgroundColor: theme.palette.grey['50'],
        minHeight: 'calc(100vh - '+theme.spacing.unit * 7+'px)' //56px, height of BottomNavigation
    }
});

class App extends Component {
    state = {
        open: false,
        activeTab: 0,
        playerOne: '',
        playerTwo: ''
    }

    handleOpen = () => {
        this.setState({open: true});
    }

    handleSubmit = () => {
        let winner, loser;
        if (!this.state.playerOne || !this.state.playerOneSets || !this.state.playerTwo || !this.state.playerTwoSets) {
            console.log('not all fields are valid');
            return;
        }

        let winnerIsPlayerOne;
        if (parseInt(this.state.playerOneSets, 10) > parseInt(this.state.playerTwoSets, 10)) {
            winner = this.state.playerOne;
            loser = this.state.playerTwo;
            winnerIsPlayerOne = true;
        } else if (parseInt(this.state.playerOneSets, 10) < parseInt(this.state.playerTwoSets, 10)) {
            winner = this.state.playerTwo;
            loser = this.state.playerOne;
            winnerIsPlayerOne = false;
        } else {
            return;
        }


        axios.post('http://'+window.location.hostname +':9000/addgame', {
            "playerOne": winner,
            "playerTwo": loser,
            "playerOneSets": winnerIsPlayerOne ? this.state.playerOneSets : this.state.playerTwoSets,
            "playerTwoSets": winnerIsPlayerOne ? this.state.playerTwoSets : this.state.playerOneSets
        })
        .then(res => {
            this.handlePlayerUpdate(res.data);
            this.setState({
                open: false,
                playerOne: '',
                playerTwo: ''
            })


            axios.get('http://'+window.location.hostname +':9000/games')
            .then(res => {
                this.setState(
                    {recentGames: res.data});
            })
        })
    }

    handlePlayerUpdate = (newPlayers) => {
        function handle(newPlayers, handleBy) {
            let result = Object.keys(newPlayers).map((key) => {
                newPlayers[key].key = key
                return newPlayers[key]
            }).sort((a , b) => {
                if (a[handleBy] < b[handleBy]) {
                    return 1;
                } else if (a[handleBy] > b[handleBy]) {
                    return -1;
                } else {
                    return 0;
                }
            });

            return result;
        }
        const playersByName = handle(newPlayers, 'name');
        const playersByRating = handle(newPlayers, 'rating');

        this.setState({
            playersByName,
            playersByRating
        })
    }

    handleBackButtonClick = () => {
        this.setState({
            activeTab: 0,
            selectedPlayer: null
        });
    }

    handleClose = () => {
        this.setState({open: false});
    }

    handleChange = (event, index, value) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleTabChange = (event, value) => {
        this.setState({ activeTab:value });
    }

    handlePlayerClick = (event) => {
        this.setState({
            activeTab: 2,
            selectedPlayer: event
        });
    }


    componentDidMount = () => {
        axios.get('http://'+window.location.hostname +':9000/rankings')
        .then(res => {
            this.handlePlayerUpdate(res.data);
        })

        axios.get('http://'+window.location.hostname +':9000/games')
        .then(res => {
            this.setState(
                {recentGames: res.data});
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.app}>
                <AppBar position="static" color="default">
                    <Toolbar className={classes.toolbar}>
                        {this.state.selectedPlayer ?
                            <IconButton onClick={this.handleBackButtonClick}>
                                <Icon>
                                    arrow_back
                                </Icon>
                            </IconButton>
                        : null}
                        <AppTitle />
                        <Button onClick={this.handleOpen} variant="raised" color="primary">Log new game</Button>
                    </Toolbar>
                </AppBar>

                <Card elevation={1} className={classes.spacer}>
                    <CardContent>
                    <LogGame
                        open={this.state.open}
                        playerOne={this.state.playerOne}
                        playerOneSets={this.state.playerOneSets}
                        playerTwo={this.state.playerTwo}
                        playerTwoSets={this.state.playerTwoSets}
                        playersByName={this.state.playersByName}
                        onClose={this.handleClose}
                        onChange={this.handleChange}
                        onSubmit={this.handleSubmit}
                        />


                    {this.state.activeTab === 0 && this.state.playersByRating ?
                        <Overview
                            onPlayerClick={this.handlePlayerClick}
                            players={this.state.playersByRating}
                            /> :
                            null
                        }

                    {this.state.activeTab === 1 && this.state.recentGames ?
                        <RecentGames games={this.state.recentGames} /> :
                            null
                        }

                    {this.state.activeTab === 2 && this.state.selectedPlayer ?
                        <PlayerView player={this.state.selectedPlayer} /> :
                            null
                        }
                    </CardContent>
                </Card>

                <BottomNavigation className={classes.bottomNavigation} showLabels={true} value={this.state.activeTab} onChange={this.handleTabChange}>
                  <BottomNavigationAction label="Ranking" />
                  <BottomNavigationAction label="Recent games" />
                </BottomNavigation>

            </div>
        );
    }
}

export default withStyles(styles)(App);
