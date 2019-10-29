'use strict';
const _         = require('lodash');
var app = require('../../server/server');
const async     = require('async');
const { fork }      = require('child_process');
const loopback  = require('loopback');
const Disciplina = app.models.Disciplina;

module.exports = function(Turma) {
    Turma.validatesPresenceOf('disciplinaCod');
    /**
 * junta turmas
 * @param {array} turmas lista de turmas a serem unidas
 * @param {Function(Error)} callback
 */

    // transform array of json in turmas instance
    async function get_turmas(turmas) {
        var _turmas = [];
        for(var i=0; i < turmas.length ; i++) {
            var turma = turmas[i];
            console.log(turma);
            var t = await app.models.Turma.findById(turma.id)
            _turmas.push(t);
        }
        return _turmas
    }

    async function check_horario(t1,t2) {
        var h_x = t1.horarios.find()
        var h_y = t2.horarios.find()
        var mesmo_horario = false;
        for(var i=0; i<h_x.length; i++){
            for(var j=0; j<h_y.length && !mesmo_horario; j++){
                if (h_x[i].horario_inicial == h_y[j].horario_inicial &&
                    h_x[i].horario_final == h_y[j].horario_final &&
                    h_x[i].dia == h_y[j].dia)
                    mesmo_horario = true;
                
            }
            if (mesmo_horario == false)
               return false;

            mesmo_horario = false;
            
        }
        return true;
    }
    async function check_disciplina(t1,t2) {
        var disciplina_x = t1.disciplina.get()
        var disciplina_y = t2.disciplina.get()
        //var equivalencias_x = await disciplina_x.getEquivalencias()
        //console.log(equivalencias_x)
        //if (Array.isArray(equivalencias_x)) {
        //    for(var i=0; i < equivalencias_x.length; i++)
        //        if (equivalencias_x[i].codigo == disciplina_y.codigo)
        //            return true;
        //}
        //else {
        //    if (disciplina_y.codigo == equivalencias_x.codigo)
        //        return true;
        //}
        if (disciplina_x.codigo == disciplina_y.codigo)
            return true;

        return false;
    }

    Turma.juntar = async function(_turmas) {
        if (!_turmas ||  !_turmas.length)
            return {"status":0, "msg": "Lista de turmas vazia"}
        var turmas = await get_turmas(_turmas);

        console.log(turmas)
        turmas.map(async (i)=>{
            var horarios = await i.horarios.find()
            var disciplina = await i.disciplina.get()
            console.log("Horarios: ",horarios,"disciplina: ",disciplina)
        });
        var turma_x = turmas[0];
        console.log("turma x antes",turma_x)
        var turmas_to_merged = []
        for(var j=1; j < turmas.length; j++) {
            var turma_y = turmas[j];
            // verificar se são a mesma disciplina ou disciplina equivalentes
            var disciplina_result = await check_disciplina(turma_x,turma_y);
            if(!disciplina_result)
                return {"status":1,
                        "msg":"As disciplinas não são equivalentes",
                        "turmas":[ turma_x, turma_y] 
                        };
            // verificar se são o mesmo horario ou horario logo apos
            var horarios_result = await check_horario(turma_x,turma_y);
            if(!horarios_result)
                return {"status":2,
                        "msg":"Horarios não são compatíveis",
                        "turmas":[ turma_x, turma_y] 
                };
            // se positivo adicionar turma_y na lista de turmas a serem  unidas
            turmas_to_merged.push(turma_y);
        }
        // se todas as turmas forem compativeis então une todas na primeira
        for (var i = 0; i < turmas_to_merged.length; i++) {
            turma_y = turmas_to_merged[i]
            turma_x.vagas += turma_y.vagas
            turma_y.horarios.destroyAll()
        }
        turma_y.destroy()
        console.log("turma x depois",turma_x)
        turma_x.save()

        return turmas;
    };

};
