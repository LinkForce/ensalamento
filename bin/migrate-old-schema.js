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

// new_name:  This is NECESSARILY a name of an model in the Loopback schema

var connectionString = 'postgresql://login:password@localhost:5432/ensalamento';

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

"   *,\
    blocks.code as blocks_code,\
    rooms.code as code,\
    rooms.name as name,\
    blocks.name as blocks_name,\
    room_types.name as type\
",


"   rooms\
    INNER JOIN\
    blocks ON rooms.block_id = blocks.id\
    INNER JOIN\
    room_types ON room_type_id=room_types.id\
",

"salas"
];

var blocks = [
{
    "name": "nome",
    "code": "codigo",
    "size": "capacidade",
    "latitude": "latitude",
    "longitude": "longitude"
},function(x){
    x.restrita = !x.restrita;
    x.localizacao = {lat:x.latitude, lng: x.longitude};
    delete x.latitude;
    delete x.longitude;
    return x;
},
"*",
"blocks",
"blocos"
];

exports.tables = [rooms, blocks];
exports.connectionString = connectionString;
