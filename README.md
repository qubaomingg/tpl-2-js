## tpl2js

A tool which can compile tpl to tpl.js & replace `require('xxx.tpl')` to `require('xxx.tpl.js')`

### Install

    npm install tpl2js -g

### Usage

    tpl -p <your file dir>

    tpl2js -p dist/

### Example

    +dist
     -a.js
     -a.tpl


    // a.js
    define(function(require, exports, module){
        var view = View.extend({
            template: require('a.tpl')
        });
    });
    // a.tpl
    <h1>I am b</h1>


` tpl2js -p dist`

    // a.js
    define(function(require, exports, module){
        var view = View.extend({
            template: require('compiled/a.tpl.js')
        });
    });

    // compiled/a.tpl.js
    define(function(require, exports, module){
        module.exports = '<h1>I am b</h1>';
    });
