var path = require('path');
var async = require('async');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.ensalamento;
var models = require(path.resolve(__dirname,'../common/models/models.js'))


var lbTables  = models.models_lower;


var count = lbTables.length;

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

lbTables.forEach(function(table) {

    ds.discoverAndBuildModels(table, {schema: 'public'}, function(err, models) {
      if (err) throw err;

      models[table.capitalize()].find(function(err, model) {

        if (err) return console.log(err);

        console.log(model);
      });

    });
    count--;
    if (count === 0)
        ds.disconnect();
});
