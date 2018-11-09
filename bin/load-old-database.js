var path = require("path");
var fs = require("fs");


const { Client } = require('pg')

var migrate_old_schema = require(path.resolve(__dirname, "../bin/migrate-old-schema"));



// Access a table in database
// The table_name can be a specific query
function load_data_from_db(columns, table_name){
  let client = new Client({
    connectionString: migrate_old_schema.connectionString,
  });
  client.connect()
  return new Promise( (resolve, reject) => {
    client.query('SELECT '+columns+' FROM '+table_name, (err, res) => {
      if (!err) {
        resolve(res);
      }
      else {
        reject(Error("Cannot access table",table_name," on database!"));
      }
      client.end()
    });  
  });
}

  



class EnsalamentoTable {
  
  constructor(dict, mapper, columns, query, loopback_name){
    this.dict = dict;
    this.mapper = mapper;
    this.query = query;
    this.columns = columns;
    this.loopback_name = loopback_name;
    this.file_path = path.resolve(__dirname, "../bin/old-database/"+this.loopback_name+".json");
  }

  // Transform the data with the rules defined in migrate-old-schema.js
  parse_instance(row){
    var new_row = {};
    for(var old_name in row){
      if(old_name in this.dict){
        var new_name = this.dict[old_name];
        new_row[new_name] = row[old_name];
      }
    }
    return new_row;
  }

  
  get_table(){
    load_data_from_db(this.columns,this.query).then( res => {
      console.log(res);
    });
  }

  // Get the data of the table translated to an Loopback model
  get_table_from_db_parsed(){
    return new Promise( (resolve, reject) => {
      load_data_from_db(this.columns, this.query).then( res => {
        var data = [];
        for(var i in res.rows){
          var new_instance = this.parse_instance(res.rows[i]);
          data.push(this.mapper(new_instance));
        }
        resolve(data);
      });   
    });
  }

  // Load the data from DB and store in a json file
  save(){
    this.get_table_from_db_parsed().then(data =>{
      var json = JSON.stringify(data);
      
      console.log("Saving ", this.loopback_name, "into", this.file_path);
      fs.writeFile(this.file_path, json, 'utf8', () => {
        console.log("Saved ", this.loopback_name, "into", this.file_path);
      });
    });
  }


  // Load the file created with save method
  load(){
    return new Promise( (resolve, reject) => {
      fs.readFile(this.file_path, 'utf8', (err, data) => {
        if (err){
          reject(err);
        } else {
          var obj = JSON.parse(data); 
          resolve(obj);
        }
      });
    });
    
    
  }

  
}



var tables = migrate_old_schema.tables.map( schema => {
  return new EnsalamentoTable(
    schema[0],
    schema[1],
    schema[2],
    schema[3],
    schema[4]
  )
});



if(process.argv.indexOf("--save")+1  || process.argv.indexOf("-s")+1){
  for(var i in tables){
    tables[i].save();
  }
}

exports.tables = tables;


// THE JSON FILES ON DIRECTORY old-database MUST EXIST
// Run this script with --save option to create the json files. To do this,
// you have to specify the connectionString on migrate-old-schema.js

exports.tables.forEach(function(table) {
  var promise_name = "get_"+table.loopback_name;
  exports[promise_name] = table.load()
});

