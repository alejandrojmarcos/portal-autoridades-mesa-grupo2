class ErrorAplicacion extends Error {
  constructor(mensaje, estadoHttp = 400, detalles = []) {
    super(mensaje);
    this.estadoHttp = estadoHttp;
    this.detalles = detalles;
  }
}

module.exports = ErrorAplicacion;
