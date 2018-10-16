var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.ensalamento;
var lbTables = ['user','accesstoken','acl','rolemapping','role','sala','bloco','disciplina','equivalenciadisciplina'];

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
