const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Match = new Schema({
  date: String,
  loggedBy: String,
  playerOne: {
    id: String,
    ratingBefore: Object,
    ratingAfter: Object,
  },
  playerTwo: {
    id: String,
    ratingBefore: Object,
    ratingAfter: Object,
  },
  results: [
    {
      playerOneScore: Number,
      playerTwoScore: Number,
    },
  ],
});

module.exports = mongoose.model('Match', Match);
