'use strict';
const _         = require('lodash');
const async     = require('async');
const csv       = require('fast-csv');
const { fork }      = require('child_process');
const fs        = require('fs');
const path      = require('path');
const loopback  = require('loopback');

module.exports = function(Turma) {
    Turma.validatesPresenceOf('disciplinaCod');
  Turma.remoteMethod('upload', {
    accepts: [
      { arg: 'req', type: 'object', http: { source: 'req' }},
      { arg: 'res', type: 'object', 'http': {source: 'res'}},
      { arg: 'letiveInit', type: 'date'},
      { arg: 'letiveEnd', type: 'date'}
    ],
    http: {
      verb: 'post',
      path: '/upload'
    },
   returns: { arg: 'status', type: 'string' }
  });

    Turma.upload = function(req,res, letiveInit, letiveEnd, callback) {
        var container_name = `turma-${Math.round(Date.now())}-${Math.round(Math.random() * 1000)}`;
        var Container = Turma.app.models.container;


        Container.createContainer({name:container_name},function(err,c) {
            Container.upload(req,res,{container: c.name},callback);
        });

    };
};
