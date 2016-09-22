'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');
var client = require('../db')


module.exports = function makeRouterWithSockets (io) {




  // a reusable function
  function respondWithAllTweets (req, res, next){
    //var allTheTweets = tweetBank.list();
    client.query('SELECT * FROM tweets JOIN users ON tweets.userId = users.id', function (err, result) {
      if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
    });

    // res.render('index', {
    //   title: 'Twitter.js',
    //   tweets: allTheTweets,
    //   showForm: true
    // });
  }

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
   router.get('/users/:username', function(req, res, next){
    var uname = req.params.username;
    client.query('SELECT *  FROM tweets JOIN users ON tweets.userId = users.id WHERE users.name = $1', [uname], function (err, result) {
      if (err) return next(err); // pass errors to Express
      var tweetsWithThatName = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweetsWithThatName, showForm: true, username: req.params.username});
    });
  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
      var uid = req.params.id;
    client.query('SELECT *  FROM tweets JOIN users ON tweets.userId = users.id WHERE id = $1', [uid], function (err, result) {
      if (err) return next(err); // pass errors to Express
      var tweetsWithThatId = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweetsWithThatId, showForm: true });
    });

  });

  // create a new tweet
  router.post('/tweets', function(req, res, next){
    var username = client.query("SELECT id FROM users WHERE name = $1",[req.body.name],function(err, result){
      if (err) return next(err);
      console.log("query result: ", result);
      return result.rows;
     });
    // console.log("username: ", username);
    // console.log("rows: ", username.rows);
    // console.log("type: ", typeof username.rows);
    if(username.rows == undefined){
        console.log("hrere");
          client.query('INSERT INTO Users (name , pictureUrl) VALUES ($1, $2)',[req.body.name, 'http://lorempixel.com/48/48?name='+req.body.name], function (err, result) {
          if (err) return next(err); // pass errors to Express
          //var newTweet = result.rows;
          //io.sockets.emit('new_tweet', newTweet);
          //res.redirect('/');
          //res.render('index', { title: 'Twitter.js', tweets: tweetsWithThatId, showForm: true });
        });
    }
    client.query('INSERT INTO Tweets (userId, content) VALUES ((SELECT id from Users where name=$1),   $2)',[req.body.name, req.body.content], function (err, result) {
      if (err) return next(err); // pass errors to Express
      var newTweet = result.rows;
      io.sockets.emit('new_tweet', newTweet);
      res.redirect('/');
      //res.render('index', { title: 'Twitter.js', tweets: tweetsWithThatId, showForm: true });
    });
    var newTweet = tweetBank.add(req.body.name, req.body.content);



  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  });

  return router;
};
