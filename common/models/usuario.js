'use strict';
var app = require('../../server/server');

module.exports = function(Usuario) {

    Usuario.prototype.setRole = function(role_name, cb) {
        let usuario = this;
        app.models.Role.findOne({where:{name: role_name}}, function(err, role){
            if(err){
                return cb(err,null);
            }
            if(role ===null){
                var error = new Error('Role '+ role_name +' does not exists');
                error.statusCode = "404";
                error.code = "MODEL_NOT_FOUND";
                return cb(error,null)
            }
            usuario.getRole(function(err,actual_role){
                if(err){
                    return cb(err,null);
                }
                if(actual_role===null ){
                    role.principals.create({
                            principalType: app.models.RoleMapping.USER,
                            principalId:  usuario.id
                        }, function(error, principal) {
                                cb(error,principal);
                        });
                }else{
                    var error = new Error( "The `Usuario` instance is not valid. Details: Usuario already has a Role (value: \""+actual_role+"\");");
                    error.statusCode = "422";
                    error.name = "ValidationError";
                    error.code = "ValidationError";
                    return cb(error,null)
                }
            });
        });
     };

    Usuario.prototype.getRole = function(cb) {
        app.models.RoleMapping.findOne({where:{principalId: this.id.toString()}}, function(err, rolemapping){
            if(err || rolemapping ===null){
                return cb(err,null);
            }
            app.models.Role.findOne({where:{id: rolemapping.roleId}}, function(error, role){
                return cb(error,role.name);
            });
        });
    };

    Usuario.prototype.deleteRole = function(cb) {
        app.models.RoleMapping.destroyAll({principalId: this.id.toString()}, function(err, counter){
            return cb(err,counter);
        });
    };


    Usuario.prototype.updateRole = function(role_name,cb) {
        let usuario = this;
        app.models.Role.findOne({where:{name: role_name}}, function(err, role){
            if(err){
                return cb(err,null);
            }
            if(role ===null){
                var error = new Error('Role '+ role_name +' does not exists');
                error.statusCode = "404";
                error.code = "MODEL_NOT_FOUND";
                return cb(error,null)
            }
            app.models.RoleMapping.findOne({where:{principalId: usuario.id.toString()}}, function(err, rolemapping){
                if(err){
                    return cb(err,null);
                }
                if(rolemapping===null ){
                    role.principals.create({
                            principalType: app.models.RoleMapping.USER,
                            principalId:  usuario.id
                    }, function(error, principal) {
                            cb(error,principal);
                    });
                }else{
                    rolemapping.updateAttribute('roleId',role.id,function(error,data){
                        cb(error,data);
                    });
                }

            });
        });
    };
};
