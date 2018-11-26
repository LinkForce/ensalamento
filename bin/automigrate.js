"use strict";
var async = require('async');
var path = require('path');
var models = require(path.resolve(__dirname,'../common/models/models.js'))

var app = require(path.resolve(__dirname, '../server/server'));
var old_db = require(path.resolve(__dirname, '../bin/load-old-database'));

var ds = app.datasources.ensalamento;

var lbTables = models.models;

var LOG_CREATE = false;

ds.automigrate(lbTables, function(err) {
  if (err) throw err;
  async.waterfall([
    loadModelFromOldDB(old_db.get_salas, app.models.Sala, LOG_CREATE),
    loadModelFromOldDB(old_db.get_blocos, app.models.Bloco, LOG_CREATE),
    criaUser,
    criaDisciplina,
    criaEquivalencia,
    criaRecursodesala,
    criaTipodesala,
    loadModelFromOldDB(old_db.get_professores, app.models.Professor, LOG_CREATE),
    loadModelFromOldDB(old_db.get_departamentos, app.models.Departamento, LOG_CREATE),
    loadModelFromOldDB(old_db.get_setores, app.models.Setor, LOG_CREATE),
    loadModelFromOldDB(old_db.get_disciplinas, app.models.Disciplina, LOG_CREATE),
    loadModelFromOldDB(old_db.get_cursos, app.models.Curso, LOG_CREATE)
  ],
    function(err) {
    if (err) throw err;
    ds.disconnect();
  })
});




// Returns a function that populate a DB model with data loaded from
// old database (see migrate-old-schema.js and load-old-dabase.js codes)
function loadModelFromOldDB(oldDataAccess, model, create_log){
  return function(cb){
    oldDataAccess.then(data => {
      async.each(data, function(instance, callback) {
        if(create_log) console.log('Trying to insert:', instance);
        model.create(instance, function(err, instanceCreated) {
          callback(err);
          if(create_log) console.log('Created:', instanceCreated);
        });
      }, function(err) {
        if (err) throw err;
        cb(err);
      });
    });
  }
}

function criaRecursodesala(cb){
  var recursos = [
    {descricao: 'recurso1'},
    {descricao: 'recurso2'}
  ];
  async.each(recursos, function(recurso, callback) {
    app.models.Recursodesala.create(recurso, function(err, model) {
      callback(err);
      if(LOG_CREATE) console.log('Created:', model);
    });
  }, function(err) {
    if (err) throw err;
    cb(err);
  });
}

function criaTipodesala(cb){
  var tipos = [
    {nome: 'tipo1'},
    {nome: 'tipo2'}
  ];
  async.each(tipos, function(tipo, callback) {
    app.models.Tipodesala.create(tipo, function(err, model) {
      callback(err);
      if(LOG_CREATE) console.log('Created:', model);
    });
  }, function(err) {
    if (err) throw err;
    cb(err);
  });
}


function criaUser(cb){
  app.models.Secretario.create([
    {username: 'admin', email: 'admin@admin.com', password: '123mudar'},
    {username: 'secretario1', email: 'secretario1@secretario.com', password: '123mudar'},
    {username: 'secretario2', email: 'secretario2@secretario.com', password: '123mudar'}
  ],function(err, users) {
    if (err) throw err;
    if(LOG_CREATE) console.log('Created users:', users);
    app.models.Role.create({
      name: 'admin'
    }, function(err, role) {
      if (err) throw err;
      if(LOG_CREATE) console.log('Created role:', role);
      role.principals.create({
        principalType: app.models.RoleMapping.USER,
        principalId: users[0].id
      }, function(err, principal) {
        if (err) throw err;
        if(LOG_CREATE) console.log('Assign admin Role to initial User:', users[0].email);
        cb(err);
      });
    });
  });
}

function criaEquivalencia(cb){
  app.models.Disciplina.find({id:1}, function(err, disc){
    disc[0].addEquivalencia(2,function(err,data){
      if (err) throw err;
      if(LOG_CREATE) console.log('Created Equivalenciadisciplina:', disc);
      cb(err);
    });

  });
}

function criaDisciplina(cb){
  var disciplinas = [
    {"codigo": "d1","carga_horaria": 0,"duracao": "semestral","modalidade": "presencial"},
    {"codigo": "d2","carga_horaria": 1,"duracao": "semestral","modalidade": "distância"},
    {"codigo": "d3","carga_horaria": 2,"duracao": "anual","modalidade": "presencial"}
  ];

  async.each(disciplinas, function(disciplina, callback) {
    app.models.Disciplina.create(disciplina, function(err, model) {
      if (err) throw err;
      callback(err);
      if(LOG_CREATE) console.log('Created:', model);
    });
  }, function(err) {
    if (err) throw err;
    cb(err);
  });


}
