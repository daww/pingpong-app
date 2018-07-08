const Match = require('../models/match');
const User = require('../models/user');
const trueSkill = require('com.izaakschroeder.trueskill').create();

const match = {
  registerMatch: async (playerOneId, playerTwoId, games) => {
    const playerOne = await User.findById(
      playerOneId,
      'username rating _id',
      { lean: true },
      (err, user) => {
        if (err) {
          console.log('Could not retrieve user');
          return null;
        }
        return user;
      },
    );

    const playerTwo = await User.findById(
      playerTwoId,
      'username rating _id',
      { lean: true },
      (err, user) => {
        if (err) {
          console.log('Could not retrieve user');
          return null;
        }
        return user;
      },
    );

    if (playerOne && playerTwo) {
      // one player teams, get the newest rating
      const players = [[playerOne.rating[0]], [playerTwo.rating[0]]];
      games.forEach((game) => {
        let newRating;
        if (game.playerOneScore > game.playerTwoScore) {
          newRating = trueSkill.update(players, [1, 0]);
        } else if (game.playerTwoScore > game.playerOneScore) {
          newRating = trueSkill.update(players, [0, 1]);
        }
        players[0][0].rating = newRating[0][0];
        players[1][0].rating = newRating[1][0];
      });

      const newMatch = new Match({
        date: Date.now(),
        playerOne: {
          id: playerOne._id,
          ratingBefore: playerOne.rating[0],
          ratingAfter: players[0][0],
        },
        playerTwo: {
          id: playerTwo._id,
          ratingBefore: playerTwo.rating[0],
          ratingAfter: players[1][0],
        },
        results: games,
      });

      newMatch.save((err, match) => {
        if (err) {
          console.log(err);
        }
        const matchId = match._id;
        // res.send(console.log('Game saved.'));
        console.log('Game saved.');

        // TODO find a way so that we do not have to get the user twice in order to save
        User.findById(playerOneId, (err, user) => {
          if (err) {
            console.log('Could not retrieve user');
            return null;
          }
          const userRating = user.rating;
          userRating.unshift(players[0][0].rating);
          user.set({
            rating: userRating.slice(0, 9),
            matches: user.matches.push(matchId),
          });
          user.save((err) => {
            if (err) {
              console.log(`error saving ${user.username} match`);
            } else {
              console.log(`Saved match in ${user.username} profile`);
            }
          });
        });

        // TODO find a way so that we do not have to get the user twice in order to save
        User.findById(playerTwoId, (err, user) => {
          if (err) {
            console.log('Could not retrieve user');
            return null;
          }

          const userRating = user.rating;
          userRating.unshift(players[1][0].rating);
          user.set({
            rating: userRating.slice(0, 9),
            matches: user.matches.push(matchId),
          });
          user.save((err) => {
            if (err) {
              console.log(`error saving ${user.username} match`);
            } else {
              console.log(`Saved match in ${user.username} profile`);
            }
          });
        });
      });
    }
  },
};

module.exports = match;
