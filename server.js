require('dotenv').config({
  path: './.env'
});

//requires
const express = require('express'),
  app = express(),
  as = require('async'),
  request = require('request'),
  rpn = require('request-promise-native'),
  bodyParser = require('body-parser'),
  gitColors = require('./colors.json');
//uses
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//spin server
app.listen(process.env.PORT, () => {
  console.log('up on port', process.env.PORT);
});


app.get('/:username', (req, res) => {

  const user = req.params.username;
  let languages = {};
  let colors = {};

  // http options
  const options = {
    url: 'https://api.github.com/users/' + user + '/repos',
    headers: {
      'Authorization': 'token ' + process.env.GITHUB_AUTH_TOKEN,
      'User-Agent': 'request'
    }
  }; // end http options

  rpn(options)
    .then(repos => {
      let repoArr = JSON.parse(repos);
      let counter = 0;

      for (let i = 0; i < repoArr.length; i++) {

        const options = {
          url: repoArr[i].languages_url,
          headers: {
            'Authorization': 'token ' + process.env.GITHUB_AUTH_TOKEN,
            'User-Agent': 'request'
          }
        }; // end http options

        request.get(options, (error, response, body) => {
          let languageObj = JSON.parse(body);
          counter++;
          for (var key in languageObj) {
            if (languages.hasOwnProperty(key)) {
              languages[key] += languageObj[key];
            } else {
              languages[key] = languageObj[key];
              colors[key] = gitColors[key].color;
              // colors.push( gitColors[key].color );
            }

          }
          console.log('counter', counter);
          if (counter === repoArr.length - 1) {
            console.log(languages);
            res.send({
              languages,
              colors
            })
          }
        });
      }
    })
}); // end app.get
