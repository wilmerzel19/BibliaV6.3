# Mi Biblioteca Bíblica V6.1

## Himnario
- `public/data/himnos.json` usa `archivo_audio_local` y la aplicación lo reconoce automáticamente.
- Las rutas Windows `audios_himnos\\himno_001.mp3` se normalizan a `/audios_himnos/himno_001.mp3`.
- `public/data/pistas_himnos.json` contiene el manifiesto de las pistas registradas.

## Importante sobre el audio
El JSON solo guarda referencias a archivos. En la fuente recibida hay 33 referencias a MP3, pero no hay bytes MP3 dentro del JSON. Por eso V6.1 no puede fabricar/incrustar los audios que no fueron adjuntados.

Si copias los MP3 con los nombres indicados dentro de `public/audios_himnos/`, funcionarán automáticamente sin editar el JSON.

## Ejecutar
```bash
npm install
npm run dev
```
