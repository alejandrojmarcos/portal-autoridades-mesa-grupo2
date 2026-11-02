const ErrorAplicacion = require('./ErrorAplicacion');

const URL_USIG = 'https://servicios.usig.buenosaires.gob.ar/normalizar/';
const TIEMPO_MAXIMO_MS = 10000;
const INTENTOS = 2;

// USIG a veces tarda o falla de forma momentánea, por eso se reintenta una vez antes de informar el error.
async function consultarUsig(url) {
  let ultimoError;
  for (let intento = 1; intento <= INTENTOS; intento++) {
    try {
      const respuesta = await fetch(url, { signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS) });
      if (respuesta.ok) return respuesta.json();
      ultimoError = new ErrorAplicacion('El servicio de mapas devolvió un error.', 502);
      if (respuesta.status < 500) break;
    } catch {
      ultimoError = new ErrorAplicacion('El servicio de mapas no responde. Intentá más tarde.', 502);
    }
  }
  throw ultimoError;
}

async function obtenerUbicacion(direccion) {
  const url = `${URL_USIG}?direccion=${encodeURIComponent(direccion)}&geocodificar=TRUE`;
  const datos = await consultarUsig(url);

  // USIG puede devolver la misma calle en varios partidos; se toma la primera coincidencia.
  const encontrada = (datos.direccionesNormalizadas || []).find((d) => d.coordenadas);
  if (!encontrada) {
    throw new ErrorAplicacion('No se encontró la dirección en el servicio de mapas.', 404);
  }

  return {
    latitud: Number(encontrada.coordenadas.y),
    longitud: Number(encontrada.coordenadas.x),
    direccionNormalizada: encontrada.direccion,
  };
}

module.exports = { obtenerUbicacion };
