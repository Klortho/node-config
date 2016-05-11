# klortho's fork

This fork contains a fix ([PR 
#266, from branch 
`resolver`)](https://github.com/lorenwest/node-config/pull/318) to the 
[problem with 
deferreds](https://github.com/lorenwest/node-config/issues/266#issuecomment-217063840) 
in node-config.

I'm maintaining this branch, `fix-deferreds`, for now as a sandbox.
See the `fix-deferreds` subdirectory here, which has some extra test
scripts.

See also [lib/resolver.md](lib/resolver.md), which describes the 
algorithm in some detail

For now, my efforts have shifted over to
[config-one](https://github.com/Klortho/config-one).


## To do

* Write an article for the wiki. See the list at the end of the README;
  where would this article fit in?

* See which of these other issues can be addressed:

    * [266 - deferred values in final 
      config](https://github.com/lorenwest/node-config/issues/266)

    * [231 - Deferred configuration values are not resolved inside 
      arrays](https://github.com/lorenwest/node-config/issues/231)

    * [205 - PR: Support DeferredConfig-like 
      objects](https://github.com/lorenwest/node-config/pull/205)


