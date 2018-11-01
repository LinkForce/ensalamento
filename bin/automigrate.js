"use strict";
var async = require('async');
var path = require('path');
var models = require(path.resolve(__dirname,'../common/models/models.js'))

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.ensalamento;

var lbTables = models.models;

ds.automigrate(lbTables, function(err) {
  if (err) throw err;

  async.waterfall([criaBloco,criaSala,criaUser,criaDisciplina, criaEquivalencia, criaRecursodesala, criaTipodesala], function(err) {
    if (err) throw err;
    ds.disconnect();
  })


});

function criaBloco(cb){
  var blocos = [
    {localizacao: '0,0', tamanho: 10},
    {localizacao: '0,0', tamanho: 10}
  ];

  async.each(blocos, function(bloco, callback) {
    app.models.Bloco.create(bloco, function(err, model) {
      callback(err);
      console.log('Created:', model);
    });
  }, function(err) {
    if (err) throw err;
    cb(err);
  });
}


function criaSala(cb){

  var salas = [
    {localizacao: '41.12,-71.34', capacidade: 10, tipo:"teste", restrita:false},
    {localizacao: '41.12,-71.34', capacidade: 10, tipo:"teste", restrita:true}
  ];

  async.each(salas, function(sala, callback) {
    app.models.Sala.create(sala, function(err, model) {
      callback(err);
      console.log('Created:', model);
    });
  }, function(err) {
    if (err) throw err;
    cb(err);
  });
}


function criaRecursodesala(cb){
  var recursos = [
    {descricao: 'recurso1'},
    {descricao: 'recurso2'}
  ];
  async.each(recursos, function(recurso, callback) {
    app.models.Recursodesala.create(recurso, function(err, model) {
      callback(err);
      console.log('Created:', model);
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
      console.log('Created:', model);
    });
  }, function(err) {
    if (err) throw err;
    cb(err);
  });
}


function criaUser(cb){
  app.models.User.create([
    {username: 'admin', email: 'admin@admin.com', password: '123mudar'},
    {username: 'normal', email: 'normal@normal.com', password: '123mudar'}
  ],function(err, users) {
    if (err) throw err;
    console.log('Created users:', users);
    app.models.Role.create({
      name: 'admin'
    }, function(err, role) {
      if (err) throw err;
      console.log('Created role:', role);
      role.principals.create({
        principalType: app.models.RoleMapping.USER,
        principalId: users[0].id
      }, function(err, principal) {
        if (err) throw err;
        console.log('Assign admin Role to initial User:', users[0].email);
        cb(err);
      });
    });
  });
}

function criaEquivalencia(cb){
  app.models.Disciplina.find({id:1}, function(err, disc){
    disc[0].addEquivalencia(2,function(err,data){
      if (err) throw err;
      console.log('Created Equivalenciadisciplina:', disc);
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
      console.log('Created:', model);
    });
  }, function(err) {
    if (err) throw err;
    cb(err);
  });


}
