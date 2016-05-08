// log is a function that logs messages, and has a simple indent (.enter()) and unindent (.exit())
// feature.
// Usage:
//   var log = require('./log.js')();
//   log.exitAfter = 100;
//   log.enabled = false;

var count = 0,
    indent = 0;

var log = function() {
  if (log.enabled) {
    var args = argsArray(arguments);
    args.unshift('  '.repeat(indent));
    console.log.apply(console, args);
    if (log.exitAfter > 0 && ++log.count >= log.exitAfter) process.exit();
  }
};

log.enter = function() {
  if (log.enabled) {
    var args = argsArray(arguments);
    args.push('{');
    log.apply(null, args);
    indent++;
  }
};
log.exit = function() {
  if (log.enabled) {
    indent--;
    log('}')
  }
};

log.exitAfter = -1;   // set this to cause this to abort after a fixed number of messages
log.enabled = false;


// Function that turns the `arguments` variable into an Array
var argsArray = function(_arguments) {
  return Array.prototype.slice.call(_arguments);
};

module.exports = log;
