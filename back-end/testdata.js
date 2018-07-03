const request = require('request');

// test data
const USER_DATA = [
  {
    username: 'John',
    password: 'password',
  },
  {
    username: 'Jane',
    password: 'password',
  },
  {
    username: 'Harry',
    password: 'password',
  },
  {
    username: 'Peter',
    password: 'password',
  },
  {
    username: 'Flora',
    password: 'password',
  },
];

callback = (error, response, body) => {
  if (!error) {
    console.log('User added.');
  } else {
    console.log(`Error happened: ${error}`);
  }
};

// USER_DATA.forEach((item, index) => {
//   request(
//     {
//       method: 'POST',
//       url: 'http://localhost:3000/register',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       json: USER_DATA[index],
//     },
//     callback,
//   );
// });

request('http://localhost:3000/users', { json: true }, (err, res, body) => {
  if (err) {
    return console.log(err);
  }
  const ids = body.map(user => user._id);

  request(
    {
      method: 'POST',
      url: 'http://localhost:3000/registermatch',
      headers: {
        'Content-Type': 'application/json',
      },
      json: {
        playerOneId: ids[0],
        playerTwoId: ids[3],
        games: [
          {
            playerOneScore: 11,
            playerTwoScore: 6,
          },
        ],
      },
    },
    callback,
  );
});

// @TODO get users and do some test matches
