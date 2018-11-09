# Models Descriptions

## Sala
- Public: `False`
- Attributes
  * nome : **string**
  * codigo : **string** `Required`
  * localizacao : **geopoint** `Required`
  * andar : **number** default=`0`
  * capacidade : **number** `Required`, default=`0`
  * restrita : **boolean** `Required`, default=`false`
  * observacao : **string**
- ACLs
  * All permissions not specified is `DENY`
  * **$everyone** ROLE have all READ operations
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
  * Belongs to : **Bloco**
  * Has and Belongs To Many : **Recursodesala** as `recursos` 

## Bloco
- Public: `True`
- Attributes `idInjection`=`false`
  * nome : **string** `Required`
  * codigo : **string** `Required` `primaryKey`
  * localizacao : **geopoint** `Required`
  * tamanho : **number** `Required`, default=`0`
- ACLs
  * All permissions not specified is `DENY`
  * **$everyone** ROLE have all READ operations
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations

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
  * Has and Belongs To Many : **Recursodesala** as `recursosnecessarios`


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

## Recursodesala
- Public: `False`
- Description: This model contains the resources listage of rooms.
               In future, this can be use to allocate a room to disciplinas. 
               In this case, a disciplina must gain a room that meet this 
               resources needs.
- Attributes
  * descricao : **string** `Required`
- ACLs
  * All permissions not specified is `DENY`
  * **$everyone** ROLE have all READ operations
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
- Observation: In future, its possible that will be necessary to find
               rooms filtering by resources. Loopback gives a set of utilities
               to solve many types of this problems, including filtering
               relations: https://loopback.io/doc/en/lb3/Include-filter.html

## Tipodesala
- Public: `False`
- Description: This model contains the types of rooms listage.
               In future, this can be use to allocate a room to disciplinas. 
               In this case, a disciplina must gain a room that meet this 
               room type need.
- Attributes
  * nome : **string** `Required`
- ACLs
  * All permissions not specified is `DENY`
  * **$everyone** ROLE have all READ operations
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
- Observation: In future, its possible that will be necessary to find
               rooms filtering by resources. Loopback gives a set of utilities
               to solve many types of this problems, including filtering
               relations: https://loopback.io/doc/en/lb3/Include-filter.html