const express = require('express');
const charlasServicio = require('../servicios/charlasServicio');

const router = express.Router();

router.get('/', async (req, res) => {
  res.json(await charlasServicio.buscarUbicacion(req.query.direccion));
});

module.exports = router;
