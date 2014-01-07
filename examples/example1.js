// Are you expecting the output will be:
// Loop 1
// Loop 2
// ...
// Loop 10
// ? Unfortunately it is NOT.
for (var i = 1; i <= 10; i++) {
  setTimeout(function() {
    console.log("Loop " + i);
  }, 1000);
}