# Mi Biblioteca Bíblica V2

## Mejoras principales

- Selector de versiones más robusto.
- El cargador valida `Content-Type` antes de ejecutar `response.json()`, evitando el error `Unexpected token <` cuando Vite devuelve `index.html`.
- Compatible con las rutas existentes del proyecto: `rvr1960`, `biblia-americas`, `Ibla` y `/data/biblia`.
- Cancelación de peticiones anteriores para evitar que una respuesta vieja reemplace el capítulo actual.
- Botones de capítulo anterior/siguiente arriba y abajo.
- Al llegar al último capítulo de un libro, `Siguiente` pasa al primer capítulo del libro siguiente; al llegar al primero, `Anterior` pasa al último del libro anterior.
- Búsqueda dentro del capítulo.
- Favoritos, copiar, compartir y lectura en voz alta.
- Control de tamaño de letra.
- Modo proyección a pantalla completa.
- En proyección: versículo anterior/siguiente y capítulo anterior/siguiente.
- Salida automática del modo proyección al pulsar `Esc` cuando el navegador abandona pantalla completa.
- Diseño responsive para PC, tablet y móvil.

## Importante sobre las versiones del ZIP recibido

El proyecto original contiene los 1,189 capítulos en `/public/data/biblia/`, pero las carpetas de versiones alternativas contienen solamente Génesis (50 capítulos):

- `rvr1960`: 50 capítulos
- `biblia-americas`: 50 capítulos
- `Ibla`: 50 capítulos

La V2 reconoce estas carpetas correctamente y no inventa capítulos que no están en los archivos. Para tener LBLA completa se deben agregar los archivos de los capítulos restantes a una fuente legal/proporcionada por el usuario.

## Instalación

```bash
npm install
npm run dev
```

Para producción:

```bash
npm run build
npm run preview
```
