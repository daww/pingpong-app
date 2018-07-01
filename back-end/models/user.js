const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    nickName: String,
    firstkName: String,
    lastName: String,
    photo: [],
    ranking: [],
    duoRanking : [],
    matches: [],
    duoMatches: []

});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);