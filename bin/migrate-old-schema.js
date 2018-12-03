// On this file, you must put all information that will be used to load data
// from old DB and change it if necessary

// Here you must put the tables that will be loaded from database
// Each element must have the follow format:

// [
//     parser: object,
//     mapper: function,
//     columns: string,
//     query: string,
//     new_name: string
// ]

// parser:    An dictionary that translate the old columns name to the new names.
//            Columns not specified will not be loaded

// mapper:    A function that transform the instance after the data was loaded.
//            If it is not necessary, create an empty function

// columns:     The columns extract from query (SQL) that will be used to load the table

// query:     The query (SQL) that will be used to load the table

// new_name:  This is NECESSARILY a name of an model in the Loopback schema.
//            On automigrate, this will be used to access data with a promisse.
//            For instance, get_blocos.then ...


var connectionString = 'postgresql://user:password@localhost:5432/ensalamento';

var rooms = [
{
    "name": "nome",
    "code": "codigo",
    "size": "capacidade",
    "floor": "andar",
    "information": "observacao",
    "can_use": "restrita",
    "latitude": "latitude",
    "longitude": "longitude",
    "blocks_code": "blocoCod",
    "type": "tipo"

},function(x){
    x.restrita = !x.restrita;
    x.localizacao = {lat:x.latitude, lng: x.longitude};
    delete x.latitude;
    delete x.longitude;
    return x;
},
//SELECT
"   *,\
    blocks.code as blocks_code,\
    rooms.code as code,\
    rooms.name as name,\
    blocks.name as blocks_name,\
    room_types.name as type\
",
//FROM
"   rooms\
    INNER JOIN\
    blocks ON rooms.block_id=blocks.id\
    INNER JOIN\
    room_types ON room_type_id=room_types.id\
",
//SAVE FILE HAS
"salas"
];




var blocks = [
{
    "name": "nome",
    "code": "codigo",
    "latitude": "latitude",
    "longitude": "longitude",
    "sector_code": "setorCod"
},function(x){
    x.restrita = !x.restrita;
    x.localizacao = {lat:x.latitude, lng: x.longitude};
    delete x.latitude;
    delete x.longitude;
    return x;
},
//SELECT
"   blocks.name as name,\
    blocks.code as code,\
    blocks.latitude as latitude,\
    blocks.longitude as longitude,\
    sectors.code as sector_code\
",
//FROM
"   blocks\
    INNER JOIN\
    sectors ON blocks.sector_id=sectors.id\
",
//SAVE FILE HAS
"blocos"
];




var professors = [
{
    "name": "nome",
    "code": "codigo",
    "email": "email",
    "web": "website",
    "department_code": "departamentoCod"
},function(x){
    return x;
},
//SELECT
"   professors.name as name,\
    professors.code as code,\
    departments.code as department_code\
",
//FROM
"   professors\
    INNER JOIN\
    departments ON professors.department_id=departments.id\
",
//SAVE FILE HAS
"professores" 
];




var departments = [
{
    "name": "nome",
    "code": "codigo",
    "sector_code": "setorCod"
},function(x){
    return x;
},

//SELECT
"   departments.name as name,\
    departments.code as code,\
    sectors.code as sector_code\
",
//FROM
"   departments\
    INNER JOIN\
    sectors ON departments.sector_id=sectors.id\
",
//SAVE FILE HAS
"departamentos"
];




var sectors = [
{
    "email": "email",
    "web": "website",
    "name": "nome",
    "code": "codigo"
},function(x){
    return x;
},
"*", //SELECT
"sectors", //FROM
"setores" //SAVE FILE HAS
];




var subjects = [
{
    "code": "codigo",
    "name": "nome",
    "hour_total": "carga_horaria",
    "department_code": "departamentoCod",
},function(x){
    return x;
},

//SELECT
"   subjects.code as code,\
    subjects.name as name,\
    subjects.hour_total as hour_total,\
    departments.code as department_code\
",

//FROM
"   subjects\
    INNER JOIN\
    departments ON subjects.department_id=departments.id\
",

"disciplinas" //SAVE FILE HAS
];



var subjects_equivalences = [
{
    "code1": "disciplina1",
    "code2": "disciplina2",
},function(x){
    return x;
},

//SELECT
"   s1.code as code1,\
    s2.code as code2\
",

//FROM
"   subjects as s1\
    INNER JOIN\
    subjects as s2 ON s1.subject_id=s2.subject_id\
    where s1.code!=s2.code\
", 

"equivalenciasDisciplinas" //SAVE FILE HAS
];



var courses = [
{
    "code": "codigo",
    "name": "nome"
},function(x){
    return x;
},

//SELECT
"   courses.code as code,\
    courses.name as name\
",

"courses", //FROM
"cursos" //SAVE FILE HAS
];



////////////////////////////////////////////////////////////////////////////////
/*
On cases of data relations (necessary to "N to N" relations), its needed
to exist a special processing.
The structure must follow the previous documentation, and the function
that transform the data after load from DB must transform all elements from
query in the follow format:
[
    {
        pkeys = ["valueOfPrimaryKey1", "valueOfPrimaryKey2"]
        pkey_name: "nameOfPrimaryKeyColumn"
    },
    ...

]

where valueOfPrimaryKey1 and valueOfPrimaryKey2 represents the values of
primary keys of the models relationed. And pkey_name must be the name of
column relationed with "valueOfPrimaryKey1".

The column name of "valueOfPrimaryKey2" value is not needed because the 
Loopback API will discover automatically. 
*/

var subjects_courses_relation = [
{
    "coursecode": "cursoCod",
    "subjectcode": "disciplinaCod",
},function(x){
    x.pkeys = [x.cursoCod, x.disciplinaCod];
    delete x.cursoCod;
    delete x.disciplinaCod;
    x.pkey_name = "codigo";
    return x;
},


//SELECT
"   courses.code as coursecode,\
    subjects.code as subjectcode\
",

//FROM
"   courses_subjects\
    INNER JOIN\
    courses on courses.id=courses_subjects.course_id\
    INNER JOIN\
    subjects on subjects.id=courses_subjects.subject_id\
", 

"cursoDisciplina" //SAVE FILE HAS
];

exports.tables = [
    rooms,
    blocks,
    professors,
    departments,
    sectors,
    subjects,
    courses,
    subjects_equivalences,
    subjects_courses_relation
];


exports.connectionString = connectionString;
