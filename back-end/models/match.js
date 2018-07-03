const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Match = new Schema({
  date: String,
  playerOne: {
    id: String,
    rankingBefore: String,
    rankingAfter: String,
  },
  playerTwo: {
    id: String,
    rankingBefore: String,
    rankingAfter: String,
  },
  results: [
    {
      playerOneScore: Number,
      playerTwoScore: Number,
    },
  ],
});

module.exports = mongoose.model('Match', Match);
