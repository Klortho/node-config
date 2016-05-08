# How resolution works.

After all of the config data has been read in and merged, this module's resolve() method is called. The task is to recursively walk through the heirarchical data tree, and wherever there is a deferred function, to evaluate it, and replace that node in the tree with the results.

During resolution, it maintains two heirarchical trees of data:
 * 1. the config tree, which is the original config data, that includes atoms, objects, and
 *    deferreds (no resolvers)
 * 2. nd the
 * resolver tree,
 * which shadows, or
proxies, the config tree.

  The config tree has only atoms, objects, and deferreds (no resolvers)

The resolver tree uses getters, but can be thought of as a static tree. It has
only atoms and resolvers -- a get operation never returns an object. The atoms
are the original object from the config tree.
*/
