const express = require('express');
const passport = require('passport');
const cors = require('cors')
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/user');
const app = express();
const LocalStrategy = require('passport-local').Strategy;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://localhost/oingpong-dev', function (err) {
    if (err) {
        console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
    }
});

app.use('/', require('./routes'));


app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    console.log('App listening on port ', server.address().port);
});