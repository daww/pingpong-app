const trueSkill = require('com.izaakschroeder.trueskill').create();
const User = require('../models/user');

const userController = {
  register: (username, password) => {
    User.register(
      new User({
        username,
        rating: [trueSkill.createRating()],
        duoRating: [trueSkill.createRating()],
      }),
      password,
      (err) => {
        if (err) {
          console.log('error while user register!', err);
          return false;
        }

        console.log(`${username} registered!`);
        return true;
      },
    );
  },

  editProfile: (userId, userData) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return console.log('Could not retrieve user');
      }
      user.set({
        ...userData,
      });
      user.save((err, updatedUser) => {
        if (err) {
          console.log('Error updating user');
          return false;
        }
        console.log('Updated user');
        return true;
      });
    });
  },
};

module.exports = userController;
