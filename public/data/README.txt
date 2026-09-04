COLOCA AQUI TUS ARCHIVOS JSON.

Nombres esperados por defecto:
- biblia.json
- libros.json
- revistas.json
- estudios.json
- himnos.json
- categorias.json

Puedes cambiar estos nombres en:
src/services/dataService.js

IMPORTANTE:
La aplicación no asume una estructura rígida de tus JSON.
El servicio intenta detectar estructuras comunes y, si no puede,
muestra el JSON para que puedas adaptar el lector posteriormente.

HIMNOS.JSON - PISTA DE AUDIO (desde V5):
Cada himno puede incluir un campo "pista" con la URL o ruta de un
archivo de audio (mp3, etc). Ejemplo:

{
  "id": 1,
  "numero": 1,
  "titulo": "...",
  "autor": "...",
  "categoria": "...",
  "estrofas": [...],
  "estribillo": "...",
  "pista": "/data/audio/himno-001.mp3"
}

Si dejas "pista" vacío (""), el himno se muestra sin reproductor
de audio, tanto en el lector como en el modo de proyección.
Puedes colocar tus archivos de audio dentro de public/data/audio/
y referenciarlos como "/data/audio/nombre-archivo.mp3", o usar
una URL externa completa (https://...).
