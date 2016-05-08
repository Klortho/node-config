var defer = require('config/defer').deferConfig;
var path = require('path');

module.exports = {
  a: 1,
  b: defer(cfg => cfg.a),
  c: defer(cfg => [ cfg.d, cfg.e.e0]),
  d: defer(cfg => ({ d0: 0, d1: 1, })),
  e: defer(cfg => ({ 
    e0: defer(cfg => [
      'hello',
      cfg => cfg.b,
    ]),
  })),

  /*
  b: defer(cfg => cfg.d + cfg.e + cfg.f),    //=> 4
  d: 1,
  e: defer(cfg => cfg.d),                    //=> 1
  f: defer(cfg => cfg.d + cfg.e),            //=> 2
*/
/*
  obj1: {
    a: {
      b: defer(cfg => cfg.obj1.d.x + cfg.e + cfg.obj1.g.f.x),  //=> 2 + 1 + 4 = 7
    },
    d: defer(cfg => ({
      x: defer(cfg => cfg.f),        //=> 2
    })),
    g: {
      f: defer(cfg => ({
        x: defer(cfg => cfg.b),      //=> 4
      })),
    }
  }
*/
};
