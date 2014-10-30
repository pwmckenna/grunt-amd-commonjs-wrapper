grunt-amd-commonjs-wrapper
=====================

Convert a normal amd module to the simplified commonjs style amd module

### What problem does this solve?
Specifying all the dependencies in an array, then receiving them in a callback makes it very difficult for a [linter to detect unused dependencies](http://www.jshint.com/docs/options/#unused). This in turn makes it hard to detect if files aren't being built into any requirejs build files.
```js
require(['dep1', 'dep2', 'dep3'], function (dep1, dep2, dep3) {
    // dep1 and dep2 are unused, but this will pass lint
    return dep3;
});
```

### When to use?
This is the opposite of most grunt tasks that you'd use as part of your build, in that it (hopefully) makes your code more readable and easy to lint. This means that you're only likely to use it a single time to convert the style of a huge project.

In addition, some people prefer writing their modules in the commonjs style (especially if you want to run your code in node as well). Once you've used this task to convert your modules, you could even just strip off the outer define call and re-add it at build time with something like [grunt-amd-wrap](https://www.npmjs.org/package/grunt-amd-wrap).

### Examples
>
```js
define(['dep1', 'dep2'], function (var1, var2) {
    return var1 + var2;
});
```
becomes
```js
define(function (require, exports, module) {
    var var1 = require('dep1');
    var var2 = require('dep2');
    return var1 + var2;
});
```

#####supports variable-less dependencies
>
```js
define(['dep1', 'dep2'], function () {
});
```
becomes
```js
define(function (require, exports, module) {
    require('dep1');
    require('dep2');
});
```

#####supports named modules
>
```js
define('modulename', ['dep'], function () {
});
```
becomes
```js
define('modulename', function (require, exports, module) {
    require('dep');
});
```

#####supports 'use strict'
>
```js
define('modulename', ['dep'], function () {
    'use strict';
});
```
becomes
```js
define('modulename', function (require, exports, module) {
    'use strict';
    require('dep');
});
```

#####leaves commonjs wrapper modules alone
>
```js
define('modulename', function (require, exports, module) {
    'use strict';
});
```
remains
```js
define('modulename', function (require, exports, module) {
    'use strict';
});
```

#### Whitespace Warning
There is an attempt to match the indentation of the rest of the file, but its far from perfect. Might upset your linter.

#### Relative Path Warning
If you're using paths not declared in your requirejs config file, then this will probably break all your paths. This is due to the commonjs style require statements using relative paths, rather than making all paths relative to your requirejs config `baseUrl` setting.
