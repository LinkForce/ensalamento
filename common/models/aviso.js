'use strict';

module.exports = function(Aviso) {
  Aviso.validatesInclusionOf('autorType', {in: ['professor', 'secretario'], message: 'autorType deve ser professor ou secretario'});
};
