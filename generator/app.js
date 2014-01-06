/**
 * Module dependencies.
 */
var fs = require('fs');
var express = require('express');
var http = require('http');
var request = require('request');
var redis = require('redis');

var coroutine = require('./coroutine');
var thunks = require('./thunks');

var redisClient = redis.createClient();
var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.use(express.logger('dev'));
app.use(app.router);

var FEED_URL = 'http://kenh14.vn/home.rss';
var FEED_FILE = 'feed.xml';

app.get('/feeds', function (req, res) {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Content-Type', 'text/xml');
  
  /**
   * - The following code has 29 lines. 
   * - There is no nesting block in the main code (inside the coroutine 
   *    generator).
   * - Catch all errors with the traditional try-catch block.
   */
  coroutine(function *() {
    try {
      // Check if feed is stored in Redis
      var data = yield thunks.redisGet(redisClient, 'feed');
      if (data) {
        console.log('Served from Redis cache');
        return res.send(data);
      }
      
      // Check if feed is stored as feed.xml
      var exists = yield thunks.fileExists(FEED_FILE);
      if (exists) {
        data = yield thunks.readFile(FEED_FILE);
        // Store content into Redis
        yield thunks.redisSet(redisClient, 'feed', data);
        console.log('Served from file');
        res.send(data);
      } else {
        // File not exists - Get from the Internet
        response = yield thunks.requestGet(FEED_URL);
        data = response.body;
        // Store content info file
        yield thunks.writeFile(FEED_FILE, data);
        console.log('Served from the Internet');
        res.send(data);
      }
    } catch (err) {
      return res.send(500, err);
    }
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Server CALLBACK listening on port ' + app.get('port'));
});