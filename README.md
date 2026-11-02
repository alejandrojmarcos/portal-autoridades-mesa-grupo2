# Portal para Autoridades de Mesa - Prototipo

Ingeniería de Software I - UNGS - Grupo 2

## Prototipo desplegado

Está publicado en Vercel (se despliega con GitHub Actions) y no requiere autenticación:

https://portal-autoridades-mesa.vercel.app

## Requisitos

- Node.js 18 o superior (incluye npm).
- Conexión a internet: el mapa usa la API de normalización de direcciones de USIG y los estilos se cargan desde CDN.
- No hace falta ninguna clave ni credencial.

## Cómo iniciarlo localmente

Desde la carpeta del proyecto:

```bash
npm install
npm start
```

Después se abre http://localhost:3000 en el navegador.

## Vistas del prototipo

- **Charlas** (`index.html`): listado de las charlas de orientación con su nombre, tema, fecha, horario y sede. Al elegir una, el servidor envía la dirección de la sede a la API de USIG y el mapa muestra la ubicación que devuelve. Las coordenadas no están guardadas. Abajo del mapa se puede buscar cualquier otra dirección de CABA, que es la zona que cubre USIG.
- **Postularse** (`registro.html`): formulario para postularse como autoridad de mesa. Pide distrito electoral, nombre, apellido, DNI, fecha de nacimiento, dirección actual, teléfono, correo, si ya fue autoridad de mesa, si cumplió la capacitación y si es afiliado a alguna agrupación (con el partido). Opcionalmente se pueden marcar las charlas de interés. El servidor valida cada campo y muestra los errores, o confirma el registro.

## Datos de ejemplo

- `datos/charlas.json`: tres charlas con sus sedes.
- `datos/convocatoria.json`: plazo de inscripción (fecha de apertura y de cierre) y distritos electorales.
- `datos/postulantes.json`: un postulante ya registrado, con DNI 30111222. Sirve para probar el rechazo de un DNI repetido.

La inscripción está abierta entre `fechaApertura` y `fechaCierre`, del 20/10 al 05/11, que coinciden con la primera y la última charla. Al pasar la fecha de cierre, el formulario queda cerrado automáticamente. Si al probarlo aparece cerrada, hay que cambiar esas fechas en `datos/convocatoria.json` y reiniciar el servidor.

Los datos se leen de los JSON al iniciar el servidor. Los registros nuevos quedan en memoria y se pierden al reiniciarlo.

## Estructura

```
public/          vistas (HTML, CSS y JS del navegador)
src/rutas/       endpoints de la API
src/servicios/   reglas de negocio, validaciones y consulta a USIG
src/datos/       acceso a los datos
datos/           datos de ejemplo en JSON
api/index.js     entrada para Vercel
```
