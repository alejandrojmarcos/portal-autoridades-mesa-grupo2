const postulantesRepositorio = require('../datos/postulantesRepositorio');
const convocatoriaRepositorio = require('../datos/convocatoriaRepositorio');
const charlasServicio = require('./charlasServicio');
const ErrorAplicacion = require('./ErrorAplicacion');

function convocatoriaAbierta() {
  const { fechaCierre } = convocatoriaRepositorio.obtenerConvocatoria();
  return new Date() < new Date(fechaCierre);
}

function obtenerDatosFormulario() {
  const { fechaCierre, distritos } = convocatoriaRepositorio.obtenerConvocatoria();
  return {
    abierta: convocatoriaAbierta(),
    fechaCierre,
    distritos,
    charlas: charlasServicio.listarCharlasActivas(),
  };
}

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function validarPostulante(datos) {
  const errores = [];
  const { distritos } = convocatoriaRepositorio.obtenerConvocatoria();
  const idsCharlas = charlasServicio.listarCharlasActivas().map((charla) => charla.id);

  if (!texto(datos.nombre)) errores.push('El nombre es obligatorio.');
  if (!texto(datos.apellido)) errores.push('El apellido es obligatorio.');
  if (!/^\d{7,8}$/.test(texto(datos.dni))) errores.push('El DNI debe tener 7 u 8 números, sin puntos.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto(datos.email))) errores.push('El correo electrónico no es válido.');
  if (!distritos.includes(datos.distrito)) errores.push('Seleccioná un distrito electoral.');

  const charlasInteres = Array.isArray(datos.charlasInteres) ? datos.charlasInteres : [];
  if (charlasInteres.some((id) => !idsCharlas.includes(id))) {
    errores.push('Alguna de las charlas elegidas no está disponible.');
  }
  return errores;
}

function listarPostulantes() {
  const charlas = charlasServicio.listarCharlas();
  return postulantesRepositorio.listarPostulantes().map((postulante) => ({
    ...postulante,
    charlasInteres: postulante.charlasInteres
      .map((id) => charlas.find((charla) => charla.id === id))
      .filter(Boolean)
      .map((charla) => charla.sede.nombre),
  }));
}

function registrarPostulante(datos) {
  if (!convocatoriaAbierta()) {
    throw new ErrorAplicacion('La convocatoria está cerrada.', 409);
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
    antecedentes: texto(datos.antecedentes),
    charlasInteres: datos.charlasInteres || [],
    estado: 'Pendiente de verificación',
  });
}

module.exports = { obtenerDatosFormulario, listarPostulantes, registrarPostulante };
