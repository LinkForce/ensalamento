"use strict";
/**
Models are used in a lot of script, so we created this file to unify.
**/
var models = [
        'User',
        'AccessToken',
        'ACL',
        'RoleMapping',
        'Role',
        'Sala',
        'Bloco',
        'Disciplina',
        'Equivalenciadisciplina',
        'Evento',
        'Turma',
        'Recursodesala',
        'SalaRecursodesala',
        'DisciplinaRecursodesala',
        'Tipodesala',
        'Orgao',
        'Secretario',
        'Setor',
        'Departamento',
        'Curso',
        "CursoDisciplina"
    ];

/**
Some scripts need the lower case version of it
**/
var models_lower = models.map(function(x){
        return x.toLowerCase();
    });
exports.models = models;

exports.models_lower = models_lower
