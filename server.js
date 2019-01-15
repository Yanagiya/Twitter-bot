var express = require('express');
var Twitter = require('twitter');
var CronJob = require('cron').CronJob;
var mysql = require('mysql');

var app = express();


var twitter = new Twitter({
  consumer_key: process.env['CONSUMER_KEY'],
  consumer_secret: process.env['CONSUMER_SECRET'],
  access_token_key: process.env['ACCESS_TOKEN_KEY'],
  access_token_secret: process.env['ACCESS_TOKEN_SECRET'],
})
{/*
var twitter = new Twitter({
  consumer_key: `iVEU35YVqtisldohqQil3AdDM`,
  consumer_secret: 'Na7wYGehx6MPZOIdQUXUCG7IPpXFDczYtUMd1yIBDZ7PGsICTq',
  access_token_key: '1079396527875928064-Y1Ie4IzhM2FXex0O0WnhKpig7yO6ly',
  access_token_secret: '8c1SVKAz01M5Dz6D4iMpIFkWUWIOnToVwUWHihbNTtWwE',
})
*/}

var cronTime = '0 * * * * *';
new CronJob({
  cronTime: cronTime,
  onTick: function() {
    cycleTweet()
  },
  start: true
})

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'test_user',
  password : 'password',
  database : 'test'
})
{/*}
var tipsArray = [
    "おはよう",
    "こんにちは",
    "こんばんは",
    "おやすみ",
    "また明日",
    "今日も素晴らしい一日だった",
    "明日はもっと素敵な一日になるだろう"
  ];
*/}
function cycleTweet() {
  connection.query('select tips from tips order by rand() limit 1', function(err,rows) {
    if(err) {
      return console.log(err);
    }else{
      tips = rows[0].tips;
      console.log(tips);
      twitter.post('statuses/update', {status: tips}, (err, tweet, response)=> {
        if(err) {
          return console.log(err);
        }else{
          return console.log(tweet);
        }
      })
    }
  })
}

  //HTTPリッスン
  app.set('port', (process.env.PORT || 5000));
  app.get('/', function(req, res) {
    res.send('Hello World with Azure')
  })
  app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
  })
