# klortho's fork

This branch is a fix to the problem with deferreds in node-config.

See:

* Discussion in [issue 
  #266](https://github.com/lorenwest/node-config/issues/266#issuecomment-217063840)
* [PR #266](https://github.com/lorenwest/node-config/pull/318) - from the
  `resolver` branch here.
* [lib/resolver.md](lib/resolver.md) - describes the algorithm in some
  detail

I'm maintaining this branch for now as a sandbox -- for these notes, and
for the `fix-deferreds` subdirectory here, which is a little test project.

## To do

* What *exactly* are the limitations with regards to objects & class
  instances? Does it behave correctly for functions, Dates, and other
  kinds of things?
* (Related) Check it against https://github.com/lorenwest/node-config/pull/175 -
  I'm concerned about how my implementation will behave inside extendDeep,
  or other functions

Enhancements:

* Allow passing in a "relative" argument to a deferred: a resolver that
  represents the *current* node. You could subscript it with '..' to go
  up (meaning it would have to have a getter for that string). You could
  use this feature to create aliases for any config node.


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
