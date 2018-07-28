const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DuoMatch = new Schema({
  date: String,
  loggedBy: String,
  teamOne: {
    playerOne: {
      id: String,
      duoRankingBefore: String,
      duoRankingAfter: String,
    },
    playerTwo: {
      id: String,
      duoRankingBefore: String,
      duoRankingAfter: String,
    },
  },
  teamTwo: {
    playerOne: {
      id: String,
      duoRankingBefore: String,
      duoRankingAfter: String,
    },
    playerTwo: {
      id: String,
      duoRankingBefore: String,
      duoRankingAfter: String,
    },
  },
  results: [
    {
      teamOneScore: Number,
      teamTwoScore: Number,
    },
  ],
});

module.exports = mongoose.model('DuoMatch', DuoMatch);
