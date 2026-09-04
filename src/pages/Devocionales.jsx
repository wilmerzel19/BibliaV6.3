import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Star,
  Download,
  Calendar,
  Headphones,
  X
} from "lucide-react";

export default function Devocionales() {

  const audioRef = useRef(null);

  const [audios, setAudios] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");

  const [audioActual, setAudioActual] = useState(null);

  const [reproduciendo, setReproduciendo] =
    useState(false);

  const [progreso, setProgreso] = useState(0);

  const [duracion, setDuracion] = useState(0);

  const [volumen, setVolumen] = useState(1);

  const [velocidad, setVelocidad] = useState(1);

  const [favoritos, setFavoritos] = useState(() => {

    try {

      return JSON.parse(
        localStorage.getItem(
          "devocionales_favoritos"
        ) || "[]"
      );

    } catch {

      return [];

    }

  });

  /*
  ========================================================
  CARGAR AUDIOS.JSON
  ========================================================
  */

  useEffect(() => {

    async function cargarAudios() {

      try {

        setCargando(true);
        setError("");

        const respuesta = await fetch(
          "/data/audios.json"
        );

        if (!respuesta.ok) {

          throw new Error(
            `Error HTTP ${respuesta.status}`
          );

        }

        const json = await respuesta.json();

        console.log(
          "AUDIOS JSON CARGADO:",
          json
        );

        /*
         * Aceptamos:
         *
         * [
         *   {...}
         * ]
         *
         * o:
         *
         * {
         *   "audios": [...]
         * }
         */

        let lista = [];

        if (Array.isArray(json)) {

          lista = json;

        } else if (
          Array.isArray(json.audios)
        ) {

          lista = json.audios;

        } else {

          throw new Error(
            "El JSON no contiene un arreglo de audios."
          );

        }

        setAudios(lista);

      } catch (err) {

        console.error(
          "ERROR CARGANDO AUDIOS:",
          err
        );

        setError(err.message);

      } finally {

        setCargando(false);

      }

    }

    cargarAudios();

  }, []);

  /*
  ========================================================
  BUSCADOR
  ========================================================
  */

  const resultados = useMemo(() => {

    const texto =
      busqueda
        .trim()
        .toLowerCase();

    if (!texto) {

      return audios;

    }

    return audios.filter((audio) => {

      return `
        ${audio.titulo || ""}
        ${audio.fecha || ""}
        ${audio.descripcion || ""}
      `
        .toLowerCase()
        .includes(texto);

    });

  }, [
    audios,
    busqueda
  ]);

  /*
  ========================================================
  REPRODUCIR
  ========================================================
  */

  function reproducir(audio) {

    if (!audio.audio) {

      alert(
        "Este devocional no tiene audio."
      );

      return;

    }

    setAudioActual(audio);

    setProgreso(0);

    setTimeout(() => {

      if (!audioRef.current) {
        return;
      }

      audioRef.current.src =
        audio.audio;

      audioRef.current.volume =
        volumen;

      audioRef.current.playbackRate =
        velocidad;

      audioRef.current
        .play()
        .then(() => {

          setReproduciendo(true);

        })
        .catch((error) => {

          console.error(
            "Error reproduciendo:",
            error
          );

          alert(
            "No se pudo reproducir el audio. Puede que el servidor no permita reproducción directa."
          );

        });

    }, 50);

  }

  /*
  ========================================================
  PLAY / PAUSA
  ========================================================
  */

  function togglePlay() {

    if (!audioActual) {

      if (resultados.length > 0) {

        reproducir(
          resultados[0]
        );

      }

      return;

    }

    if (!audioRef.current) {
      return;
    }

    if (reproduciendo) {

      audioRef.current.pause();

      setReproduciendo(false);

    } else {

      audioRef.current
        .play()
        .then(() => {

          setReproduciendo(true);

        });

    }

  }

  /*
  ========================================================
  TIEMPO
  ========================================================
  */

  function actualizarTiempo() {

    if (!audioRef.current) {
      return;
    }

    setProgreso(
      audioRef.current.currentTime
    );

    if (
      Number.isFinite(
        audioRef.current.duration
      )
    ) {

      setDuracion(
        audioRef.current.duration
      );

    }

  }

  /*
  ========================================================
  CAMBIAR PROGRESO
  ========================================================
  */

  function cambiarProgreso(e) {

    const valor =
      Number(e.target.value);

    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime =
      valor;

    setProgreso(valor);

  }

  /*
  ========================================================
  VOLUMEN
  ========================================================
  */

  function cambiarVolumen(e) {

    const valor =
      Number(e.target.value);

    setVolumen(valor);

    if (audioRef.current) {

      audioRef.current.volume =
        valor;

    }

  }

  /*
  ========================================================
  VELOCIDAD
  ========================================================
  */

  function cambiarVelocidad() {

    const velocidades = [
      0.75,
      1,
      1.25,
      1.5,
      2
    ];

    const indice =
      velocidades.indexOf(
        velocidad
      );

    const siguiente =
      velocidades[
        (indice + 1) %
        velocidades.length
      ];

    setVelocidad(siguiente);

    if (audioRef.current) {

      audioRef.current.playbackRate =
        siguiente;

    }

  }

  /*
  ========================================================
  SIGUIENTE
  ========================================================
  */

  function siguiente() {

    if (!audioActual) {
      return;
    }

    const indice =
      resultados.findIndex(
        (item) =>
          item === audioActual
      );

    if (
      indice >= 0 &&
      indice < resultados.length - 1
    ) {

      reproducir(
        resultados[indice + 1]
      );

    }

  }

  /*
  ========================================================
  ANTERIOR
  ========================================================
  */

  function anterior() {

    if (!audioActual) {
      return;
    }

    const indice =
      resultados.findIndex(
        (item) =>
          item === audioActual
      );

    if (indice > 0) {

      reproducir(
        resultados[indice - 1]
      );

    }

  }

  /*
  ========================================================
  CUANDO TERMINA
  ========================================================
  */

  function audioTerminado() {

    setReproduciendo(false);

    setProgreso(0);

  }

  /*
  ========================================================
  FAVORITOS
  ========================================================
  */

  function cambiarFavorito(audio) {

    const identificador =
      audio.titulo;

    let nuevos;

    if (
      favoritos.includes(
        identificador
      )
    ) {

      nuevos =
        favoritos.filter(
          (item) =>
            item !== identificador
        );

    } else {

      nuevos = [
        ...favoritos,
        identificador
      ];

    }

    setFavoritos(nuevos);

    localStorage.setItem(
      "devocionales_favoritos",
      JSON.stringify(nuevos)
    );

  }

  /*
  ========================================================
  FORMATO TIEMPO
  ========================================================
  */

  function tiempo(segundos) {

    if (
      !segundos ||
      !Number.isFinite(segundos)
    ) {

      return "00:00";

    }

    const minutos =
      Math.floor(
        segundos / 60
      );

    const segundosRestantes =
      Math.floor(
        segundos % 60
      );

    return (
      String(minutos).padStart(2, "0") +
      ":" +
      String(segundosRestantes).padStart(2, "0")
    );

  }

  /*
  ========================================================
  CARGANDO
  ========================================================
  */

  if (cargando) {

    return (
      <div className="devocionales-loading">

        <Headphones size={45} />

        <h2>
          Cargando devocionales...
        </h2>

        <p>
          Leyendo audios.json
        </p>

      </div>
    );

  }

  /*
  ========================================================
  ERROR
  ========================================================
  */

  if (error) {

    return (
      <div className="devocionales-error">

        <X size={45} />

        <h2>
          No se pudo cargar audios.json
        </h2>

        <p>
          {error}
        </p>

        <div className="error-path">

          Debe existir:

          <strong>
            public/data/audios.json
          </strong>

        </div>

        <button
          onClick={() =>
            window.location.reload()
          }
        >
          Intentar nuevamente
        </button>

      </div>
    );

  }

  /*
  ========================================================
  SIN AUDIOS
  ========================================================
  */

  if (!audios.length) {

    return (
      <div className="devocionales-loading">

        <Headphones size={45} />

        <h2>
          No hay devocionales
        </h2>

        <p>
          audios.json está vacío.
        </p>

      </div>
    );

  }

  /*
  ========================================================
  INTERFAZ
  ========================================================
  */

  return (

    <div className="devocionales-page">

      <audio
        ref={audioRef}
        onTimeUpdate={
          actualizarTiempo
        }
        onLoadedMetadata={
          actualizarTiempo
        }
        onEnded={
          audioTerminado
        }
        onPlay={() =>
          setReproduciendo(true)
        }
        onPause={() =>
          setReproduciendo(false)
        }
      />

      {/* CABECERA */}

      <div className="devocionales-header">

        <div>

          <span>
            BIBLIOTECA DIGITAL
          </span>

          <h1>
            Devocionales
          </h1>

          <p>
            Lecturas y reflexiones para escuchar.
          </p>

        </div>

        <div className="contador">

          <Headphones size={18} />

          <strong>
            {audios.length}
          </strong>

          audios

        </div>

      </div>

      {/* BUSCADOR */}

      <div className="buscador">

        <Search size={20} />

        <input
          value={busqueda}
          onChange={(e) =>
            setBusqueda(
              e.target.value
            )
          }
          placeholder="Buscar lectura..."
        />

        {busqueda && (

          <button
            onClick={() =>
              setBusqueda("")
            }
          >

            <X size={17} />

          </button>

        )}

      </div>

      {/* LISTA */}

      <div className="lista">

        {resultados.map(
          (audio, index) => {

            const favorito =
              favoritos.includes(
                audio.titulo
              );

            const activo =
              audioActual === audio;

            return (

              <div
                className={
                  `devocional-card ${
                    activo
                      ? "activo"
                      : ""
                  }`
                }
                key={
                  audio.titulo +
                  index
                }
              >

                {/* PLAY */}

                <button
                  className="play"
                  onClick={() =>
                    reproducir(audio)
                  }
                >

                  {activo &&
                  reproduciendo ? (
                    <Pause size={20} />
                  ) : (
                    <Play size={20} />
                  )}

                </button>

                {/* INFO */}

                <div className="info">

                  <h3>
                    {audio.titulo}
                  </h3>

                  {audio.fecha && (

                    <div className="fecha">

                      <Calendar
                        size={13}
                      />

                      {audio.fecha}

                    </div>

                  )}

                  {audio.descripcion && (

                    <p>
                      {audio.descripcion}
                    </p>

                  )}

                </div>

                {/* ACCIONES */}

                <div className="acciones">

                  <button
                    className={
                      favorito
                        ? "favorito activo"
                        : "favorito"
                    }
                    onClick={() =>
                      cambiarFavorito(
                        audio
                      )
                    }
                  >

                    <Star
                      size={18}
                      fill={
                        favorito
                          ? "currentColor"
                          : "none"
                      }
                    />

                  </button>

                  {audio.descarga && (

                    <a
                      href={
                        audio.descarga
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="descarga"
                    >

                      <Download
                        size={17}
                      />

                    </a>

                  )}

                </div>

              </div>

            );

          }
        )}

      </div>

      {/* REPRODUCTOR */}

      {audioActual && (

        <div className="reproductor">

          <div className="reproductor-info">

            <div className="icono">

              <Headphones
                size={20}
              />

            </div>

            <div>

              <strong>
                {audioActual.titulo}
              </strong>

              <span>
                Devocional
              </span>

            </div>

          </div>

          <div className="controles">

            <div className="botones">

              <button
                onClick={anterior}
              >
                <SkipBack
                  size={18}
                />
              </button>

              <button
                className="principal"
                onClick={togglePlay}
              >

                {reproduciendo ? (
                  <Pause
                    size={20}
                  />
                ) : (
                  <Play
                    size={20}
                  />
                )}

              </button>

              <button
                onClick={siguiente}
              >
                <SkipForward
                  size={18}
                />
              </button>

            </div>

            <div className="barra">

              <span>
                {tiempo(progreso)}
              </span>

              <input
                type="range"
                min="0"
                max={
                  duracion || 0
                }
                value={progreso}
                onChange={
                  cambiarProgreso
                }
              />

              <span>
                {tiempo(duracion)}
              </span>

            </div>

          </div>

          <div className="opciones">

            <button
              onClick={
                cambiarVelocidad
              }
            >
              {velocidad}x
            </button>

            <Volume2
              size={18}
            />

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volumen}
              onChange={
                cambiarVolumen
              }
            />

          </div>

        </div>

      )}

      <style>{`

        .devocionales-page {
          max-width: 1100px;
          margin: auto;
          padding-bottom: 120px;
        }

        .devocionales-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .devocionales-header span {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .12em;
          color: #8791a2;
        }

        .devocionales-header h1 {
          margin: 5px 0;
          font-size: 32px;
          color: #172033;
        }

        .devocionales-header p {
          margin: 0;
          color: #7b8494;
        }

        .contador {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 12px 16px;
          background: #fff;
          border: 1px solid #e3e8ef;
          border-radius: 12px;
          color: #697386;
        }

        .contador strong {
          color: #2455d6;
          font-size: 20px;
        }

        .buscador {
          height: 52px;
          background: #fff;
          border: 1px solid #dfe5ed;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
          margin-bottom: 18px;
          color: #7b8494;
        }

        .buscador input {
          flex: 1;
          border: 0;
          outline: 0;
          font-size: 14px;
        }

        .buscador button {
          border: 0;
          background: transparent;
          cursor: pointer;
        }

        .lista {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .devocional-card {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #fff;
          border: 1px solid #e3e8ef;
          border-radius: 16px;
          padding: 15px;
          transition: .2s;
        }

        .devocional-card:hover {
          border-color: #b8c9ed;
          box-shadow: 0 8px 25px rgba(30,60,120,.07);
        }

        .devocional-card.activo {
          border-color: #2455d6;
        }

        .play {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border: 0;
          border-radius: 50%;
          background: #2455d6;
          color: #fff;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .info {
          flex: 1;
          min-width: 0;
        }

        .info h3 {
          margin: 0;
          font-size: 15px;
          color: #172033;
        }

        .fecha {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 5px;
          color: #8a93a3;
          font-size: 11px;
        }

        .info p {
          white-space: pre-line;
          margin: 7px 0 0;
          color: #737d8f;
          font-size: 12px;
          line-height: 1.5;
        }

        .acciones {
          display: flex;
          gap: 6px;
        }

        .favorito,
        .descarga {
          width: 38px;
          height: 38px;
          border: 1px solid #e1e6ed;
          border-radius: 10px;
          background: #fff;
          display: grid;
          place-items: center;
          color: #7b8494;
          cursor: pointer;
          text-decoration: none;
        }

        .favorito.activo {
          color: #e4a000;
        }

        .reproductor {
          position: fixed;
          left: 230px;
          right: 0;
          bottom: 0;
          min-height: 82px;
          background: rgba(255,255,255,.97);
          border-top: 1px solid #dfe5ed;
          backdrop-filter: blur(15px);
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 12px 25px;
          z-index: 1000;
        }

        .reproductor-info {
          width: 250px;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .icono {
          width: 42px;
          height: 42px;
          border-radius: 11px;
          background: #edf3ff;
          color: #2455d6;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .reproductor-info strong {
          display: block;
          font-size: 13px;
          color: #172033;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .reproductor-info span {
          font-size: 11px;
          color: #8992a1;
        }

        .controles {
          flex: 1;
          min-width: 250px;
        }

        .botones {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
        }

        .botones button {
          border: 0;
          background: transparent;
          color: #526078;
          cursor: pointer;
        }

        .botones .principal {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #2455d6;
          color: #fff;
          display: grid;
          place-items: center;
        }

        .barra {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .barra span {
          font-size: 10px;
          color: #8a93a3;
          width: 38px;
        }

        .barra span:last-child {
          text-align: right;
        }

        .barra input {
          flex: 1;
        }

        .opciones {
          width: 180px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .opciones button {
          border: 1px solid #dfe5ed;
          background: #fff;
          border-radius: 8px;
          padding: 6px 8px;
          cursor: pointer;
        }

        .opciones input {
          width: 70px;
        }

        .devocionales-loading,
        .devocionales-error {
          min-height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #7b8494;
        }

        .devocionales-loading h2,
        .devocionales-error h2 {
          color: #172033;
        }

        .error-path {
          margin: 15px 0;
        }

        .error-path strong {
          display: block;
          margin-top: 5px;
          color: #2455d6;
        }

        .devocionales-error button {
          border: 0;
          background: #2455d6;
          color: white;
          padding: 10px 18px;
          border-radius: 9px;
          cursor: pointer;
        }

        @media(max-width:900px) {

          .reproductor {
            left: 0;
          }

          .reproductor-info {
            width: 190px;
          }

        }

        @media(max-width:650px) {

          .devocionales-header {
            align-items: flex-start;
          }

          .contador {
            display: none;
          }

          .devocional-card {
            align-items: flex-start;
          }

          .acciones {
            flex-direction: column;
          }

          .reproductor {
            padding: 10px;
            gap: 5px;
          }

          .reproductor-info {
            display: none;
          }

          .controles {
            min-width: 0;
          }

          .opciones {
            width: auto;
          }

        }

      `}</style>

    </div>

  );

}