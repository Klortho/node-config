var df = require('config/defer').deferConfig;
var path = require('path');

module.exports = {
  // From issue #231
  images: {
    src: 'foobar',
  },
  srcSvgGlob: [
    '/plyr/src/sprite/*.svg',
    df(function (cfg) {
      return cfg.images.src + '/*.svg';
    })
  ],

  a1: 1,
  c1: df(cfg => cfg.a1),
  d1: df(cfg => cfg.a1 + cfg.a1),
  e1: df(cfg => cfg.a1 + cfg.c1 + cfg.d1),
  // This one references an item that (perhaps) is evaluated later
  f1: df(cfg => cfg.g1 + cfg.a1),
  g1: df(cfg => cfg.a1),

  // deferreds in descendants
  h1: { ha: 5,
        hb: df(cfg => cfg.a1 + cfg.e1), },
  h2: {
    a: {
      a: [
        7, 'fleegle',
        df(cfg => cfg.a1 + cfg.e1),
      ],
    },
  },

  // deferreds that resolve to trees
  i0: df(cfg => ({
    a: { a: 21, b: 9, },
    b: [ 9, 'snorky', df(cfg => cfg.a1)]
  })),
  // and referencing those nested items
  i2: df(cfg => ({
    z: 5,
    a: { a: cfg.i0.b[1], b: cfg.i0.b[2], },
    b: [ -2, cfg.i0.b, ],
    c: df((cfg) => cfg.i2.b[1][1]),   //=> 'snorky'; references a sibling in the same subtree
  })),

  // deferreds within deferreds
  i1: df(cfg => ({
    ic: cfg.h1,  // .h1 has a deferred in it
    id: df(cfg => df(cfg => cfg.h1)),
  })),

  a2: 1,
  b2: df(cfg => cfg.a2),
  c2: df(cfg => [
    cfg.d2,
    cfg.e2.e0,
  ]),
  d2: df(cfg => ({
    d0: 0,
    d1: 1,
  })),
  e2: df(cfg => ({
    e0: df(cfg => [
      'hello',
      cfg.b2,
    ]),
  })),
  f2: {
    fa: {
      a: {
        a: df(cfg => cfg.a1),
      }
    },
    fb: {
      a: [
        5,
        'blue',
        { a: {
            a: df(cfg => cfg.c1),
            b: 'orange',
          },
        },
      ],
    },
  },
};
