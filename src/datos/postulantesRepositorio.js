// Los datos se cargan del JSON al iniciar y los nuevos registros quedan en memoria.
const postulantes = require('../../datos/postulantes.json');

function buscarPostulantePorDni(dni) {
  return postulantes.find((postulante) => postulante.dni === dni);
}

function guardarPostulante(datos) {
  const postulante = { id: postulantes.length + 1, ...datos };
  postulantes.push(postulante);
  return postulante;
}

module.exports = { buscarPostulantePorDni, guardarPostulante };
