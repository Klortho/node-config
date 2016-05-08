

// Create a deferredConfig prototype so that we can check for it when reviewing the configs later.
function DeferredConfig () {}

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
var Resolver = function(mainResolver, config) {
  var self = this;
  if (!mainResolver) mainResolver = self;
  // The enumerable keys of config that we care about
  var childKeys = Object.keys(config).filter(function(k) {
    return config.hasOwnProperty(k) && typeof config[k] !== 'undefined';
  });
  // The memoized results of the getters
  var values = {};

  // Define these as properties. It's important that these be non-enumerable.
  [ ['main', mainResolver],
    ['config', config],
    ['childKeys', childKeys],
  ].map(function(pair) {
    Object.defineProperty(self, pair[0], {
      __proto__: null,
      value: pair[1],
    });
  });

  // Make the getters
  childKeys.forEach(function(key) {
    Object.defineProperty(self, key, {
      __proto__: null,
      enumerable: true,
      configurable: false,
      get: function() {
        var rv;  // resolved value
        if (key in values) rv = values[key];  // return memoized result
        else {
          var configValue = config[key];

          // FIXME: use the feature-test as described on one of the gh issues
          var isDeferred = function(val) { return val instanceof DeferredConfig; };
          while(isDeferred(configValue)) {
            configValue = configValue.resolve.call(mainResolver, mainResolver);
          }

          // FIXME: need to make sure we're taking care of all possible types here; harmonize it
          // with the walk method
          // Resolvers and atomic types - store them
          if (configValue instanceof Resolver) {
            rv = configValue;
          }
          else if (!(configValue instanceof Object)) {
            // Resolved leaf nodes get put back into the original config
            rv = config[key] = configValue;
          }
          else {
            rv = new Resolver(mainResolver, configValue);
          }
        }
        values[key] = rv;
        return rv;
      }
    });
  });
};
Resolver.prototype.walk = function() {
  var self = this,
      config = self.config;

  self.childKeys.forEach(function(key) {
    var v = self[key];
    // Note: I checked these tests against extendDeep; to make sure it covers at least the same
    // cases
    if (v) {
      if (v instanceof Date) {
        config[key] = v;
      }
      else if (v instanceof Resolver) {
        v.walk();
        config[key] = v.config;
      }
      else if ((typeof v === 'object') && ('constructor' in v) && (
        v.constructor == Object || v.constructor == Array)) {
        self.walkObject(v);
      }
      else if (v instanceof DeferredConfig) {
        throw EvalError('Dangling deferred!');
      }
      else {
        config[key] = v;
      }
    }
  });
};

// FIXME: Don't we need this?
Resolver.prototype.walkObject = function(obj) {
};

// This function does the resolving
var resolveMain = function(mainConfig) {
  // Create resolver for the first level; includes first-level getters.
  var mainResolver = new Resolver(null, mainConfig, null);
  // Walking the whole tree causes all of the config objects to be updated
  mainResolver.walk();
};

module.exports = {
  deferConfig: deferConfig,
  DeferredConfig: DeferredConfig,
  resolveMain: resolveMain
};

