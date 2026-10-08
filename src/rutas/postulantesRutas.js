const express = require('express');
const postulantesServicio = require('../servicios/postulantesServicio');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(postulantesServicio.listarPostulantes());
});

router.get('/formulario', (req, res) => {
  res.json(postulantesServicio.obtenerDatosFormulario());
});

router.post('/', (req, res) => {
  const postulante = postulantesServicio.registrarPostulante(req.body || {});
  res.status(201).json({ id: postulante.id, estado: postulante.estado });
});

module.exports = router;
