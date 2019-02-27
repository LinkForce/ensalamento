'use strict';
var app = require('../../server/server');

module.exports = function(Horario) {

  Horario.getCode = function(horario_id, cb){
    var Turma = app.models.Turma;
    var queryTurma = {
      include: {
        relation: 'horarios',
      }
    };

    // TODO: Also, collect all Evento instances 

    // Query the model Turma and find all instances related to horario_id
    // The Horario model cannot be used directly because
    // the hasAndBelongsToMany is in Turma model
    Turma.find(queryTurma, (err,turmas) => {
      if(err) return cb(err,null);
      var codes = turmas.map(t => {
        var horarios_turma = t.horarios;

        // Create an array with the codes of turmas
        // If the turma is not related with horario_id, then the code
        // is an empty string 
        for(var h in horarios_turma){
            var horario = horarios_turma[h];
            if(horario.id == horario_id) return t.codigo;
        }
        return "";
      });

      // Filter and join codes with "-"
      codes = codes.filter(c => {return c != "";});
      cb(err,codes.join("-"));
    });
  }

  Horario.getTotalSize = function(horario_id, cb){
    var Turma = app.models.Turma;
    var queryTurma = {
      include: {
        relation: 'horarios',
      }
    };

    // Query the model Turma and find all instances related to horario_id
    // The Horario model cannot be used directly because
    // the hasAndBelongsToMany is in Turma model
    Turma.find(queryTurma, (err,turmas) => {
      if(err) return cb(err,null);

      // Create an array with the size (need to scheduled) of turmas
      // If the turma is not related with horario_id, then the size is 0
      var sizes = turmas.map(t => {
        var horarios_turma = t.horarios;
        for(var h in horarios_turma){
            var horario = horarios_turma[h];
            if(horario.id == horario_id) return t.vagas;
        }
        return 0;
      });
      // Sum all sizes
      cb(err, sizes.reduce((acc,size)=>{return acc+size},0));
    });
  }
  


};
