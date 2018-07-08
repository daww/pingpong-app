const DuoMatch = require('../models/duomatch');
const User = require('../models/user');
const trueSkill = require('com.izaakschroeder.trueskill').create();

_saveMatchToUser = (userId, newRating, duoMatchId) => {
  User.findById(userId, (err, user) => {
    if (err) {
      console.log('Could not retrieve user');
      return null;
    }
    const userDuoRating = user.duoRating;
    userDuoRating.unshift(newRating);
    user.set({
      rating: userDuoRating.slice(0, 9),
      duoMatches: user.duoMatches.push(duoMatchId),
    });
    user.save((err) => {
      if (err) {
        console.log(`error saving ${user.username} match`);
      } else {
        console.log(`Saved match in ${user.username} profile`);
      }
    });
  });
};

const duoMatchController = {
  registerDuoMatch: async (teamOne, teamTwo, games) => {
    const generateTeamOneArr = async () => {
      const playerOne = await User.findById(
        teamOne.playerOneId,
        'username duoRating _id',
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
        teamOne.playerTwoId,
        'username duoRating _id',
        { lean: true },
        (err, user) => {
          if (err) {
            console.log('Could not retrieve user');
            return null;
          }
          return user;
        },
      );
      return [playerOne, playerTwo];
    };
    const generateTeamTwoArr = async () => {
      const playerOne = await User.findById(
        teamTwo.playerOneId,
        'username duoRating _id',
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
        teamTwo.playerTwoId,
        'username duoRating _id',
        { lean: true },
        (err, user) => {
          if (err) {
            console.log('Could not retrieve user');
            return null;
          }
          return user;
        },
      );
      return [playerOne, playerTwo];
    };

    const teamOneArr = await generateTeamOneArr();
    const teamTwoArr = await generateTeamTwoArr();

    if (teamOneArr && teamTwoArr) {
      // one player teams, get the newest rating
      const teams = [
        [teamOneArr[0].duoRating[0], teamOneArr[1].duoRating[0]],
        [teamTwoArr[0].duoRating[0], teamTwoArr[1].duoRating[0]],
      ];
      games.forEach((game) => {
        let newRating;
        if (game.teamOneScore > game.teamTwoScore) {
          newRating = trueSkill.update(teams, [1, 0]);
        } else if (game.teamTwoScore > game.teamOneScore) {
          newRating = trueSkill.update(teams, [0, 1]);
        }
        // Update the player's rating
        for (let i = 0; i < teams.length; ++i) {
          teams[i][0].duoRating = newRating[i][0];
          teams[i][1].duoRating = newRating[i][1];
        }
      });

      const newMatch = new DuoMatch({
        date: Date.now(),
        teamOne: {
          playerOne: {
            id: teamOneArr[0]._id,
            ratingBefore: teamOneArr[0].duoRating[0],
            ratingAfter: teams[0][0],
          },
          playerTwo: {
            id: teamOneArr[1]._id,
            ratingBefore: teamOneArr[1].duoRating[0],
            ratingAfter: teams[0][1],
          },
        },
        teamTwo: {
          playerOne: {
            id: teamTwoArr[0]._id,
            ratingBefore: teamTwoArr[0].duoRating[0],
            ratingAfter: teams[1][0],
          },
          playerTwo: {
            id: teamTwoArr[1]._id,
            ratingBefore: teamTwoArr[1].duoRating[0],
            ratingAfter: teams[1][1],
          },
        },
        results: games,
      });

      newMatch.save((err, match) => {
        if (err) {
          console.log(err);
        }
        const matchId = match._id;
        console.log('Duo game saved.');
        // res.send(console.log('Game saved.'));

        console.log(JSON.stringify(teams));

        _saveMatchToUser(teamOneArr[0]._id, teams[0][0].rating, matchId);
        _saveMatchToUser(teamOneArr[1]._id, teams[0][1].rating, matchId);
        _saveMatchToUser(teamTwoArr[0]._id, teams[1][0].rating, matchId);
        _saveMatchToUser(teamTwoArr[1]._id, teams[1][1].rating, matchId);
      });
    }
  },
};

module.exports = duoMatchController;
