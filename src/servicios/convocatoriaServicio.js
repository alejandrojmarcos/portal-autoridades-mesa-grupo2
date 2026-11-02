const convocatoriaRepositorio = require('../datos/convocatoriaRepositorio');

function obtenerPlazo() {
  const { fechaApertura, fechaCierre } = convocatoriaRepositorio.obtenerConvocatoria();
  return { fechaApertura, fechaCierre };
}

// Se evalúa en cada consulta: al pasar la fecha de cierre la convocatoria queda cerrada sin intervención manual.
function estaAbierta() {
  const { fechaApertura, fechaCierre } = obtenerPlazo();
  const ahora = new Date();
  return new Date(fechaApertura) <= ahora && ahora <= new Date(fechaCierre);
}

function listarDistritos() {
  return convocatoriaRepositorio.obtenerConvocatoria().distritos;
}

module.exports = { obtenerPlazo, estaAbierta, listarDistritos };
