const listaCharlas = document.getElementById('lista-charlas');
const detalle = document.getElementById('detalle');
const mensajeMapa = document.getElementById('mensaje-mapa');
const textoDireccionUsig = document.getElementById('direccion-usig');

const mapa = L.map('mapa').setView([-34.6037, -58.3816], 11);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap',
}).addTo(mapa);
let marcador = null;

function ubicarEnMapa(ubicacion, titulo) {
  if (marcador) marcador.remove();
  marcador = L.marker([ubicacion.latitud, ubicacion.longitud]).addTo(mapa);
  const etiqueta = document.createElement('span');
  etiqueta.textContent = titulo;
  marcador.bindTooltip(etiqueta, { permanent: true, direction: 'top', offset: [-15, -10] });
  mapa.setView([ubicacion.latitud, ubicacion.longitud], 16);
  textoDireccionUsig.textContent = `Dirección según USIG: ${ubicacion.direccionNormalizada}`;
}

async function mostrarUbicacion(pedirUbicacion, titulo) {
  mensajeMapa.innerHTML = '';
  textoDireccionUsig.textContent = 'Buscando ubicación…';
  try {
    ubicarEnMapa(await pedirUbicacion(), titulo);
  } catch (error) {
    textoDireccionUsig.textContent = '';
    mostrarMensaje(mensajeMapa, 'warning', `Ubicación no disponible. ${error.mensaje}`);
  }
}

function mostrarDetalle(charla) {
  detalle.innerHTML = `
    <h2 class="h5 mb-1 text-body">${charla.nombre}</h2>
    <div class="text-body">${charla.tema}</div>
    <div class="text-body">${formatearFecha(charla.fecha)}, ${charla.horario} hs</div>
    <div>${charla.sede.nombre} · ${charla.sede.direccion}</div>`;
  mostrarUbicacion(() => pedirApi(`/api/charlas/${charla.id}/ubicacion`), charla.sede.nombre);
}

function agregarCharlaALista(charla) {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = 'list-group-item list-group-item-action';
  item.innerHTML = `
    <strong>${charla.nombre}</strong><br>
    <small>${charla.sede.nombre} · ${formatearFecha(charla.fecha)}, ${charla.horario} hs</small>`;
  item.addEventListener('click', () => {
    listaCharlas.querySelector('.active')?.classList.remove('active');
    item.classList.add('active');
    mostrarDetalle(charla);
  });
  listaCharlas.appendChild(item);
}

async function cargarCharlas() {
  try {
    const charlas = await pedirApi('/api/charlas');
    if (charlas.length === 0) {
      mostrarMensaje(document.getElementById('mensaje-charlas'), 'info', 'Todavía no hay charlas informadas.');
    }
    charlas.forEach(agregarCharlaALista);
  } catch (error) {
    mostrarMensaje(document.getElementById('mensaje-charlas'), 'danger', error.mensaje);
  }
}

document.getElementById('form-direccion').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const direccion = document.getElementById('direccion').value;
  mostrarUbicacion(() => pedirApi(`/api/ubicacion?direccion=${encodeURIComponent(direccion)}`), direccion);
});

cargarCharlas();
