# Models Descriptions

## Sala
- Public: `False`
- Attributes
  * localizacao : **geopoint** `Required`
  * capacidade : **number** `Required`, default=`0`
  * tipo : **string** `Required`, default=`"normal"`
  * restrita : **boolean** `Required`, default=`false`
- ACLs
  * All permissions not specified is `DENY`
  * **$everyone** ROLE have all READ operations
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
  * Belongs to : **Bloco**

## Bloco
- Public: `True`
- Attributes
  * localizacao : **geopoint** `Required`
  * tamanho : **number** `Required`, default=`0`
- ACLs
  * All permissions not specified is `DENY`
  * **$everyone** ROLE have all READ operations
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
  * Has many : **Sala** `nestRemoting`, `disableInclude`

## Disciplina
- Public: `True`
- Attributes
  * codigo : **string** `Required`
  * carga_horaria : **number** `Required`, default=`0`
  * duracao : **string** `Required`, default=`semestral`
  * modalidade : **string** `Required`, default=`presencial`
- ACLs
  * All permissions not specified is `DENY`
  * **$everyone** ROLE have all READ operations
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
  * This model have a self-realtion. To implement this, we use the EquivalenciaDisciplina model
  * Has Many : **Turma** `Required (in Turma)` as `disciplinaId (in Turma)`


## EquivalenciaDisciplina
- Public: `False`
- Description: Contain the self relation of Disciplina
- Attributes
- ACLs
  * All permissions not specified is `DENY`
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
  * Belongs To : **Disciplina** `Required` as `disciplina1`
  * Belongs To : **Disciplina** `Required` as `disciplina2`

## Evento (server-side)
- Public: `False`
- Description: This will be extended by `Turma`
- Attributes
  * organizador : **sting** `Required`
  * vagas : **number** `Required`
  * ano : **number** `Required`
  * periodo : **string** `Required`
- ACLs
  * All permissions not specified is `DENY`
  * **$everyone** ROLE have all READ operations
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
  * `Model Disciplina has a relation Has Many on this`

## Turma
- Public: `True`
- Description: This model extend `Evento`
- Attributes
  * horarios : **date** `Required`
  * data_inicio : **date** `Required`
  * data_fim : **date** `Required`
- ACLs
  * All permissions not specified is `DENY`
  * **$everyone** ROLE have all READ operations
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
