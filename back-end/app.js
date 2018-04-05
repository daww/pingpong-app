const express = require('express')
const fs = require('fs')
const cors = require('cors')
const EloRating = require('elo-rating')
const app = express()

const rankingsUrl = './rankings.json';
const gamesUrl = './games.json';


var playerData, games;
setPlayerData();
setGameData();

function setPlayerData() {
    fs.readFile(rankingsUrl, (err, data) => {
        playerData = JSON.parse(data);
    });
}

function setGameData() {
    fs.readFile(gamesUrl, (err, data) => {
        games = JSON.parse(data);
    });
}

function updateRankings(playerOneId, playerTwoId, playerOneSets, playerTwoSets) {
    let playerOne = playerData[playerOneId];
    let playerTwo = playerData[playerTwoId];

    console.log(`New game added: ${playerOne.name} vs ${playerTwo.name}`);
    console.log(`Old rating: ${playerOne.rating} vs ${playerTwo.rating}`);
    let result = {
        'opponentRating': playerTwo.rating,
        'playerRating': playerOne.rating
    };
    for (var i = 0; i < Math.abs(parseInt(playerOneSets, 10) - parseInt(playerTwoSets, 10)); i++) {
        result = EloRating.calculate (result.playerRating, result.opponentRating);
    }

    console.log(`New game added: ${result.playerRating} vs ${result.opponentRating}`);
    console.log('--------------------------');

    playerOne.rating = result.playerRating;
    playerTwo.rating = result.opponentRating;

    playerOne.wins = parseInt(playerOne.wins, 10) + parseInt(playerOneSets, 10);
    playerOne.losses = parseInt(playerOne.losses, 10) + parseInt(playerTwoSets, 10);

    playerTwo.wins = parseInt(playerTwo.wins, 10) + parseInt(playerTwoSets, 10);
    playerTwo.losses = parseInt(playerTwo.losses, 10) + parseInt(playerOneSets, 10);

    // check if this score is their highest
    if (playerOne.rating > playerOne.peakRating) {
        playerOne.peakRating = playerOne.rating
    }

    // too lazy to make a conversion script
    if (!playerOne.matches) {
        playerOne.matches = [];
    }

    if (!playerTwo.matches) {
        playerTwo.matches = [];
    }

    playerOne.matches.push({
        "date": Date.now(),
        "opponent": playerTwoId,
        "score": {
            "self": playerOneSets,
            "opponent": playerTwoSets
        },
        "ranking": {
            "self": result.playerRating,
            "opponent": result.opponentRating
        }
    });

    playerTwo.matches.push({
        "date": Date.now(),
        "opponent": playerOneId,
        "score": {
            "self": playerTwoSets,
            "opponent": playerOneSets
        },
        "ranking": {
            "self": result.opponentRating,
            "opponent": result.playerRating
        }
    });


    games.unshift({
        "date": Date.now(),
        "winner": playerOne,
        "loser": playerTwo,
        "score": {
            "winner": playerOneSets,
            "loser": playerTwoSets
        }
    });

    save(rankingsUrl, playerData);
    save(gamesUrl, games);
    return getRankings();
}

function getRankings() {
    console.log('GET /rankings');
    return playerData;
}

function getGames() {
    console.log('GET /games');
    return games;
}

function save(file, data) {
    fs.writeFile(file, JSON.stringify(data), (err) => {
        if (err) {
            console.log('Error writing file', err);
        }
    });
}


app.use(express.json());
app.use(cors());
app.use(express.static('./../front-end/build'));

app.post('/addgame', (req, res) => res.send(
    updateRankings(req.body.playerOne, req.body.playerTwo, req.body.playerOneSets, req.body.playerTwoSets)
));

app.get('/rankings', (req, res) => res.send(
    getRankings()
));

app.get('/games', (req, res) => res.send(
    getGames()
));

app.listen(9000, () => console.log('Pingpong app listening on port 9000!'))