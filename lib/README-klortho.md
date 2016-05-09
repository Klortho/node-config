# klortho's fork

This branch is an attempt to fix the problem with deferreds in node-config.
Right now I am working with a test project in the "fix-deferreds" subdirectory
here.

See my comments on 
[issue #266](https://github.com/lorenwest/node-config/issues/266#issuecomment-217063840),
which describes the algorithm in some detail. 

The code I have right now is mostly working, but has some issues.

The main issue is with how the Resolvers get disposed of at the end,
during the "deepCopy". Right now it is very naive about the type, and
doesn't, for example, handle Arrays at all well. 

Strategy: let's leverage this library's utilities. Each Resolver has a reference
to the original config that it is mirroring. Let's extend the original 
config objects, rather than replacing them.




## To do, misc

* Find and destroy "FIXME"s
* Convert the test project "fix-deferreds" into a proper set of tests.
* Look into using "relative" arguments to the deferreds.
* Check it against https://github.com/lorenwest/node-config/pull/175 -
  I'm concerned about how my implementation will behave inside extendDeep,
  or other functions


## Other issues / PRs

### [266 - deferred values in final config](https://github.com/lorenwest/node-config/issues/266)


### [231 - Deferred configuration values are not resolved inside arrays](https://github.com/lorenwest/node-config/issues/231)

This PR will fix this issue

### [205 - PR: Support DeferredConfig-like objects](https://github.com/lorenwest/node-config/pull/205)


## References / see also

* Wiki article on [Submodule 
  configs](https://github.com/lorenwest/node-config/wiki/Sub-Module-Configuration)
* Python 
  [settings-resolver](https://github.com/Klortho/settings-resolver/blob/master/settings_resolver.py)
* [grunt-template-functions](https://github.com/Klortho/grunt-template-functions) - 
  This is incomplete, because it doesn't use getters.
* My xmltools (stash: /projects/JATS/repos/xmltools/browse/main.js) scheme for 
  recursively instantiating configurable objects.
