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
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
