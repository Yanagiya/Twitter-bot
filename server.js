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

// MySQL in Appデータベース接続詞
var connectionString = process.env.MYSQLCONNSTR_localdb;
var host = /Data Source=([0-9\.]+)\:[0-9]+\;/g.exec(connectionString)[1];
var port = /Data Source=[0-9\.]+\:([0-9]+)\;/g.exec(connectionString)[1];
var database = /Database=([0-9a-zA-Z]+)\;/g.exec(connectionString)[1];
var username = /User Id=([a-zA-z0-9\s]+)\;/g.exec(connectionString)[1];
var password = /Password=(.*)/g.exec(connectionString)[1];
var exampleSql = "";

var connection = mysql.createConnection({
  host     : host,
  port     : port,
  user     : username,
  password : password,
  database : database,
  debug    : true
});

// ランダムにつぶやく関数
function cycleTweet() {

  //tipsテーブルからランダムにとってくるselect文
  connection.query('select tips from tips order by rand() limit 1', function(err, rows) {
    if(err) {
      return console.log(err)
    }else{
      tips = rows[0].tips
      console.log(tips)
      // 自動投稿
      twitter.post('statuses/update', {status: tips}, (err, tweet, response)=> {
        if(err) {
          return console.log(err)
        }else{
          return console.log(tweet)
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
