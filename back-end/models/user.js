const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
  nickName: String,
  firstName: String,
  lastName: String,
  photo: String,
  rating: Array,
  duoRating: Array,
  matches: Array,
  duoMatches: Array,
  setsWon: 0,
  setsLost: 0,
  perfectSets: 0,
  duoSetsWon: 0,
  duoSetsLost: 0,
  duoPerfectSets: 0,
  peakRating: Object,
  peakDuoRating: Object,
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
