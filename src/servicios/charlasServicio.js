const charlasRepositorio = require('../datos/charlasRepositorio');
const mapasServicio = require('./mapasServicio');
const ErrorAplicacion = require('./ErrorAplicacion');

function listarCharlas() {
  return [...charlasRepositorio.listarCharlas()].sort((a, b) => a.fecha.localeCompare(b.fecha));
}

function listarCharlasActivas() {
  return listarCharlas().filter((charla) => charla.estado !== 'Cancelada');
}

function obtenerCharla(id) {
  const charla = charlasRepositorio.buscarCharlaPorId(id);
  if (!charla) {
    throw new ErrorAplicacion('La charla no existe.', 404);
  }
  return charla;
}

// La ubicación se pide a USIG en cada consulta: las coordenadas no se guardan.
async function obtenerUbicacionDeCharla(id) {
  const charla = obtenerCharla(id);
  return mapasServicio.obtenerUbicacion(charla.sede.direccion);
}

async function buscarUbicacion(direccion) {
  if (!direccion || !direccion.trim()) {
    throw new ErrorAplicacion('Ingresá una dirección.');
  }
  return mapasServicio.obtenerUbicacion(direccion.trim());
}

module.exports = { listarCharlas, listarCharlasActivas, obtenerCharla, obtenerUbicacionDeCharla, buscarUbicacion };
