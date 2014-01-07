function *generator() {
  yield 'Hello';
  yield 'a';
  yield 'new';
  yield 'world';
  yield 'of';
  return 'node.js';  // `return` also yields value
}

function executor() {
  var gen = generator();
  var ret = gen.next();  // next() returns an object 
                         // { value: ..., done: true/false }
  
  while (true) {
    console.log(ret.value);
    if (ret.done) break;
    ret = gen.next();
  }
}

executor();