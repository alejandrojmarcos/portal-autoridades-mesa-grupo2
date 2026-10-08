const charlas = require('../../datos/charlas.json');

function listarCharlas() {
  return charlas;
}

function buscarCharlaPorId(id) {
  return charlas.find((charla) => charla.id === id);
}

module.exports = { listarCharlas, buscarCharlaPorId };
