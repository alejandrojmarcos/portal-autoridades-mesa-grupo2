const express = require('express');
const path = require('path');
const charlasRutas = require('./rutas/charlasRutas');
const ubicacionRutas = require('./rutas/ubicacionRutas');
const postulantesRutas = require('./rutas/postulantesRutas');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/charlas', charlasRutas);
app.use('/api/ubicacion', ubicacionRutas);
app.use('/api/postulantes', postulantesRutas);

app.use((error, req, res, next) => {
  if (error.estadoHttp) {
    return res.status(error.estadoHttp).json({ mensaje: error.message, detalles: error.detalles });
  }
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'Los datos enviados no son válidos.' });
  }
  console.error(error);
  res.status(500).json({ mensaje: 'Ocurrió un error inesperado.' });
});

module.exports = app;
