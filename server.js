require('dotenv').config({path:'./.env'});

//requires
const express = require('express'),
  app = express(),
  request = require('request'),
  bodyParser = require('body-parser'),
gitColors = require('./colors.json');
//uses
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//spin server
app.listen(process.env.PORT, ()=> {
  console.log('up on port', process.env.PORT);
});

function getLanguages( repos ) {
  return repos;
}

function split( langObject ) {
  console.log(langObject);
  return langObject;
}

function getInfo( repos ) {
  let resObj = getLanguages(repos);
  // if ('chart.js condition') {
  //   resObj = await split(resObj);
  // }
  return resObj;
}


app.get('/:username', ( req, res ) => {
  const user = req.params.username;

  // http options
  const options = {
    url: 'https://api.github.com/users/' + user + '/repos',
    headers: {
      'Authorization': 'token ' + process.env.GITHUB_AUTH_TOKEN,
      'User-Agent': 'request'
    }
  }; // end http options

  request.get(options, (error, response, body) => {
    if (error) {
      res.status(500).send({message: 'something went wrong', error: error});
    } else {
      let results = getInfo(JSON.parse(body));
      /////////////////////////////////////////////////////////////
      let languages = {};
      let colors = [];
      for (var i = 0; i < results.length; i++) {

        // http options
        const options = {
          url: results[i].languages_url,
          headers: {
            'Authorization': 'token ' + process.env.GITHUB_AUTH_TOKEN,
            'User-Agent': 'request'
          }
        }; // end http options

        request.get(options, ( err, response1, bod ) => {
          if (err) {
            res.status(500).send({message: 'something went wrong', error: error});
          } else {
            let languageObj = JSON.parse(bod)
            for (var key in languageObj) {
              // console.log('key', key);
              // console.log(languageObj[key]);
              console.log(typeof languageObj[key]);
              if (languages.hasOwnProperty(key)) {
                console.log('<<<<<<<<<<<<',languages[key]);
                languages[key] += languageObj[key];
              } else {

                languages[key] = languageObj[key];
                  colors.push(gitColors[key].color);
              }
              console.log('>>>>>>>>>>>>>', languages, colors);
            }
          }
        });
      }
      setTimeout(function(){ res.send({languages, colors}); }, 500);
    }
  });
});
