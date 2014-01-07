module.exports = function (fn) {
  var gen = fn();

  function next(err, res) {
    var ret;
    
    if (err) {
      ret = gen.throw(err); // throw error into generator
    } else {
      ret = gen.next(res);  // resume the generator's code flow
    }
    if (ret.done) return;   // the generator's code flow ends
    
    // Generator yields a thunk as value. This is where we execute the thunk.
    ret.value(next);
  }
  
  next();
}