#!/usr/bin/env node

/**
* Module dependencies.
*/

var glob = require("glob");
var path = require('path');
var Q = require('q');
var handlebars = require('handlebars');
var mkdirp = require('mkdirp');

var fs = require('fs');
var colors = require('colors');
var program = require('commander');

program
    .allowUnknownOption()
    .option('-p, --path <long>', 'path for process')
    .parse(process.argv);

if(!program.path) {
    console.log('请输入正确的文件夹地址'.red);
    return false;
}

var compileTpl = function(fileName) {
        var data = fs.readFileSync(fileName, 'utf-8'), result;

        result = handlebars.precompile(data);
        result = "define(function(require, exports, module){var Handlebars = require('handlebars'), template = Handlebars.template; \n module.exports = template(" + result + ")()});";

        var dir = path.dirname(fileName);
        var file = path.basename(fileName);
        var ps = dir + '/compiled/'+ file + '.js';
        writeFile(ps, result, 'utf-8');
    },
    writeFile = function(ps, data) {
        mkdirp(path.dirname(ps), function (err) {
           if (err) {
                console.log("ERROR !! " +err.red);
           }
           ps = ps.replace('.tpl', '-tpl');
           fs.writeFile(ps, data,function() {
                console.log(ps.magenta + ' written success'.magenta);
           });
        });
    },
    changeFileToCompiled = function(fileName) {
        fs.readFile(fileName, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            var reg = /require\([\'\"]([^\'^\"]*\.tpl)[\'\"]\)/g;
            if(!data.match(reg)) {
                return null;
            }
            var success = false;
            var result = data.replace(reg, function(fullMatch, fullPath){
                var fileArr = fullPath.split('/');
                var fileExt = fileArr[fileArr.length -1 ];
                var ta;
                if(fullPath.indexOf('compiled/') == -1) {
                   fullMatch = fullMatch.replace('script', 'dist');
                   ta =  fullMatch.replace(fileExt, 'compiled/'+ fileExt.replace('.tpl', '-tpl') + '.js');
                }

                if(!ta ) console.log(fileName);
                ta = ta.replace(/\"/g,"'")
                console.log('Compiled ' + ta + ' done.');
                success = true;
                return ta;
            });
            if(success) {
                fs.writeFile(fileName,  result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            }
        });
    },
    changeFileToNormal = function(fileName) {
        fs.readFile(fileName, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            var reg = /require\([\'\"]([^\'^\"]*\.tpl.js)[\'\"]\)/g;

            if(!data.match(reg)) {
                return null;
            }

            var result = data.replace(reg, function(fullMatch, fullPath){
                var fileArr = fullPath.split('/');
                var fileExt = fileArr[fileArr.length -1 ];
                var ta;

                if(fullPath.indexOf('compiled/') != -1) {
                    ta =  fullMatch.replace('compiled/', '');
                    ta =  ta.replace('.js', '');
                    ta.replace('-tpl', '.tpl');
                }
                if(!ta ) console.log(fileName);
                ta = ta.replace(/\"/g,"'");
                console.log( 'Raw ' + ta + ' done.');
                return ta;
            });

            fileName = fileName.replace('dist', 'script');
            fs.writeFile(fileName,  result, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });
    }

function start() {
    var deferred = Q.defer();
    glob(program.path + "/**/*.tpl", {}, function (er, files) {
        try {
            for(var i = 0; i < files.length; i++){
              compileTpl(files[i]);
            }
            deferred.resolve();
        } catch(e) {
            deferred.reject(e);
        }
    });

    return deferred.promise;
}
function changeViewQuote() {
    glob(program.path + "/**/*.js", {}, function (er, files) {
       for(var i = 0; i < files.length; i++){
            if(files[i].indexOf('compiled') != -1) {
                continue;
            }

            changeFileToCompiled(files[i]);
            changeFileToNormal(files[i]);
       }
    });
}
start().then(function() {
    changeViewQuote();
}, function() {
    console.log('change tpl error!'.red);
});