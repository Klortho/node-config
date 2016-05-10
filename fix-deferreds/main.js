#!/usr/bin/env node
var assert = require('assert');
var defer = require('config/defer'),
    λ = defer.deferConfig,
    resolve = defer.resolve;
const util = require('util');

function main() {

  var a0 = { a: 0 };
  test([
    ['cfg', a0]
  ]);

  var a1 = {
    a: λ(c => a2)
  };
  var a2 = { a: 1 };
  test([
    ['cfg', a1],
    ['cfg.a', a2]
  ]);

  var Class = function() {};
  Class.prototype.split = function() { return 'fleegle'; };
  var inst = new Class();
  var b0 = {
    a: inst,
    b: λ(() => inst),
    d: λ(c => c.a),
    e: λ(c => c.b),
    f: λ(c => c.e),
  };
  test([
    ['cfg', b0],
    ['inst', inst]
  ]);

  inst.a = 'beans';
  inst.b = { a: 'rice' };
  var func = function() { return { a: 5, b: 6 }; };
  func.a = 20;
  inst.f = func;

  var c0 = {
    a: inst,
    b: λ(c => λ(c => c.a)),
    d: λ(() => λ(c => {
      console.log('~~~~ c.b.f is ', c.b.f);
      return {
        'expect-rice': c.b.b.a,
        'expect-inst': c.b,
        //'should-be-fleegle': c.b.split(),  no, resolvers don't proxy methods
        'expect-obj': c.b.f(),
      };
    })),
  };
  test([
    ['cfg', c0],
    ['inst', inst]
  ]);
}


var a0 = {a: 1};

function test(data) {
  console.log('==============================================');
  data.forEach(function(pair) {
    pp(pair[1], pair[0]);
  });
  var obj = data[0][1];
  resolve(obj);
  console.log('---------------------------------------------');
  pp(obj);
}

function inspect(depth, options) {
  var self = this;
  self._uid = self.__uid;
  delete self.inspect;
  return self;
}
function addInspect(obj) {
  obj.inspect = inspect;
  Object.keys(obj).forEach(function(key) {
    if (key !== '_uid' && key !== '__uid' && key !== 'inspect') {
      var kid = obj[key];
      if (kid && typeof kid === 'object') {
        addInspect(kid);
      }
    }
  });
}
function cleanUids(obj) {
  delete obj._uid;
  Object.keys(obj).forEach(function(key) {
    var kid = obj[key];
    if (kid && typeof kid === 'object') {
      delete kid._uid;
    }
  });
}

function pp(obj, label) {
  var lbl = (label ? label + ': ' : '');
  addInspect(obj);
  console.log(lbl +
    util.inspect(obj, {
      showHidden: false,
      depth: null,
      colors: true,
    }));
  cleanUids(obj);
}


// Helpers
// Only for testing purposes! This sets a unique id property __uid on Object.prototype
var nextId = 0;
Object.defineProperty(Object.prototype, '__uid', {
  // The prototype getter sets up a property on the instance. Because
  // the new instance-prop masks this one, we know this will only ever
  // be called at most once for any given object.
  get: function () {
    Object.defineProperty(this, '__uid', {
      value: nextId++,
      writable: false,
      enumerable: false,
    });
    return this.__uid;
  },
  enumerable: false,
});

main();


