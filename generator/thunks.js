/** Thunk - "a parameterless closure created to prevent the evaluation of an
 *  expression until forced at a later time"
 */
var fs = require('fs');
var request = require('request');

exports.redisGet = function(client, key) {
  return function(done) {
    client.get(key, done);
  };
};

exports.redisSet = function(client, key, data) {
  return function(done) {
    client.set(key, data, done);
  };
};

exports.fileExists = function(filePath) {
  return function(done) {
    fs.exists(filePath, function(exists) { done(null, exists); });
  };
};

exports.readFile = function(filePath) {
  return function(done) {
    fs.readFile(filePath, done);
  };
};

exports.writeFile = function(filePath, data) {
  return function(done) {
    fs.writeFile(filePath, data, done);
  };
};

exports.requestGet = function(url) {
  return function(done) {
    request.get(url, done);
  };
};
