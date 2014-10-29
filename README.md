grunt-amd-to-commonjs
=====================

Convert a normal amd module to the simplified commonjs style amd module

#### Examples
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
supports variable-less dependencies as well!
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

#### Whitespace Warning
There is an attempt to match the indentation of the rest of the file, but its far from perfect. Might upset your linter.

#### Relative Path Warning
If you're using paths not declared in your requirejs config file, then this will probably break all your paths. This is due to the commonjs style require statements using relative paths, rather than making all paths relative to your requirejs config `baseUrl` setting.
