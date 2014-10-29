define(function (require, exports, module) {
    var var1 = require('dep1');
    var var2 = require('dep2');
    require('dep3');
    
    return var1 + var2;
});