var path = require('path');
var async = require('async');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.ensalamento;


var functions = [discoverAndBuildUser, discoverAndBuildRole, discoverAndBuildSala,
                discoverAndBuildSala, discoverAndBuildBloco, discoverAndBuildDisciplina,
                discoverAndBuildEquivalenciadisciplina, discoverAndBuildAccessToken,
                discoverAndBuildACL,discoverAndBuildRoleMapping
            ]
async.parallel(functions,function(error){
    if (err) throw err;

    ds.disconnect();
});

function discoverAndBuildUser(){

    ds.discoverAndBuildModels('user', {schema: 'public'}, function(err, models) {
      if (err) throw err;
      models.User.find(function(err, users) {

        if (err) return console.log(err);
        console.log(users);
      });

    });

}

function discoverAndBuildAccessToken(){

    ds.discoverAndBuildModels('accesstoken', {schema: 'public'}, function(err, models) {
      if (err) throw err;
      models.Accesstoken.find(function(err, accesstokens) {
        if (err) return console.log(err);
        console.log(accesstokens);


      });

    });

}

function discoverAndBuildACL(){

    ds.discoverAndBuildModels('acl', {schema: 'public'}, function(err, models) {
      if (err) throw err;
      models.Acl.find(function(err, acls) {
        if (err) return console.log(err);

        console.log(acls);

      });

    });

}



function discoverAndBuildRoleMapping(){

    ds.discoverAndBuildModels('rolemapping', {schema: 'public'}, function(err, models) {
      if (err) throw err;

      models.Rolemapping.find(function(err, rolesmappings) {
        if (err) return console.log(err);

        console.log(rolesmappings);

      });

    });

}


function discoverAndBuildRole(){

    ds.discoverAndBuildModels('role', {schema: 'public'}, function(err, models) {
      if (err) throw err;

      models.Role.find(function(err, roles) {
        if (err) return console.log(err);

        console.log(roles);

      });

    });

}

function discoverAndBuildSala(){

    ds.discoverAndBuildModels('sala', {schema: 'public'}, function(err, models) {
      if (err) throw err;

      models.Sala.find(function(err, salas) {
        if (err) return console.log(err);

        console.log(salas);

      });

    });

}


function discoverAndBuildBloco(){

    ds.discoverAndBuildModels('bloco', {schema: 'public'}, function(err, models) {
      if (err) throw err;

      models.Bloco.find(function(err, blocos) {
        if (err) return console.log(err);

        console.log(blocos);

      });

    });

}




function discoverAndBuildDisciplina(){

    ds.discoverAndBuildModels('disciplina', {schema: 'public'}, function(err, models) {
      if (err) throw err;

      models.Disciplina.find(function(err, disciplinas) {
        if (err) return console.log(err);

        console.log(disciplinas);

      });

    });

}



function discoverAndBuildEquivalenciadisciplina(){

    ds.discoverAndBuildModels('equivalenciadisciplina', {schema: 'public'}, function(err, models) {
      if (err) throw err;
      models.Equivalenciadisciplina.find(function(err, equivalenciadisciplinas) {
        if (err) return console.log(err);

        console.log(equivalenciadisciplinas);

      });

    });

}
