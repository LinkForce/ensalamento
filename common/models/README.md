# Models Descriptions

## Sala
- Public: `False`
- Attributes `idInjection`=`false`
  * nome : **string**
  * codigo : **string** `Required`, `id`
  * localizacao : **geopoint** `Required`
  * andar : **number** default=`0`
  * capacidade : **number** `Required`, default=`0`
  * restrita : **boolean** `Required`, default=`false`
  * observacao : **string**
  * _id : **number** `generated`
- ACLs
  * All permissions not specified is `DENY`
  * **$everyone** ROLE have all READ operations
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
  * **owner** ROLE have all EXECUTE, READ and WRITE operations
- Relations
  * Belongs to : **Bloco** as `blocoCod`
  * Has and Belongs To Many : **Recursodesala** as `recursos` 
  * Belongs to : **Tipodesala** as `tipo`
  * Belongs to : **Secretario** as `ownerId`

## Bloco
- Public: `True`
- Attributes `idInjection`=`false`
  * nome : **string** `Required`
  * codigo : **string** `Required`, `id`
  * localizacao : **geopoint** `Required`
  * tamanho : **number** `Required`, default=`0`
  * _id : **number** `generated`
- ACLs
  * All permissions not specified is `DENY`
  * **$everyone** ROLE have all READ operations
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
  * Belongs To : **Setor** as `setorCod`

## Disciplina
- Public: `True`
- Attributes `idInjection`=`false`
  * codigo : **string** `Required`, `id`
  * carga_horaria : **number** `Required`, default=`0`
  * duracao : **string** `Required`, default=`semestral`
  * modalidade : **string** `Required`, default=`presencial`
  * _id : **number** `generated`

- ACLs
  * All permissions not specified is `DENY`
  * **$everyone** ROLE have all READ operations
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
  * This model have a self-realtion. To implement this, we use the EquivalenciaDisciplina model
  * Has Many : **Turma** `Required (in Turma)` as `disciplinaId (in Turma)`
  * Has and Belongs To Many : **Recursodesala** as `recursosnecessarios`
  * Belongs To : **Tipodesala** as `tipodesalaId`
  * Belongs To : **Departamento** as `departamentoCod`


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
  * Belongs To : **Departamento** as `departamentoCod`

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
- Attributes `idInjection`=`false`
  * nome : **string** `Required`, default=`'normal'`, `id`
- ACLs
  * All permissions not specified is `DENY`
  * **$everyone** ROLE have all READ operations
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
- Observation: In future, its possible that will be necessary to find
               rooms filtering by resources. Loopback gives a set of utilities
               to solve many types of this problems, including filtering
               relations: https://loopback.io/doc/en/lb3/Include-filter.html

## Orgao (server-side)
- Public: `False`
- Description: This will be extended by `Curso`, `Departamento` and `Setor`
- Attributes `idInjection`=`false`
  * nome : **sting** `Required`
  * localizacao : **geopoint**
  * codigo : **string** `Required`, `id`
  * _id : **number** `generated`
- ACLs
  * All permissions not specified is `DENY`
  * **$everyone** ROLE have all READ operations
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
  * Belongs To : **Secretario** as `secretarioId`

## Curso
- Public: `True`
- Description: This model extend `Orgao`
- Attributes
- ACLs
  * All permissions not specified is `DENY`
  * **$everyone** ROLE have all READ operations
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
  * Belongs To : **Bloco** as `blocoCod`
  * Belongs To : **Setor** as `setorCod`
  * Has and Belongs To Many : **Setor** as `Disciplina`
- Observation: The relation with Bloco means that one Curso will be relationed
               with a Bloco.

## Departamento
- Public: `True`
- Description: This model extend `Orgao`
- Attributes
- ACLs
  * All permissions not specified is `DENY`
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
  * Belongs To : **Setor** as `setorCod`
  * Has Many : **Turma** as `departamentoCod`

## Setor
- Public: `True`
- Description: This model extend `Orgao`
- Attributes
  * website : **string**
  * email : **string** `Required`
- ACLs
  * All permissions not specified is `DENY`
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
  * Has Many : **Departamento** as `setorCod`
  * Has Many : **Bloco** as `setorCod`
  * Has Many : **Curso** as `setorCod`

## Secretario
- Public: `True`
- Description: This model extend `User`
- Attributes
  * vinculo : **string** `Required`, default=`'departamento'`
  * descricao : **string**, default=`'change_password'`
    * Used for restrict actions of user in some cases. For instance, when user
      has he first login, he must change the password.
      
- ACLs
  * All permissions not specified is `DENY`
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
  * Has Many : **Orgao** as `secretarioId`
  * Has Many : **Sala** as `ownerId`