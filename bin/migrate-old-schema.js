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

var connectionString = 'postgresql://bhm15:pass@localhost:5432/ensalamento';

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




exports.tables = [
    rooms,
    blocks,
    professors,
    departments,
    sectors,
    subjects,
    courses
];

exports.connectionString = connectionString;
