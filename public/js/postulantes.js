const tabla = document.getElementById('tabla-postulantes');

// Se usa textContent porque los datos los escribe el usuario.
function agregarFila(valores) {
  const fila = tabla.insertRow();
  for (const valor of valores) {
    fila.insertCell().textContent = valor;
  }
}

async function cargarPostulantes() {
  try {
    const postulantes = await pedirApi('/api/postulantes');
    if (postulantes.length === 0) {
      mostrarMensaje(document.getElementById('mensaje'), 'info', 'Todavía no hay postulantes registrados.');
    }
    for (const postulante of postulantes) {
      agregarFila([
        postulante.id,
        `${postulante.apellido}, ${postulante.nombre}`,
        postulante.dni,
        postulante.email,
        postulante.distrito,
        postulante.charlasInteres.join(', ') || '-',
        postulante.estado,
      ]);
    }
  } catch (error) {
    mostrarMensaje(document.getElementById('mensaje'), 'danger', error.mensaje);
  }
}

cargarPostulantes();
