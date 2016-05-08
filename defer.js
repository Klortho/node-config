// Create a deferredConfig prototype so that we can check for it when reviewing the configs later.
function DeferredConfig () {
}
DeferredConfig.prototype.toString = function() { return 'DeferredConfig'; }

// log is a function that logs messages. It's also a singleton object
var argsArray = function(args) {
  return Array.prototype.slice.call(args);
};
var log = function() {
  var args = argsArray(arguments);
  args.unshift('  '.repeat(log.indent));
  console.log.apply(console, args);
  if (log.exitAfter > 0 && ++log.count >= log.exitAfter) process.exit();
};
log.count = 0;
log.exitAfter = -1;
log.indent = 0;
log.enter = function() {
  var args = argsArray(arguments);
  args.push('{');
  log.apply(null, args);
  log.indent++;
}
log.exit = function() {
  "use strict";
  log.indent--;
  log('}')
}

DeferredConfig.log = log;

// Accept a function that we'll use to resolve this value later and return a 'deferred' 
// configuration value to resolve it later.
function deferConfig (func) {
  log('deferConfig: creating a new deferred')
  var obj = Object.create(DeferredConfig.prototype);
  obj.resolve = func;
  return obj;
}

module.exports.deferConfig = deferConfig;
module.exports.DeferredConfig = DeferredConfig;
