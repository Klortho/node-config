#!/usr/bin/env node
'use strict';
var util = require('util');
var assert = require('assert');

// helper function to display an object
function pretty(obj) {
  return util.inspect(obj, {showHidden: false, depth: null});
}

var config = require('config');
//console.log('config: ', pretty(config));

var expected =  {
  images: { src: 'foobar' },
  srcSvgGlob: [ '/plyr/src/sprite/*.svg', 'foobar/*.svg' ],
  a1: 1,
  c1: 1,
  d1: 2,
  e1: 4,
  f1: 2,
  g1: 1,
  h1: { ha: 5, hb: 5 },
  h2: { a: { a: [ 7, 'fleegle', 5 ] } },
  i0: { a: { a: 21, b: 9 }, b: [ 9, 'snorky', 1 ] },
  i2:
  { z: 5,
    a: { a: 'snorky', b: 1 },
    b: [ -2, [ 9, 'snorky', 1 ] ],
    c: 'snorky' },
  i1: { ic: { ha: 5, hb: 5 }, id: { ha: 5, hb: 5 } },
  a2: 1,
  b2: 1,
  c2: [ { d0: 0, d1: 1 }, [ 'hello', 1 ] ],
  d2: { d0: 0, d1: 1 },
  e2: { e0: [ 'hello', 1 ] },
  f2:
  { fa: { a: { a: 1 } },
    fb: { a: [ 5, 'blue', { a: { a: 1, b: 'orange' } } ] } } };


assert.deepEqual(expected, config);
console.log('ok');
