"use strict";
var async = require('async');
var path = require('path');
var models = require(path.resolve(__dirname,'../common/models/models.js'))


var models = models.models;
var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.ensalamento;
var new_models = models.map(function(x){
    return x.toLowerCase();
});

ds.isActual(models, function(err, actual) {
  console.log('Is actual?:  ', actual);
  if (!actual) {
    ds.autoupdate(models, function(err, result) {
        new_models.forEach(function(model){
            ds.discoverModelProperties(model, function (err, props) {
                console.log(props);
            });
        });

    });
  }
});
