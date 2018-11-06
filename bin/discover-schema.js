var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.ensalamento;
var models = require(path.resolve(__dirname,'../common/models/models.js'))


var lbTables  = models.models_lower;
var count = lbTables.length;
lbTables.forEach(function(table) {
    ds.discoverSchema(table, {schema: "public"}, function(err, schema) {
        if (err) throw err;

        var json = JSON.stringify(schema, null, '  ');
        console.log(json);

    });
    count--;
    if (count === 0)
        ds.disconnect();
});
