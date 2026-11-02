const ErrorAplicacion = require('./ErrorAplicacion');

const URL_USIG = 'https://servicios.usig.buenosaires.gob.ar/normalizar/';

async function obtenerUbicacion(direccion) {
  const url = `${URL_USIG}?direccion=${encodeURIComponent(direccion)}&geocodificar=TRUE`;

  let respuesta;
  try {
    respuesta = await fetch(url, { signal: AbortSignal.timeout(8000) });
  } catch {
    throw new ErrorAplicacion('El servicio de mapas no responde. Intentá más tarde.', 502);
  }
  if (!respuesta.ok) {
    throw new ErrorAplicacion('El servicio de mapas devolvió un error.', 502);
  }

  const datos = await respuesta.json();
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
