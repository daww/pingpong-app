const passport = require('passport');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const userController = require('./controllers/user');
const matchController = require('./controllers/match');
const duoMatchController = require('./controllers/duomatch');
const User = require('./models/user');
const Match = require('./models/match');

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

// configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    /*
      Files will be saved in the 'uploads' directory. Make
      sure this directory already exists!
    */

    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    /*
      uuidv4() will generate a random ID that we'll use for the
      new filename. We use path.extname() to get
      the extension from the original file name and add that to the new
      generated ID. These combined will create the file name used
      to save the file on the server and will be available as
      req.file.pathname in the router handler.
    */

    const newFilename = file.originalname;
    cb(null, newFilename);
  },
});

const upload = multer({ storage });

// router.get('/', (req, res) => {
//   res.render('index', { user: req.user });
// });

router.post('/register', async (req, res, next) => {
  console.log('registering user');
  const user = await userController.register(req.body.username, req.body.password);
  res.send(user);
});

router.post('/editprofile', upload.single('photo'), async (req, res) => {
  const token = getToken(req.headers);

  if (token) {
    const updatedUser = await userController.editProfile(req.body.userId, {
      nickName: req.body.nickName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      photo: req.file.path ? req.file.path : null,
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

router.get('/matches', async (req, res) => {
  const token = getToken(req.headers);

  if (token) {
    const matches = await matchController.getAllMatches();
    res.send(JSON.stringify(matches));
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

router.post('/match', (req, res) => {
  const token = getToken(req.headers);

  if (token) {
    Match.findById(req.body.matchId, (err, results) => {
      if (err) {
        return console.log(err);
      }
      return res.send(JSON.stringify(results));
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

module.exports = router;
