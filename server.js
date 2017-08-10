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

//http request to github
function getRepos( username ) {
  // http options
  const options = {
    url: 'https://api.github.com/users/' + username + '/repos',
    headers: {
      'Authorization': 'token ' + process.env.GITHUB_AUTH_TOKEN,
      'User-Agent': 'request'
    }
  }; // end http options

  request.get(options, (error, response, body) => {
    if (error) {
      return error;
    } else {
      return JSON.parse(body);
    }
  });

} // end get repos

function getLanguages( repos ) {
  console.log(repos);
  return repos;
}

function split( langObject ) {
  console.log(langObject);
  return langObject;
}

async function getInfo( username ) {
  let repos = await getRepos(username);
  let resObj = await getLanguages(repos);
  return
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
      res.send(JSON.parse(body));
    }
  });



});
