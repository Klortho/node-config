'use strict';
var assert = require('assert');

// Create a deferredConfig prototype so that we can check for it when reviewing the configs later.
function DeferredConfig () {}

// Users use this function in their JavaScript config files to specify config values that depend
// on others. This returns a DeferredConfig object.
function deferConfig(func) {
  var obj = Object.create(DeferredConfig.prototype);
  obj.resolve = func;
  return obj;
}

// Resolves all of the configuration variables, after all of the overrides have been established.
var resolve = function(mainConfig) {
  var mainResolver = null;

  /**
   *  Wraps a configuration item in a Resolver object, if needed.
   *
   * @private
   * @method wrap
   * @param node - atom, object, deferred, or resolver
   * @return either an atom or a resolver
   */

  var wrap = function(node) {
    var t = nodeType(node);
    return (t === 'atom') ? node :
      (t === 'resolver') ? node :
        (t === 'deferred') ? wrap(node.resolve.call(mainResolver, mainResolver)) :
          new Resolver(node);
  };



  // Objects of this class define getters for each of the properties of the config object.
  // The constructor does not recurse; it only defines getters for the immediate children
  // of the current config.
  var Resolver = function(config) {
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
          if (key in values) return values[key];
          var node = config[key];



          var rv = wrap(node);
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

  // The resolver is concerned with the data types of the nodes of the configuration tree. From its
  // perspective, there are four: atoms, objects (which include arrays), DeferredConfigs
  // deferreds, for short), and Resolvers.

  // This revised type test is to address one concern in this PR:
  // https://github.com/lorenwest/node-config/pull/205. It should be construed as implying
  // that that PR is a good idea, but this should do no harm.
  var isDeferred = function(node) { return node instanceof DeferredConfig ||
    ( node && (typeof node === 'object') && ('constructor' in node) &&
    (node.constructor.name === 'DeferredConfig') ); };

  var nodeType = function(node) {
    if (node instanceof Resolver) {
      return 'resolver';
    }
    if (typeof node !== 'object' || !node) return 'atom';
    if (node instanceof Date) return 'atom';
    if (node instanceof DeferredConfig ||
      (('constructor' in node) && (node.constructor.name === 'DeferredConfig')))
      return 'deferred';
    return 'object';
  };


  // Create resolver for the first level; includes first-level getters.
  mainResolver = new Resolver(mainConfig, null);
  // Walking the whole tree causes all of the config objects to be updated
  mainResolver.walk();




};


module.exports = {
  deferConfig: deferConfig,
  DeferredConfig: DeferredConfig,
  resolve: resolve,
};

