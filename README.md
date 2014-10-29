grunt-amd-to-commonjs
=====================

Convert a normal amd module to the simplified commonjs style amd module

```
define(['dep1', 'dep2'], function (var1, var2) {
    return var1 + var2;
});
```
becomes
```
define(function (require, exports, module) {
    var var1 = require('dep1');
    var var2 = require('dep2');
    
    return var1 + var2;
});
```
