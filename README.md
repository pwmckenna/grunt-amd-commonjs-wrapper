grunt-amd-commonjs-wrapper
=====================

Convert a normal amd module to the simplified commonjs style amd module

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
