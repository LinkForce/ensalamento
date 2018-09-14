module.exports = function(app) {
    var User = app.models.User;
    var Bloco = app.models.Bloco;
    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;
    
    // TODO: Create conditions and check the dev mode to seed data for testing purposes


    // Test Data
    Bloco.create([
      {"localizacao": {"lat": 0,"lng": 0},"tamanho": 0}
    ],function(err,users){
      console.log("Created a block");
    });

    User.create([
        {username: 'admin', email: 'admin@admin.com', password: '123mudar'}
    ], function(err, users) {
        if (err) throw err;
      console.log('Created users:', users);
  
      // Roles definitions

      // Define the Roles only after create initial users
      // This code needs occour in that order because the Roles
      // assignments will need initial users
      Role.create({
        name: 'admin'
      }, function(err, role) {
        if (err) throw err;
  
        console.log('Created role:', role);
  
        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: users[0].id
        }, function(err, principal) {
          if (err) throw err;
  
          console.log('Assign admin Role to initial User:', users[0].email);
        });
      });

      
    });
  };