var express = require('express');
var Twitter = require('twitter');
var CronJob = require('cron').CronJob;

var app = express();

var twitter = new Twitter({
  consumer_key: process.env[`CONSUMER_KEY`],
  consumer_secret: process.env['CONSUMER_SECRET'],
  access_token_key: process.env['ACCESS_TOKEN_KEY'],
  access_token_secret: process.env['ACCESS_TOKEN_SECRET'],
})

var cronTime = '0 * * * * *';
new CronJob({
  cronTime: cronTime,
  onTick: function() {
    cycleTweet()
  },
  start: true
})

var tipsArray = ["おはよう","こんにちは","こんばんは","おやすみ","また明日","今日も素晴らしい一日だった","明日はもっと素敵な一日になるだろう"];

function cycleTweet() {
  var tips = tipsArray[Math.floor(Math.random() * tipsArray.length)];

  //自動投稿
  twitter.post('statuses/update', {status: tips}, (err, tweet, response)=> {
    if(err) {
      return console.log(err);
    }else{
      return console.log(tweet);
    }
  })

  //HTTPリッスン
  app.set('port', (process.env.PORT || 5000));
  app.get('/', function(req, res) {
    res.send('Hello World with Azure')
  })
  app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
  })
}