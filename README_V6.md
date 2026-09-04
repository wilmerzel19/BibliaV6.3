# Mi Biblioteca Bíblica — V6

## Mejoras principales

### Himnario
- Corrige las rutas de pistas guardadas con `\` de Windows.
- Soporta pistas locales (`public/audios_himnos/*.mp3`) y URLs `https://`.
- Detecta errores de carga de audio y muestra un mensaje útil.
- Controles de reproducción y silencio también están disponibles durante la proyección.
- La pista no se reinicia al cambiar de diapositiva.

### Proyección de himnos
- Pantalla completa real cuando el navegador lo permite.
- Presentación optimizada para proyectores y pantallas 16:9.
- Diseño más limpio, tipografía grande y contraste alto.
- Divide automáticamente estrofas demasiado largas en varias diapositivas.
- Barra de progreso y contador de diapositivas.
- Controles que se ocultan automáticamente para dejar limpia la proyección.
- Navegación con teclado:
  - `←` / `→`: anterior / siguiente
  - `Espacio`: reproducir / pausar pista
  - `M`: silenciar / activar sonido
  - `Home`: primera diapositiva
  - `End`: última diapositiva
  - `Esc`: salir

## Pistas
El ZIP V5 recibido contenía 33 referencias a pistas en `himnos.json`, pero no
contenía ningún archivo de audio. V6 deja preparada la estructura:

`public/audios_himnos/himno_001.mp3`

Si ya tienes los MP3 en otra carpeta, cópialos a `public/audios_himnos/` respetando
los nombres indicados por `himnos.json`.

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

## Nota sobre el build
El ZIP V5 incluía `node_modules` de otro entorno. Esto puede producir errores de
Rollup/Vite al mover el ZIP entre sistemas. V6 no incluye `node_modules`; ejecuta
`npm install` en la máquina donde lo vas a utilizar.
