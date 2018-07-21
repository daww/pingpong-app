const passport = require('passport');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const userController = require('./controllers/user');
const matchController = require('./controllers/match');
const duoMatchController = require('./controllers/duomatch');
const User = require('./models/user');

const getToken = (headers) => {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    }
    return null;
  }
  return null;
};

// router.get('/', (req, res) => {
//   res.render('index', { user: req.user });
// });

router.post('/register', async (req, res, next) => {
  console.log('registering user');
  const user = await userController.register(req.body.username, req.body.password);
  res.send(user);
});

router.post('/editprofile', async (req, res) => {
  const token = getToken(req.headers);

  if (token) {
    const updatedUser = await userController.editProfile(req.body.userId, {
      nickName: req.body.nickName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    res.send(updatedUser);
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  const token = JSON.stringify(jwt.sign(req.body.username, 'poepchinees'));
  // return the information including token as JSON
  res.json({ success: true, token: `JWT ${token}`, userId: req.user._id });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/users', (req, res) => {
  const token = getToken(req.headers);

  if (token) {
    User.find((err, results) => {
      if (err) {
        return console.log(err);
      }
      res.send(JSON.stringify(results));
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

router.post('/user', (req, res) => {
  const token = getToken(req.headers);

  if (token) {
    User.findById(req.body.userId, (err, results) => {
      if (err) {
        return console.log(err);
      }
      res.send(JSON.stringify(results));
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
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
  const token = getToken(req.headers);

  if (token) {
    if (!req.body.playerOneId || !req.body.playerTwoId || !req.body.games) {
      return console.log('Incomplete data for registering a match');
    }

    const match = await matchController.registerMatch(
      req.body.playerOneId,
      req.body.playerTwoId,
      req.body.games,
    );
    res.send(match);
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

router.post('/registerduomatch', async (req, res) => {
  const token = getToken(req.headers);

  if (token) {
    if (!req.body.teamOne || !req.body.teamTwo || !req.body.games) {
      return console.log('Incomplete data for registering a match');
    }

    const match = await duoMatchController.registerDuoMatch(
      req.body.teamOne,
      req.body.teamTwo,
      req.body.games,
    );
    res.send(match);
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

module.exports = router;
