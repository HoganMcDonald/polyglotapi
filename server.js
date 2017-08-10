require('dotenv').config({path:'./.env'});

//requires
const express = require('express'),
  app = express(),
  request = require('request'),
  bodyParser = require('body-parser');

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
  console.log('in get info');
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
      res.send(results);
    }
  });

});
