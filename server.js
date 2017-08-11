require('dotenv').config({path:'./.env'});

//requires
const express = require('express'),
  app = express(),
  as = require('async'),
  request = require('request'),
  rpn = require('request-promise-native'),
  bodyParser = require('body-parser');

//uses
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//spin server
app.listen(process.env.PORT, ()=> {
  console.log('up on port', process.env.PORT);
});

app.get('/:username', ( req, res ) => {

  const user = req.params.username;
  let languages = {};

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
              }

            }
            console.log('counter', counter);
            if (counter === repoArr.length - 1) {
              console.log(languages);
              res.send(languages)
            }

          });

        }
    })

}); // end app.get







/*

// get a users repos
request.get(options, (error, response, body) => {
  if (error) {
    res.status(500).send({message: 'something went wrong', error: error});
  } else {
    let results = JSON.parse(body);

    return async.forEach(results, (repo, callback) => {
      // http options
      const options = {
        url: repo.languages_url,
        headers: {
          'Authorization': 'token ' + process.env.GITHUB_AUTH_TOKEN,
          'User-Agent': 'request'
        }
      }; // end http options

      request.get(options, ( err, response1, bod ) => {
        if (err) {
          res.status(500).send({message: 'something went wrong', error: error});
        } else {
          let languageObj = JSON.parse(bod);
          for (var key in languageObj) {
            if (languages.hasOwnProperty(key)) {
              languages[key] += languageObj[key];
            } else {
              languages[key] = languageObj[key];
            }
          }
        } // end check for error getting languages
      }); // end get languages_url
    }, (err) => {
      console.log('done');
      res.send(languages);
    }); // end async.forEach results
  } // end check for errors getting repos
}); // end get repos

*/
