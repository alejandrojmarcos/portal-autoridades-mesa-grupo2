const express = require('express');
const charlasServicio = require('../servicios/charlasServicio');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(charlasServicio.listarCharlas());
});

router.get('/:id/ubicacion', async (req, res) => {
  res.json(await charlasServicio.obtenerUbicacionDeCharla(Number(req.params.id)));
});

module.exports = router;
