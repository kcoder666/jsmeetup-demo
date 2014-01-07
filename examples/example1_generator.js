var co = require('./coroutine');

var thunkSleep = function(ms) {
  return function(done) {
    setTimeout(done, ms);
  };
};

co(function *() {
  for (var i = 1; i <= 10; i++) {
    yield thunkSleep(1000);
    console.log("Loop " + i);
  }
});