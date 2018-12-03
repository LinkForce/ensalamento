"use strict";
var async = require('async');
var path = require('path');
var models = require(path.resolve(__dirname,'../common/models/models.js'))

var app = require(path.resolve(__dirname, '../server/server'));
var old_db = require(path.resolve(__dirname, '../bin/load-old-database'));

var ds = app.datasources.ensalamento;

var lbTables = models.models;

var LOG_CREATE = false;

// console.log(app.models.Curso.scopes.disciplinas.modelFrom);

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
    loadModelFromOldDB(old_db.get_equivalenciasDisciplinas, app.models.Equivalenciadisciplina, LOG_CREATE),
    loadModelFromOldDB(old_db.get_cursos, app.models.Curso, LOG_CREATE),

    loadRelationsFromOldDB(old_db.get_cursoDisciplina, app.models.Curso, "disciplinas", LOG_CREATE),
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
      async.each(data, (instance, callback) => {
        if(create_log) console.log('Trying to insert:', instance);
        model.upsert(instance, (err, instanceCreated) => {
          callback(err);
          if(create_log) console.log('Created:', instanceCreated);
        });
      }, (err) => {
        if (err) throw err;
        cb(err);
      });
    });
  }
}



function addRelationBetweenModels(model, modelRelationName,
                                      relationInstance, cb, create_log){
  var query = {where: {}};
  query.where[relationInstance.pkey_name] = relationInstance.pkeys[0];

  model.findOne(query, (err,data) => {
    if (err) throw err;
    data[modelRelationName].add(relationInstance.pkeys[1], (err,data) => {
      cb(err,data);
    });
  });
}

// Returns a function that populate a relation DB model with data loaded from
// old database (see migrate-old-schema.js and load-old-dabase.js codes)
function loadRelationsFromOldDB(oldDataAccess, model, modelRelationName, create_log){
  return function(cb){
    oldDataAccess.then(data => {
      async.each(data, (instance, callback) => {
        
        if(create_log){
          console.log('Trying to insert relation on ', 
            modelRelationName,':', instance
          );
        }

        addRelationBetweenModels(
          model,
          modelRelationName,
          instance,
          (err, instanceCreated) => {
            callback(err);
            if(create_log) console.log('Created:', instanceCreated);
        });

      }, (err) => {
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
    app.models.Recursodesala.upsert(recurso, function(err, model) {
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
    app.models.Tipodesala.upsert(tipo, function(err, model) {
      callback(err);
      if(LOG_CREATE) console.log('Created:', model);
    });
  }, function(err) {
    if (err) throw err;
    cb(err);
  });
}


function criaUser(cb){
  app.models.Secretario.replaceOrCreate([
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
    {"codigo": "d1", "nome": "disciplina1", "carga_horaria": 0,"duracao": "semestral","modalidade": "presencial"},
    {"codigo": "d2", "nome": "disciplina2", "carga_horaria": 1,"duracao": "semestral","modalidade": "distância"},
    {"codigo": "d3", "nome": "disciplina3", "carga_horaria": 2,"duracao": "anual","modalidade": "presencial"}
  ];

  async.each(disciplinas, function(disciplina, callback) {
    app.models.Disciplina.upsert(disciplina, function(err, model) {
      if (err) throw err;
      callback(err);
      if(LOG_CREATE) console.log('Created:', model);
    });
  }, function(err) {
    if (err) throw err;
    cb(err);
  });

}
