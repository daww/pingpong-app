const passport = require('passport');
const router = require('express').Router();
const userController = require('./controllers/user');
const matchController = require('./controllers/match');
const duoMatchController = require('./controllers/duomatch');
const User = require('./models/user');

router.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

router.post('/register', async (req, res, next) => {
  console.log('registering user');
  const user = await userController.register(req.body.username, req.body.password);
  res.send(user);
});

router.post('/editprofile', async (req, res) => {
  const updatedUser = await userController.register(req.body.userId, {
    nickName: req.body.nickName,
    firstkName: req.body.firstName,
    lastName: req.body.lastName,
  });
  res.send(updatedUser);
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

  const match = await matchController.registerMatch(
    req.body.playerOneId,
    req.body.playerTwoId,
    req.body.games,
  );
  res.send(match);
});

router.post('/registerduomatch', async (req, res) => {
  if (!req.body.teamOne || !req.body.teamTwo || !req.body.games) {
    return console.log('Incomplete data for registering a match');
  }

  const match = await duoMatchController.registerDuoMatch(
    req.body.teamOne,
    req.body.teamTwo,
    req.body.games,
  );
  res.send(match);
});

module.exports = router;
