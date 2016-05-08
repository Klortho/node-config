var log = require('./log.js');
var util = require('util');

// helper function to display an object
function pretty(obj) {
  return util.inspect(obj, {showHidden: false, depth: null});
}

// Create a deferredConfig prototype so that we can check for it when reviewing the configs later.
function DeferredConfig () {}
DeferredConfig.prototype.toString = function() { return 'DeferredConfig'; };

// Accept a function that we'll use to resolve this value later and return a 'deferred'
// configuration value to resolve it later.
function deferConfig(func) {
  var obj = Object.create(DeferredConfig.prototype);
  obj.resolve = func;
  return obj;
}

// Objects of this class define getters for each of the properties of the config object.
// The constructor does not recurse; it only defines getters for the immediate children
// of the current config.
var Resolver = function(mainResolver, config, selfKey, parent) {
  var self = this;
  if (!mainResolver) {
    mainResolver = self;
    selfKey = '';
    parent = null;
  }

  // The enumerable keys of config that we care about
  var childKeys = Object.keys(config).filter(function(k) {
    return config.hasOwnProperty(k) && typeof config[k] !== 'undefined';
  });
  // The memoized results of the getters
  var values = {};
  // This node's expanded key
  var key = (parent && parent.key ? parent.key + '.' : '') + selfKey;

  // Define some properties. It's important that these be non-enumerable. Most aren't needed but
  // are handy for bookkeeping / debugging.
  [ ['main', mainResolver],
    ['parent', parent],
    ['config', config],
    ['key', key],
    ['childKeys', childKeys],
    ['values', values],
  ].map(function(pair) {
    Object.defineProperty(self, pair[0], {
      __proto__: null,
      value: pair[1],
    });
  });
  log.enter('new Resolver<' + key + '>');


  // Make the getters first, without resolving anything
  childKeys.forEach(function(key) {
    log('Creating a getter for key ' + key);
    // Here's the getter.
    Object.defineProperty(self, key, {
      __proto__: null,
      enumerable: true,
      configurable: false,
      get: function() {
        // Inside the getter function is where the resolution happens
        log.enter('getter for key ' + key);
        var rv;  // resolved value
        // memoized, only resolve once
        if (key in values) rv = values[key];
        else {
          var configValue = config[key];
          log('No cache hit, value is ' + configValue);

          // FIXME: use the feature-test as described on one of the gh issues
          var isDeferred = function(val) { return val instanceof DeferredConfig; };
          while(isDeferred(configValue)) {
            log('Got a deferred; let\'s call it');
            configValue = configValue.resolve.call(mainResolver, mainResolver);
            log('Value from the deferred is ' + configValue);
          }

          // FIXME: need to make sure we're taking care of all possible types here
          // Resolvers and atomic types - store them
          // !!! I don't think we should ever get a resolver here
          if (configValue instanceof Resolver) {
            log('This is ' + configValue + ', store it')
            rv = configValue;
          }
          else if (!(configValue instanceof Object)) {
            // Resolved leaf nodes get stuck back into the original config
            log('Atomic type: ' + configValue + ', stick it into config')
            rv = config[key] = configValue;
          }
          else {
            log('Looks like an object: ' + JSON.stringify(configValue));
            rv = new Resolver(mainResolver, configValue, key, self);
          }
        }
        log('getter returning ' + rv);
        values[key] = rv;
        log.exit();
        return rv;
      },
    });
  });
  log.exit();
};
Resolver.prototype.toString = function() {
  return 'Resolver <' + this.key + '>';
};
Resolver.prototype.walk = function() {
  var self = this,
      config = self.config;

  log.enter('Walking ' + self.key);
  self.childKeys.forEach(function(key) {
    var v = self[key];

    // Note: I checked these tests to make sure I covered at least all of
    // the cases covered by extendDeep
    if (v) {
      if (v instanceof Date) {
        config[key] = v;
      }
      else if (v instanceof Resolver) {
        v.walk();
        self.config[key] = v.config;
      }
      else if ((typeof v === 'object') && ('constructor' in v) && (
        v.constructor == Object || v.constructor == Array)) {
        self.walkObject(v);
      }
      else if (v instanceof DeferredConfig) {
        throw EvalError('Dangling deferred!');
      }
    }
  });
  log.exit();
};

// FIXME: Don't we need this?
Resolver.prototype.walkObject = function(obj) {

}

// The "main" function that does the resolving
var resolveMain = function(mainConfig) {
  // Create resolver for the first level; includes first-level getters.
  var mainResolver = new Resolver(null, mainConfig, null);
  // Walking the whole tree causes all of the config objects to be updated
  mainResolver.walk();
  log('Done, mainConfig: ' + pretty(mainConfig));
}

/*
var deepCopy = function(parent) {
  log.enter('deepCopy, parent: ' + parent);
  var result;
  if (typeof parent !== 'object') {
    result = parent;
  }
  else {
    result = {};
    Object.keys(parent).forEach(function (key) {
      log.enter('copying key ' + key);
      result[key] = deepCopy(parent[key]);
      log.exit();
    });
  }
  log.exit();
  return result;
}
*/

module.exports = {
  deferConfig: deferConfig,
  DeferredConfig: DeferredConfig,
  resolveMain: resolveMain,
};

