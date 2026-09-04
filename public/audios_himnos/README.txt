PISTAS DEL HIMNARIO - V6.1

El JSON contiene las rutas de las pistas y la aplicación las detecta automáticamente.

Para que el audio SUENE, los archivos MP3 deben existir físicamente en esta carpeta:

  public/audios_himnos/himno_001.mp3
  public/audios_himnos/himno_002.mp3
  ...

IMPORTANTE:
El campo archivo_audio_local del JSON NO contiene el audio; contiene solamente la ruta/nombre del archivo.
V6.1 ya reconoce archivo_audio_local, pista y audio, y convierte rutas Windows con \ en URLs web.
