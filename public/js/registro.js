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
        ${charla.sede.nombre}, ${formatearFecha(charla.fecha)} ${charla.horario} hs
      </label>
    </div>`).join('');

  // Si se llega desde una charla (registro.html?charla=2), se marca como charla de interés.
  const idCharla = new URLSearchParams(location.search).get('charla');
  const casilla = idCharla && document.getElementById(`charla-${idCharla}`);
  if (casilla) casilla.checked = true;
}

function leerFormulario() {
  const datos = Object.fromEntries(new FormData(formulario));
  datos.charlasInteres = [...formulario.querySelectorAll('#charlas input:checked')].map((casilla) => Number(casilla.value));
  return datos;
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    const resultado = await pedirApi('/api/postulantes', { method: 'POST', body: JSON.stringify(leerFormulario()) });
    formulario.reset();
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
    const cierre = new Date(datos.fechaCierre).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('estado-convocatoria').textContent = datos.abierta
      ? `La inscripción está abierta hasta el ${cierre}. Los campos con * son obligatorios.`
      : `La inscripción cerró el ${cierre}.`;
    if (!datos.abierta) {
      formulario.querySelectorAll('input, select, textarea, button').forEach((campo) => { campo.disabled = true; });
    }
  } catch (error) {
    mostrarMensaje(mensaje, 'danger', error.mensaje);
  }
}

iniciar();
