var df = require('config/defer').deferConfig;
var path = require('path');

module.exports = {
  a1: 1,
  b1: 2,
  c1: df(cfg => cfg.a1),
  d1: df(cfg => cfg.a1 + cfg.b1),
  e1: df(cfg => cfg.a1 + cfg.b1 + cfg.c1 + cfg.d1),
  // This one references an item that (perhaps) is evaluated later
  f1: df(cfg => cfg.g1 + cfg.a1),
  g1: df(cfg => cfg.a1),

  // nested objects
  h1: { ha: 5,
        hb: df(cfg => cfg.a1 + cfg.e1), },

  // nested objects as the results of deferreds
  i0: df(cfg => ({
    ia: 1,
  })),

  // nested objects as the results of deferreds
  i1: df(cfg => ({
    ia: 1,
    ib: cfg.b1,
    ic: cfg.h1,
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
      faa: {
        faaa: df(cfg => cfg.a1),
      }
    },
    fb: {
      fba: [
        5,
        'blue',
        { fba3a: {
            fba3aa: df(cfg => cfg.c1),
            fba3ab: 'orange',
          },
        },
      ],
    },
  },
};
