const formulario = document.getElementById('form-registro');
const mensaje = document.getElementById('mensaje');

function cargarDistritos(distritos) {
  const selector = document.getElementById('distrito');
  for (const distrito of distritos) {
    selector.add(new Option(distrito, distrito));
  }
}

function cargarCharlas(charlas) {
  const contenedor = document.getElementById('charlas');
  if (charlas.length === 0) {
    contenedor.textContent = 'No hay charlas disponibles.';
    return;
  }
  contenedor.innerHTML = charlas.map((charla) => `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="${charla.id}" id="charla-${charla.id}">
      <label class="form-check-label" for="charla-${charla.id}">
        ${charla.nombre} (${charla.sede.nombre}), ${formatearFecha(charla.fecha)} ${charla.horario} hs
      </label>
    </div>`).join('');
}

function leerFormulario() {
  const datos = Object.fromEntries(new FormData(formulario));
  datos.charlasInteres = [...formulario.querySelectorAll('#charlas input:checked')].map((casilla) => Number(casilla.value));
  return datos;
}

// El partido solo se pide (y se envía) si la persona indicó que es afiliada.
function actualizarCampoPartido() {
  const esAfiliado = document.getElementById('afiliado').value === 'si';
  const partido = document.getElementById('partido');
  document.getElementById('contenedor-partido').hidden = !esAfiliado;
  partido.required = esAfiliado;
  if (!esAfiliado) partido.value = '';
}

function formatearFechaLarga(fecha) {
  return new Date(fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function textoEstadoConvocatoria(datos) {
  if (datos.abierta) {
    return `La inscripción está abierta hasta el ${formatearFechaLarga(datos.fechaCierre)}. Los campos con * son obligatorios.`;
  }
  return new Date() < new Date(datos.fechaApertura)
    ? `La inscripción abre el ${formatearFechaLarga(datos.fechaApertura)}.`
    : `La inscripción cerró el ${formatearFechaLarga(datos.fechaCierre)}.`;
}

document.getElementById('afiliado').addEventListener('change', actualizarCampoPartido);

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    const resultado = await pedirApi('/api/postulantes', { method: 'POST', body: JSON.stringify(leerFormulario()) });
    formulario.reset();
    actualizarCampoPartido();
    mostrarMensaje(mensaje, 'success',
      `Recibimos tu postulación (n.º ${resultado.id}). Estado: ${resultado.estado}. Te vamos a avisar por correo cuando la revisemos.`);
  } catch (error) {
    mostrarMensaje(mensaje, 'danger', error.mensaje, error.detalles);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

async function iniciar() {
  try {
    const datos = await pedirApi('/api/postulantes/formulario');
    cargarDistritos(datos.distritos);
    cargarCharlas(datos.charlas);
    document.getElementById('estado-convocatoria').textContent = textoEstadoConvocatoria(datos);
    if (!datos.abierta) {
      formulario.querySelectorAll('input, select, textarea, button').forEach((campo) => { campo.disabled = true; });
    }
  } catch (error) {
    mostrarMensaje(mensaje, 'danger', error.mensaje);
  }
}

iniciar();
