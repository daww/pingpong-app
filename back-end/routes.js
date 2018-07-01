const passport = require('passport');
const User = require('./models/user');
const router = require('express').Router();

router.get('/', function (req, res) {
    res.render('index', { user: req.user });
});

// client side youring
// router.get('/register', function (req, res) {
//     res.render('register', {});
// });

router.post('/register', function (req, res, next) {
    console.log('registering user');
    User.register(new User({ username: req.body.username }), req.body.password, function (err) {
        if (err) {
            console.log('error while user register!', err);
            return next(err);
        }

        console.log('user registered!');

        res.redirect('/');
    });
});

router.post('/editprofile', function(req,res) {
    User.findById(req.body.userId, function(err, user) {
        if (err) {
          return console.log("Could not retrieve user");
        }
        user.set({
            nickName: req.body.nickName,
            firstkName: req.body.firstName,
            lastName: req.body.lastName,
        });
        user.save(function(err, updatedUser) {
            if (err) {
                return console.log("Error updating user");
            }
            console.log('Updated user');
            res.redirect('/');
        });
    })
});
// client side rendering
// router.get('/login', function (req, res) {
//     res.render('login', { user: req.user });
// });

router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


router.get('/users', function (req, res) {
    User.find((err, results) => {
        if (err) {return console.log(err)};
        console.log(results);
    });
});

module.exports = router;