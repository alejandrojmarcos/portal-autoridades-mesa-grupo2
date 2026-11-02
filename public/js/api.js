async function pedirApi(url, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opciones });
  } catch {
    throw { mensaje: 'No se pudo conectar con el servidor.' };
  }
  const cuerpo = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    throw { mensaje: cuerpo.mensaje || 'Ocurrió un error.', detalles: cuerpo.detalles || [] };
  }
  return cuerpo;
}

function mostrarMensaje(contenedor, tipo, texto, detalles = []) {
  contenedor.innerHTML = '';
  const aviso = document.createElement('div');
  aviso.className = `alert alert-${tipo}`;
  aviso.textContent = texto;
  if (detalles.length > 0) {
    const lista = document.createElement('ul');
    lista.className = 'mb-0 mt-2';
    for (const detalle of detalles) {
      const item = document.createElement('li');
      item.textContent = detalle;
      lista.appendChild(item);
    }
    aviso.appendChild(lista);
  }
  contenedor.appendChild(aviso);
}

function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return new Date(anio, mes - 1, dia).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
}
