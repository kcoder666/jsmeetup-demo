/**
 * Module dependencies.
 */
var fs = require('fs');
var express = require('express');
var http = require('http');
var request = require('request');
var redis = require('redis');

var redisClient = redis.createClient();
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
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
   * - The following code has 46 lines.
   * - Deepest nesting level is 4.
   * - Handle errors in 4 places.
   */
  // Check if feed is stored in Redis
  redisClient.get('feed', function(err, data) {
    // Handle error #1
    if (err) return res.send(500, err);
    
    if (data) {
      // Serve feed
      console.log('Served from Redis cache');
      res.send(data);
    } else {
      // Check if feed is stored as feed.xml
      fs.exists(FEED_FILE, function (exists) {
        if (exists) {
          fs.readFile(FEED_FILE, function (err, data) {
            // Handle error #2
            if (err) return res.send(500, err);
        
            // Store content into Redis
            redisClient.set('feed', data, function (err) {
              // Handle error #3
              if (err) return res.send(500, err);
              
              // Serve feed
              console.log('Served from file');
              res.send(data);
            });
          });
        } else {
          // File not exist. Download the feed from the Internet.
          request.get(FEED_URL, function (err, response) {
            var data = response.body;
    
            // Store content info file
            fs.writeFile(FEED_FILE, data, function(err) {
              // Handle error #4
              if (err) return res.send(500, err);
      
              // Serve feed
              console.log('Served from the Internet');
              res.send(data);
            });
          });
        }
      });
    }
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Server CALLBACK listening on port ' + app.get('port'));
});
