"use strict";
var async = require('async');
var path = require('path');
var models = require(path.resolve(__dirname,'../common/models/models.js'))


var models = models.models;
var models_lower = models.models_lower;
var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.ensalamento;


ds.isActual(models, function(err, actual) {
  console.log('Is actual?:  ', actual);
  if (!actual) {
    ds.autoupdate(models_lower, function(err, result) {
        new_models.forEach(function(model){
            ds.discoverModelProperties(model, function (err, props) {
                console.log(props);
            });
        });

    });
  }
});
