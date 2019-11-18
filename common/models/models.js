"use strict";
/**
Models are used in a lot of script, so we created this file to unify.
 **/
var models = [
	'Usuario',
	'Secretario',
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
	'Setor',
	'Departamento',
	'Curso',
	"CursoDisciplina",
	"Professor",
	"Horario",
	"Semestre",
	"Ensalamento",
	"EventoHorario",
	"FileUpload",
	"FileUploadError",
	"FileUploadFileUploadError",
	"TurmaHorario",
	"Aviso"
];

/**
Some scripts need the lower case version of it
**/
var models_lower = models.map(function(x){
        return x.toLowerCase();
    });
exports.models = models;

exports.models_lower = models_lower
