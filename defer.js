// Create a deferredConfig prototype so that we can check for it when reviewing the configs later.
function DeferredConfig () {
}

// Accept a function that we'll use to resolve this value later and return a 'deferred' 
// configuration value to resolve it later.
function deferConfig (func) {
  console.log('deferConfig: creating a new deferred')
  var obj = Object.create(DeferredConfig.prototype);
  obj.resolve = func;
  return obj;
}

module.exports.deferConfig = deferConfig;
module.exports.DeferredConfig = DeferredConfig;
