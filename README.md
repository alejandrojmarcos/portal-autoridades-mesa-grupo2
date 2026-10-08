# Portal para Autoridades de Mesa - Prototipo

Ingeniería de Software I  Grupo 2

## Requisitos

Node.js 18

## Cómo probar localmente? asi:

```bash
npm install
npm start
```

Después deberia abrir en http://localhost:3000

## Qué partes tiene el prototipo

- **Charlas** (`index.html`): listado de charlas de orientación. Al elegir una, el servidor envía la dirección de la sede a la API de normalización de USIG y el mapa muestra la ubicación que devuelve. Abajo del mapa se puede buscar cualquier otra dirección.
- **Postularme** (`registro.html`): formulario de registro de postulantes.
- **Postulantes** (`postulantes.html`): listado de las postulaciones registradas.

## Estructura

```
public/          vistas (HTML, CSS y JS del navegador)
src/rutas/       endpoints de la API
src/servicios/   reglas de negocio, validaciones y consulta a USIG
src/datos/       acceso a los datos
datos/           datos de ejemplo en JSON
api/index.js     entrada para Vercel
```

Los datos de ejemplo se cargaron a mano en`datos/*.json` al iniciar. Los registros nuevos quedan en memoria y se pierden si reinicias.
