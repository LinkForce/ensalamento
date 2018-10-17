'use strict';

var app = require('../../server/server');

module.exports = function(Disciplina) {
  // The follow remote methods was constructed because there is many problems
  // in the Model Self Relation in LoopBack API 3
  // The model EquivalenciaDisciplina was created to implement this relation

  Disciplina.prototype.addEquivalencia = function(disciplina_eq_id, cb) {
    var Eq = app.models.Equivalenciadisciplina;

    Eq.create({"disciplina1": this.id, "disciplina2":disciplina_eq_id}, function(err, eq){
        cb(err,eq);
    });

  };

  Disciplina.prototype.getEquivalencias = function(cb) {
    var Eq = app.models.Equivalenciadisciplina;
    let myId = this.id;
    Eq.find({where:{or:[ {disciplina1:myId}, {disciplina2:myId} ]}}, function(err, eq){

      // Filter only the ids of equivalents courses
      // The id can be on disciplina1 or disciplina2 columns
      // console.log(eq[0].disciplina1.toString(), eq[0].disciplina2.toString());

      var ret = eq.map(function(x){
        x = x.toJSON();
        if(myId == x.disciplina1) return x.disciplina2;
        return x.disciplina1;
      });

      // Remove repeated information
      var uniqueArray = ret.filter(function(item, pos) {
        return ret.indexOf(item) == pos;
      })

      cb(err,uniqueArray);
    });

  };

  Disciplina.prototype.deleteEquivalencia = function(disciplina_eq_id, cb) {
    var Eq = app.models.Equivalenciadisciplina;
    let myId = this.id;

    // Find and destroy all relations between the two specified instances
    // The relation can be in form of (id1,id2) or (id2,id1)
    Eq.destroyAll({
      or:[
        {
          and:[
            {disciplina1:myId},
            {disciplina2:disciplina_eq_id}
          ]
        },
        {
          and:[
            {disciplina1:disciplina_eq_id},
            {disciplina2:myId}
          ]
        }
      ]
    }, function(err, info){
      cb(err,info);
    });

  };

};
