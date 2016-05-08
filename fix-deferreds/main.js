#!/usr/bin/env node
'use strict';
var util = require('util');

// helper function to display an object
function pretty(obj) {
  return util.inspect(obj, {showHidden: false, depth: null});
}

var config = require('config');
console.log('config: ', pretty(config));
