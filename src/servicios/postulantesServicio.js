const postulantesRepositorio = require('../datos/postulantesRepositorio');
const convocatoriaServicio = require('./convocatoriaServicio');
const charlasServicio = require('./charlasServicio');
const ErrorAplicacion = require('./ErrorAplicacion');

function obtenerDatosFormulario() {
  return {
    abierta: convocatoriaServicio.estaAbierta(),
    ...convocatoriaServicio.obtenerPlazo(),
    distritos: convocatoriaServicio.listarDistritos(),
    charlas: charlasServicio.listarCharlas(),
  };
}

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

const SI_NO = ['si', 'no'];
// Letras (con tildes y ñ), espacios, apóstrofos y guiones.
const NOMBRE_VALIDO = /^[\p{L}][\p{L} '-]{1,49}$/u;

// Fecha AAAA-MM-DD que exista en el calendario (rechaza, por ejemplo, 30 de febrero) y no sea futura.
function fechaNacimientoValida(valor) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  if (!partes) return false;
  const [, anio, mes, dia] = partes.map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.getMonth() === mes - 1 && fecha.getDate() === dia && fecha <= new Date();
}

// Acepta +, espacios, guiones y paréntesis, con 8 a 15 dígitos en total.
function telefonoValido(valor) {
  const digitos = valor.replace(/\D/g, '');
  return /^\+?[\d\s()-]+$/.test(valor) && digitos.length >= 8 && digitos.length <= 15;
}

// Al menos una calle con letras y una altura numérica.
function direccionValida(valor) {
  return valor.length >= 5 && valor.length <= 120 && /\p{L}/u.test(valor) && /\d/.test(valor);
}

function validarPostulante(datos) {
  const errores = [];
  const distritos = convocatoriaServicio.listarDistritos();
  const idsCharlas = charlasServicio.listarCharlas().map((charla) => charla.id);

  if (!distritos.includes(datos.distrito)) errores.push('Seleccioná un distrito electoral.');
  if (!NOMBRE_VALIDO.test(texto(datos.nombre))) errores.push('Ingresá un nombre válido (solo letras, de 2 a 50 caracteres).');
  if (!NOMBRE_VALIDO.test(texto(datos.apellido))) errores.push('Ingresá un apellido válido (solo letras, de 2 a 50 caracteres).');
  if (!/^\d{7,8}$/.test(texto(datos.dni))) errores.push('El DNI debe tener 7 u 8 números, sin puntos.');
  if (!fechaNacimientoValida(texto(datos.fechaNacimiento))) errores.push('Ingresá una fecha de nacimiento válida.');
  if (!direccionValida(texto(datos.direccionActual))) errores.push('Ingresá una dirección válida, con calle y altura.');
  if (!telefonoValido(texto(datos.telefono))) errores.push('Ingresá un teléfono válido, con código de área (8 a 15 números).');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto(datos.email))) errores.push('El correo electrónico no es válido.');
  else if (texto(datos.email).length > 100) errores.push('El correo electrónico es demasiado largo.');
  if (!SI_NO.includes(datos.autoridadPrevia)) errores.push('Indicá si fuiste autoridad de mesa previamente.');
  if (!SI_NO.includes(datos.capacitacion)) errores.push('Indicá si cumpliste con la capacitación.');
  if (!SI_NO.includes(datos.afiliado)) errores.push('Indicá si sos afiliado a alguna agrupación.');
  if (datos.afiliado === 'si') {
    const partido = texto(datos.partido);
    if (!partido) errores.push('Detallá el partido político.');
    else if (partido.length < 2 || partido.length > 100) errores.push('El nombre del partido debe tener entre 2 y 100 caracteres.');
  }

  const charlasInteres = Array.isArray(datos.charlasInteres) ? datos.charlasInteres : [];
  if (charlasInteres.some((id) => !idsCharlas.includes(id))) {
    errores.push('Alguna de las charlas elegidas no está disponible.');
  }
  return errores;
}

function registrarPostulante(datos) {
  if (!convocatoriaServicio.estaAbierta()) {
    throw new ErrorAplicacion('La convocatoria no está abierta.', 409);
  }

  const errores = validarPostulante(datos);
  if (errores.length > 0) {
    throw new ErrorAplicacion('Revisá los datos ingresados.', 400, errores);
  }

  const dni = texto(datos.dni);
  if (postulantesRepositorio.buscarPostulantePorDni(dni)) {
    throw new ErrorAplicacion('Ya hay una postulación registrada con ese DNI.', 409);
  }

  return postulantesRepositorio.guardarPostulante({
    nombre: texto(datos.nombre),
    apellido: texto(datos.apellido),
    dni,
    email: texto(datos.email).toLowerCase(),
    telefono: texto(datos.telefono),
    distrito: datos.distrito,
    fechaNacimiento: texto(datos.fechaNacimiento),
    direccionActual: texto(datos.direccionActual),
    autoridadPrevia: datos.autoridadPrevia === 'si',
    capacitacion: datos.capacitacion === 'si',
    afiliado: datos.afiliado === 'si',
    partido: datos.afiliado === 'si' ? texto(datos.partido) : '',
    charlasInteres: datos.charlasInteres || [],
    estado: 'Pendiente de verificación',
  });
}

module.exports = { obtenerDatosFormulario, registrarPostulante };
