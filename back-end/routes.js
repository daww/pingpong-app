const passport = require('passport');
const router = require('express').Router();
const trueSkill = require('com.izaakschroeder.trueskill').create();
const User = require('./models/user');
const Match = require('./models/match');

router.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

router.post('/register', (req, res, next) => {
  console.log('registering user');
  User.register(
    new User({
      username: req.body.username,
      rating: [trueSkill.createRating()],
    }),
    req.body.password,
    (err) => {
      if (err) {
        console.log('error while user register!', err);
        return next(err);
      }

      console.log('user registered!');

      res.redirect('/');
    },
  );
});

router.post('/editprofile', (req, res) => {
  User.findById(req.body.userId, (err, user) => {
    if (err) {
      return console.log('Could not retrieve user');
    }
    user.set({
      nickName: req.body.nickName,
      firstkName: req.body.firstName,
      lastName: req.body.lastName,
    });
    user.save((err, updatedUser) => {
      if (err) {
        return console.log('Error updating user');
      }
      console.log('Updated user');
      res.redirect('/');
    });
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/users', (req, res) => {
  User.find((err, results) => {
    if (err) {
      return console.log(err);
    }
    res.send(JSON.stringify(results));
  });
  // res.redirect('/');
});

/**
 * Register match
 * Required:
 *  - Player one Id
 *  - Player two Id
 *  - Games [
 *      {
 *          playerOneScore,
 *          playerTwoScore
 *      }
 *  ]
 */

router.post('/registermatch', async (req, res) => {
  if (!req.body.playerOneId || !req.body.playerTwoId || !req.body.games) {
    return console.log('Incomplete data for registering a match');
  }

  const playerOne = await User.findById(
    req.body.playerOneId,
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
    req.body.playerTwoId,
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
    req.body.games.forEach((game) => {
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
        ratingAfter: players[0][0].rating,
      },
      playerTwo: {
        id: playerTwo._id,
        ratingBefore: playerTwo.rating[0],
        ratingAfter: players[1][0].rating,
      },
      results: req.body.games,
    });

    newMatch.save((err, match) => {
      if (err) {
        console.log(err);
      }
      res.send(console.log('Game saved.'));
    });
  }
});

module.exports = router;
