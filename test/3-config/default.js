
var defer = require('../../defer').deferConfig;

var config = {
  siteTitle : 'Site title',
  latitude  : 1,
  longitude : 2,

};

// Set up a default value which refers to another value.
// The resolution of the value is deferred until all the config files have been loaded
// So that if 'config.siteTitle' is overridden, this will point to the correct value.
config.welcomeEmail = {
  subject :  defer(function (cfg) {
    return "Welcome to "+cfg.siteTitle;
  }),
  // A plain function should be not disturbed.
  aFunc  : function () {
    return "Still just a function.";
  },

  // Look ma, no arg passing. The main config object is bound to 'this'
  justThis: defer(function () {
    return "Welcome to this "+this.siteTitle;
  }),
};

config.map = {
  centerPoint : defer(function () {
    return { lat: this.latitude, lon: this.longitude };
  }),
};

// "stress test" of the deferred function. Some of this data is here, and some in local.js.
var stressConfig = {
  // From issue #231
  images: {
    src: 'happy-gardens',
  },
  srcSvgGlob: [
    '/plyr/src/sprite/*.svg',
    defer(function (cfg) {
      return cfg.images.src + '/*.svg';
    })
  ],

  // For a1 - h2: see local.js

  // deferreds that resolve to trees
  i0: defer(cfg => ({
    a: { a: 21, b: 9, },
    b: [ 9, 'snorky', defer(cfg => cfg.a1)]
  })),

  // deferreds within deferreds
  i1: defer(cfg => ({
    ic: cfg.h1,  // .h1 has a deferred in it
    id: defer(cfg => defer(cfg => cfg.h1)),
  })),

  // referencing nested items
  i2: defer(cfg => ({
    z: 5,
    a: { a: cfg.i0.b[1], b: cfg.i0.b[2], },
    b: [ -2, cfg.i0.b, ],
    c: defer((cfg) => cfg.i2.b[1][1]),   //=> 'snorky'; references a sibling in the same subtree
  })),

  // For a2 - e2: see local.js

  // Some more deeply nested deferreds
  f2: {
    fa: {
      a: {
        a: defer(cfg => cfg.a1),
      }
    },
    fb: {
      a: [
        5,
        'blue',
        { a: {
          a: defer(cfg => cfg.c1),
          b: 'orange',
        },
        },
      ],
    },
  },
};

Object.keys(stressConfig).forEach(function(key) {
  config[key] = stressConfig[key];
});


module.exports = config;
