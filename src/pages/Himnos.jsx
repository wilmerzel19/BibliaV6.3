import { useMemo, useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Maximize,
  Search,
  Star,
  Music2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X
} from "lucide-react";


/* Convierte las rutas guardadas en el JSON a URLs válidas para el navegador.
   Windows usa "\" pero las URLs web deben usar "/". */
function resolverPista(valor) {
  if (typeof valor !== "string") return "";
  const limpio = valor.trim();
  if (!limpio) return "";
  if (/^(https?:|blob:|data:)/i.test(limpio)) return limpio;

  const url = limpio.replace(/\\/g, "/").replace(/^\.?\//, "");
  return `/${url}`;
}

function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[¡!¿?.,;:]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function numeroAudio(titulo) {
  const match = String(titulo || "").match(/^\s*(\d+)\s*-/);
  return match ? Number(match[1]) : null;
}

function tituloAudio(titulo) {
  return normalizarTexto(String(titulo || "").replace(/^\s*\d+\s*-\s*/, "").replace(/\s*\([^)]*\)\s*$/, ""));
}

function resolverAudioHimno(himno, audios) {
  const pistaLocal = resolverPista(himno?.pista);
  if (!Array.isArray(audios) || !audios.length) return pistaLocal;

  const numero = Number(himno?.numero);
  if (!Number.isFinite(numero)) return pistaLocal;

  const candidatos = audios.filter((audio) =>
    numeroAudio(audio?.titulo) === numero && typeof audio?.url_audio === "string" && audio.url_audio.trim()
  );

  if (!candidatos.length) return pistaLocal;

  const titulo = normalizarTexto(himno?.titulo);
  const exacto = candidatos.find((audio) => tituloAudio(audio.titulo) === titulo);
  if (exacto) return exacto.url_audio.trim();

  // Si hay varias versiones (por ejemplo, Mi/Re/La), preferimos la versión sin tonalidad.
  const sinTonalidad = candidatos.find((audio) => !/\([^)]*\)\s*$/.test(String(audio.titulo || "")));
  return (sinTonalidad || candidatos[0]).url_audio.trim() || pistaLocal;
}

export default function Himnos({ data, audios = [] }) {
  /*
   * =====================================================
   * LEER EL JSON
   * =====================================================
   *
   * Tu JSON tiene:
   *
   * {
   *   "himnos": [...]
   * }
   *
   * Por eso usamos data.himnos
   */

  const himnos = useMemo(() => {
    if (!data) return [];

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.himnos)) {
      return data.himnos;
    }

    return [];
  }, [data]);

  const himnosConAudio = useMemo(() =>
    himnos.map((himno) => ({
      ...himno,
      pista: resolverAudioHimno(himno, audios) || himno.pista || ""
    })),
    [himnos, audios]
  );

  const [busqueda, setBusqueda] = useState("");
  const [himnoSeleccionado, setHimnoSeleccionado] = useState(null);
  const [presentando, setPresentando] = useState(false);
  const [diapositiva, setDiapositiva] = useState(0);

  const [favoritos, setFavoritos] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("himnos_favoritos") || "[]"
      );
    } catch {
      return [];
    }
  });

  /*
   * =====================================================
   * BUSCADOR
   * =====================================================
   */

  const resultados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return himnosConAudio;
    }

    return himnosConAudio.filter((himno) => {
      const numero = String(himno.numero || "");
      const titulo = String(himno.titulo || "");
      const autor = String(himno.autor || "");
      const categoria = String(himno.categoria || "");

      const letras = Array.isArray(himno.estrofas)
        ? himno.estrofas
            .map((e) => e.texto || "")
            .join(" ")
        : "";

      const coro = himno.estribillo || "";

      const contenido = `
        ${numero}
        ${titulo}
        ${autor}
        ${categoria}
        ${letras}
        ${coro}
      `.toLowerCase();

      return contenido.includes(texto);
    });
  }, [himnos, busqueda]);

  /*
   * =====================================================
   * SI NO HAY HIMNOS
   * =====================================================
   */

  if (!himnos.length) {
    return (
      <div className="himnos-empty">

        <Music2 size={50} />

        <h2>No hay himnos</h2>

        <p>
          No se encontraron himnos en el archivo JSON.
        </p>

        <code>
          public/data/himnos.json
        </code>

      </div>
    );
  }

  /*
   * =====================================================
   * LECTOR
   * =====================================================
   */

  if (himnoSeleccionado && !presentando) {
    return (
      <LectorHimno
        himno={himnoSeleccionado}
        onBack={() => setHimnoSeleccionado(null)}
        onPresentar={() => {
          // Intentamos entrar a pantalla completa dentro del clic del usuario,
          // que es cuando el navegador permite la API con mayor fiabilidad.
          document.documentElement.requestFullscreen?.().catch(() => {});
          setDiapositiva(0);
          setPresentando(true);
        }}
        favoritos={favoritos}
        setFavoritos={setFavoritos}
      />
    );
  }

  /*
   * =====================================================
   * PRESENTACIÓN
   * =====================================================
   */

  if (himnoSeleccionado && presentando) {
    return (
      <PresentacionHimno
        himno={himnoSeleccionado}
        diapositiva={diapositiva}
        setDiapositiva={setDiapositiva}
        onClose={() => setPresentando(false)}
      />
    );
  }

  /*
   * =====================================================
   * LISTA DE HIMNOS
   * =====================================================
   */

  return (
    <div className="himnos-page">

      {/* CABECERA */}

      <div className="himnos-header">

        <div>
          <span className="eyebrow">
            BIBLIOTECA DIGITAL
          </span>

          <h2>
            Himnos
          </h2>

          <p>
            Explora y lee tus himnos.
          </p>
        </div>

        <div className="himnos-total">

          <Music2 size={18} />

          <strong>
            {himnos.length}
          </strong>

          <span>
            himnos
          </span>

        </div>

      </div>

      {/* BUSCADOR */}

      <div className="himnos-search">

        <Search size={20} />

        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar himno por número, título o contenido..."
        />

        {busqueda && (
          <button
            className="clear-search"
            onClick={() => setBusqueda("")}
          >
            <X size={17} />
          </button>
        )}

      </div>

      {/* LISTA */}

      <div className="himnos-list">

        {resultados.map((himno) => {

          const numero = himno.numero ?? "";
          const titulo = himno.titulo ?? "Sin título";
          const categoria = himno.categoria ?? "Himno";
          const tienePista = typeof himno.pista === "string" && himno.pista.trim() !== "";

          return (
            <button
              key={himno.id}
              className="himno-card"
              onClick={() =>
                setHimnoSeleccionado(himno)
              }
            >

              <div className="himno-number">
                {String(numero).padStart(2, "0")}
              </div>

              <div className="himno-info">

                <h3>
                  {titulo}
                </h3>

                <span>
                  {categoria}
                  {tienePista && (
                    <em className="himno-pista-badge">
                      <Music2 size={11} /> pista
                    </em>
                  )}
                </span>

              </div>

              <div className="himno-arrow">
                →
              </div>

            </button>
          );
        })}

      </div>

      {/* SIN RESULTADOS */}

      {!resultados.length && (
        <div className="himnos-empty">

          <Search size={35} />

          <h3>
            No encontramos el himno
          </h3>

          <p>
            Prueba con otro número o palabra.
          </p>

        </div>
      )}

      <style>{`

        .himnos-page {
          max-width: 1100px;
          margin: auto;
        }

        .himnos-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .eyebrow {
          display: block;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .12em;
          color: #8791a2;
        }

        .himnos-header h2 {
          margin: 5px 0;
          font-size: 32px;
          color: #172033;
        }

        .himnos-header p {
          margin: 0;
          color: #7b8494;
        }

        .himnos-total {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 12px 16px;
          border-radius: 12px;
          background: #fff;
          border: 1px solid #e5e9ef;
          color: #667085;
        }

        .himnos-total strong {
          color: #1d4ed8;
          font-size: 20px;
        }

        .himnos-search {
          height: 52px;
          background: #fff;
          border: 1px solid #dfe5ed;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
          color: #7b8494;
          margin-bottom: 18px;
        }

        .himnos-search input {
          flex: 1;
          border: 0;
          outline: 0;
          background: transparent;
          color: #172033;
          font-size: 14px;
        }

        .clear-search {
          border: 0;
          background: transparent;
          color: #777;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .himnos-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .himno-card {
          width: 100%;
          border: 1px solid #e5e9ef;
          background: #fff;
          border-radius: 15px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 15px;
          text-align: left;
          cursor: pointer;
          transition: .18s ease;
        }

        .himno-card:hover {
          transform: translateX(3px);
          border-color: #b7c9f4;
          box-shadow: 0 8px 25px rgba(30,60,120,.07);
        }

        .himno-number {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #edf3ff;
          color: #1d4ed8;
          font-weight: 800;
          font-size: 15px;
          flex-shrink: 0;
        }

        .himno-info {
          flex: 1;
        }

        .himno-info h3 {
          margin: 0 0 5px;
          color: #172033;
          font-size: 15px;
        }

        .himno-info span {
          color: #8a93a3;
          font-size: 12px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .himno-pista-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-style: normal;
          background: #edf3ff;
          color: #1d4ed8;
          padding: 2px 7px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 800;
        }

        .himno-arrow {
          color: #1d4ed8;
          font-size: 20px;
        }

        .himnos-empty {
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #7b8494;
        }

        .himnos-empty h2,
        .himnos-empty h3 {
          color: #172033;
        }

        .himnos-empty code {
          background: #eef2f7;
          padding: 8px 12px;
          border-radius: 8px;
        }

        @media(max-width:600px) {

          .himnos-header {
            align-items: flex-start;
          }

          .himnos-total {
            display: none;
          }

          .himnos-header h2 {
            font-size: 27px;
          }

        }

      `}</style>

    </div>
  );
}


/*
===========================================================
LECTOR DEL HIMNO
===========================================================
*/

function LectorHimno({
  himno,
  onBack,
  onPresentar,
  favoritos,
  setFavoritos
}) {

  const numero = himno.numero;
  const titulo = himno.titulo;
  const autor = himno.autor;
  const categoria = himno.categoria;

  /*
   * AQUÍ LEEMOS DIRECTAMENTE:
   *
   * himno.estrofas
   */

  const estrofas = Array.isArray(himno.estrofas)
    ? himno.estrofas
    : [];

  /*
   * Y DIRECTAMENTE:
   *
   * himno.estribillo
   */

  const estribillo =
    typeof himno.estribillo === "string"
      ? himno.estribillo
      : "";

  const pista = resolverPista(himno.pista);

  /*
   * ORDEN DE LECTURA:
   * Estrofa 1, CORO (en medio), y luego el resto de las estrofas.
   */


  const esFavorito = favoritos.includes(himno.id);

  const [reproduciendo, setReproduciendo] = useState(false);
  const audioRef = useRef(null);

  function alternarAudio() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) { el.play(); setReproduciendo(true); }
    else { el.pause(); setReproduciendo(false); }
  }

  useEffect(() => {
    setReproduciendo(false);
  }, [himno.id]);

  /*
   * =====================================================
   * FAVORITO
   * =====================================================
   */

  function cambiarFavorito() {

    let nuevosFavoritos;

    if (favoritos.includes(himno.id)) {

      nuevosFavoritos =
        favoritos.filter(
          (id) => id !== himno.id
        );

    } else {

      nuevosFavoritos = [
        ...favoritos,
        himno.id
      ];

    }

    setFavoritos(nuevosFavoritos);

    localStorage.setItem(
      "himnos_favoritos",
      JSON.stringify(nuevosFavoritos)
    );
  }

  /*
   * =====================================================
   * COPIAR HIMNO COMPLETO
   * =====================================================
   */

  async function copiarHimno() {

    let texto =
      `${numero}. ${titulo}\n\n`;

    estrofas.forEach((estrofa) => {
      texto += `${estrofa.numero}. ${estrofa.texto}\n\n`;
      if (estribillo) texto += `CORO\n${estribillo}\n\n`;
    });

    try {

      await navigator.clipboard.writeText(texto);

      alert("Himno copiado");

    } catch {

      console.log(texto);

    }
  }

  /*
   * =====================================================
   * COPIAR ESTROFA
   * =====================================================
   */

  async function copiarEstrofa(texto) {

    try {

      await navigator.clipboard.writeText(texto);

      alert("Estrofa copiada");

    } catch {

      console.log(texto);

    }
  }

  return (
    <div className="lector-himno">

      {/* BARRA SUPERIOR */}

      <div className="lector-top">

        <button
          className="back-btn"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Volver al himnario
        </button>

        <div className="lector-actions">

          <button
            className={
              `reader-btn ${
                esFavorito
                  ? "favorite-active"
                  : ""
              }`
            }
            onClick={cambiarFavorito}
            title="Favorito"
          >
            <Star
              size={18}
              fill={
                esFavorito
                  ? "currentColor"
                  : "none"
              }
            />
          </button>

          <button
            className="reader-btn"
            onClick={copiarHimno}
            title="Copiar himno"
          >
            <Copy size={18} />
          </button>

          <button
            className="primary"
            onClick={onPresentar}
          >
            <Maximize size={17} />
            Presentar
          </button>

        </div>

      </div>

      {/* PISTA DE ACOMPAÑAMIENTO */}

      {pista && (
        <div className="himno-pista">
          <button className="pista-toggle" onClick={alternarAudio}>
            {reproduciendo ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <div className="pista-info">
            <strong>Pista de acompañamiento</strong>
            <span>{titulo}</span>
          </div>
          <audio
            ref={audioRef}
            src={pista}
            onEnded={() => setReproduciendo(false)}
            onPause={() => setReproduciendo(false)}
            onPlay={() => setReproduciendo(true)}
            controls
            preload="none"
          />
        </div>
      )}

      {/* HIMNO */}

      <article className="himno-reader">

        {/* ENCABEZADO */}

        <header className="himno-title">

          <span className="himno-big-number">
            {String(numero).padStart(2, "0")}
          </span>

          <div>

            <span className="eyebrow">
              {categoria}
            </span>

            <h1>
              {titulo}
            </h1>

            {autor && (
              <p>
                {autor}
              </p>
            )}

          </div>

        </header>

        {/* CONTENIDO */}

        <div className="himno-content">

          {/* ESTROFAS + CORO: si existe coro, aparece después de CADA estrofa */}

          {estrofas.map((estrofa) => (
            <div key={estrofa.numero}>
              <section className="estrofa">
                <div className="estrofa-number">
                  {estrofa.numero}
                </div>

                <div className="estrofa-body">
                  <p>{estrofa.texto}</p>

                  <button
                    className="copy-verse"
                    onClick={() => copiarEstrofa(estrofa.texto)}
                  >
                    <Copy size={14} />
                    Copiar estrofa
                  </button>
                </div>
              </section>

              {estribillo && (
                <section className="coro">
                  <div className="coro-title">CORO</div>
                  <p>{estribillo}</p>

                  <button
                    className="copy-verse"
                    onClick={() => copiarEstrofa(estribillo)}
                  >
                    <Copy size={14} />
                    Copiar coro
                  </button>
                </section>
              )}
            </div>
          ))}

        </div>

      </article>

      <style>{`

        .lector-himno {
          max-width: 950px;
          margin: auto;
        }

        .lector-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 0;
          background: transparent;
          color: #1d4ed8;
          font-weight: 700;
          cursor: pointer;
        }

        .lector-actions {
          display: flex;
          gap: 7px;
        }

        .reader-btn {
          width: 40px;
          height: 40px;
          border: 1px solid #dfe5ed;
          background: #fff;
          border-radius: 10px;
          display: grid;
          place-items: center;
          color: #657083;
          cursor: pointer;
        }

        .reader-btn:hover {
          color: #1d4ed8;
          border-color: #b9c9ed;
        }

        .favorite-active {
          color: #e4a000;
        }

        .primary {
          border: 0;
          background: #2455d6;
          color: #fff;
          padding: 0 16px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          font-weight: 600;
        }

        .himno-reader {
          background: #fff;
          border: 1px solid #e4e8ef;
          border-radius: 22px;
          overflow: hidden;
        }

        .himno-pista {
          background: #0f1f45;
          border-radius: 16px;
          padding: 14px 16px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .pista-toggle {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border: 0;
          border-radius: 50%;
          background: #fff;
          color: #0f1f45;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .pista-info {
          display: flex;
          flex-direction: column;
          color: #fff;
          margin-right: auto;
        }

        .pista-info strong {
          font-size: 12px;
          letter-spacing: .04em;
        }

        .pista-info span {
          font-size: 11px;
          color: #a9bdec;
          margin-top: 2px;
        }

        .himno-pista audio {
          height: 34px;
          max-width: 260px;
          flex: 1;
          min-width: 180px;
        }

        @media(max-width:600px) {
          .himno-pista audio {
            max-width: none;
            width: 100%;
          }
        }

        .himno-title {
          padding: 40px;
          background: linear-gradient(
            135deg,
            #173b86,
            #2860df
          );
          color: #fff;
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .himno-big-number {
          font-size: 55px;
          font-weight: 900;
          opacity: .35;
          line-height: 1;
        }

        .himno-title h1 {
          margin: 6px 0;
          font-size: 32px;
        }

        .himno-title p {
          margin: 0;
          color: #d8e5ff;
        }

        .himno-content {
          padding: 38px 45px;
        }

        .estrofa {
          display: grid;
          grid-template-columns: 40px 1fr;
          gap: 20px;
          padding: 28px 0;
          border-bottom: 1px solid #edf0f4;
        }

        .estrofa-number {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: #edf3ff;
          color: #1d4ed8;
          display: grid;
          place-items: center;
          font-weight: 800;
        }

        .estrofa-body p {
          margin: 0;
          white-space: pre-line;
          font-size: 19px;
          line-height: 1.9;
          color: #263247;
        }

        .copy-verse {
          margin-top: 12px;
          border: 0;
          background: transparent;
          color: #8b94a4;
          font-size: 12px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }

        .copy-verse:hover {
          color: #1d4ed8;
        }

        .coro {
          margin-top: 30px;
          padding: 25px;
          background: #f1f5ff;
          border-left: 4px solid #1d4ed8;
          border-radius: 0 14px 14px 0;
        }

        .coro-title {
          color: #1d4ed8;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .12em;
          margin-bottom: 10px;
        }

        .coro p {
          white-space: pre-line;
          margin: 0;
          font-size: 19px;
          line-height: 1.9;
          color: #263247;
        }

        @media(max-width:650px) {

          .lector-top {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }

          .lector-actions {
            width: 100%;
          }

          .lector-actions .primary {
            flex: 1;
            justify-content: center;
          }

          .himno-title {
            padding: 28px 22px;
          }

          .himno-big-number {
            font-size: 38px;
          }

          .himno-title h1 {
            font-size: 25px;
          }

          .himno-content {
            padding: 25px 20px;
          }

          .estrofa {
            grid-template-columns: 30px 1fr;
            gap: 12px;
          }

          .estrofa-body p,
          .coro p {
            font-size: 17px;
          }

        }

      `}</style>

    </div>
  );
}


/*
===========================================================
MODO PRESENTACIÓN
===========================================================
*/

function PresentacionHimno({
  himno,
  diapositiva,
  setDiapositiva,
  onClose
}) {
  const numero = himno.numero;
  const titulo = himno.titulo || "Himno";
  const estrofas = Array.isArray(himno.estrofas) ? himno.estrofas : [];
  const estribillo = typeof himno.estribillo === "string" ? himno.estribillo : "";
  const pista = resolverPista(himno.pista);

  const audioRef = useRef(null);
  const presentationRef = useRef(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [silenciado, setSilenciado] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [controlesVisibles, setControlesVisibles] = useState(true);
  const [enPantallaCompleta, setEnPantallaCompleta] = useState(
    Boolean(document.fullscreenElement)
  );

  // Divide textos demasiado largos para que nunca se desborden en la pantalla.
  const dividirTexto = (texto) => {
    const lineas = String(texto || "").split(/\r?\n/);
    const partes = [];
    let actual = [];
    let caracteres = 0;

    for (const linea of lineas) {
      const siguiente = caracteres + linea.length;
      if (actual.length >= 8 || (actual.length > 0 && siguiente > 360)) {
        partes.push(actual.join("\n"));
        actual = [];
        caracteres = 0;
      }
      actual.push(linea);
      caracteres += linea.length;
    }

    if (actual.length) partes.push(actual.join("\n"));
    return partes.length ? partes : [""];
  };

  const slides = useMemo(() => {
    const salida = [
      { tipo: "titulo", contenido: titulo }
    ];

    estrofas.forEach((estrofa) => {
      dividirTexto(estrofa.texto).forEach((parte, i, arr) => {
        salida.push({
          tipo: "estrofa",
          numero: estrofa.numero,
          parte: arr.length > 1 ? `${i + 1}/${arr.length}` : "",
          contenido: parte
        });
      });

      // V6.3: si existe coro, se muestra después de CADA estrofa.
      if (estribillo) {
        dividirTexto(estribillo).forEach((parte, i, arr) => {
          salida.push({
            tipo: "coro",
            parte: arr.length > 1 ? `${i + 1}/${arr.length}` : "",
            contenido: parte
          });
        });
      }
    });

    return salida;
  }, [estrofas, estribillo, titulo]);

  const actual = slides[Math.min(diapositiva, slides.length - 1)] || {
    tipo: "titulo",
    contenido: titulo
  };

  const siguiente = () =>
    setDiapositiva((v) => Math.min(slides.length - 1, v + 1));

  const anterior = () =>
    setDiapositiva((v) => Math.max(0, v - 1));

  const entrarFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await presentationRef.current?.requestFullscreen?.();
      }
    } catch {
      // Algunos navegadores bloquean fullscreen; la presentación sigue funcionando.
    }
  };

  useEffect(() => {
    presentationRef.current?.focus();

    const sincronizarFullscreen = () =>
      setEnPantallaCompleta(Boolean(document.fullscreenElement));

    document.addEventListener("fullscreenchange", sincronizarFullscreen);
    sincronizarFullscreen();

    return () =>
      document.removeEventListener("fullscreenchange", sincronizarFullscreen);
  }, []);

  useEffect(() => {
    const ocultar = () => {
      setControlesVisibles(true);
      clearTimeout(window.__himnoControlsTimer);
      window.__himnoControlsTimer = setTimeout(
        () => setControlesVisibles(false),
        2800
      );
    };

    ocultar();
    window.addEventListener("mousemove", ocultar);
    window.addEventListener("touchstart", ocultar);
    return () => {
      window.removeEventListener("mousemove", ocultar);
      window.removeEventListener("touchstart", ocultar);
      clearTimeout(window.__himnoControlsTimer);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (["ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        if (e.key === " ") alternarAudio();
        else siguiente();
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        anterior();
      } else if (e.key === "Home") {
        e.preventDefault();
        setDiapositiva(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setDiapositiva(slides.length - 1);
      } else if (e.key.toLowerCase() === "m") {
        alternarSilencio();
      } else if (e.key === "Escape") {
        cerrar();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!pista || !audioRef.current) return;
    const el = audioRef.current;
    el.pause();
    el.currentTime = 0;
    setReproduciendo(false);
    setAudioError(false);
  }, [pista, himno.id]);

  function alternarAudio() {
    const el = audioRef.current;
    if (!el || audioError) return;

    if (el.paused) {
      el.play()
        .then(() => setReproduciendo(true))
        .catch(() => setReproduciendo(false));
    } else {
      el.pause();
      setReproduciendo(false);
    }
  }

  function alternarSilencio() {
    const el = audioRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setSilenciado(el.muted);
  }

  function cerrar() {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    onClose();
  }

  const lineas = actual.contenido.split(/\r?\n/).filter(Boolean).length;
  const tamano = lineas >= 8 ? "compact" : lineas >= 5 ? "medium" : "large";

  return (
    <div
      ref={presentationRef}
      className="himno-presentacion-v6"
      tabIndex={0}
      onClick={(e) => {
        if (e.target.closest("button")) return;
        const mitad = window.innerWidth / 2;
        if (e.clientX > mitad) siguiente();
        else anterior();
      }}
    >
      {pista && (
        <audio
          ref={audioRef}
          src={pista}
          preload="metadata"
          onPlay={() => setReproduciendo(true)}
          onPause={() => setReproduciendo(false)}
          onEnded={() => setReproduciendo(false)}
          onError={() => {
            setAudioError(true);
            setReproduciendo(false);
          }}
        />
      )}

      <div className={`v6-top ${controlesVisibles ? "visible" : ""}`}>
        <div className="v6-brand">
          <Music2 size={18} />
          <span>CELEBREMOS SU GLORIA</span>
        </div>

        <div className="v6-counter">
          {String(diapositiva + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>

        <div className="v6-top-right">
          {!enPantallaCompleta && (
            <button
              className="v6-fullscreen"
              onClick={entrarFullscreen}
              title="Pantalla completa"
            >
              <Maximize size={18} />
            </button>
          )}
          <button className="v6-close" onClick={cerrar} title="Salir (Esc)">
            <X size={22} />
          </button>
        </div>
      </div>

      <main className={`v6-slide v6-${actual.tipo} v6-${tamano}`} key={diapositiva}>
        {actual.tipo === "titulo" ? (
          <>
            <div className="v6-kicker">HIMNO {numero}</div>
            <h1>{actual.contenido}</h1>
            <div className="v6-title-line" />
            <p className="v6-hint">Preparados para cantar juntos</p>
          </>
        ) : (
          <>
            <div className="v6-kicker">
              {actual.tipo === "coro" ? "CORO" : `ESTROFA ${actual.numero}`}
              {actual.parte && <span> · {actual.parte}</span>}
            </div>
            <p>{actual.contenido}</p>
          </>
        )}
      </main>

      <div className={`v6-bottom ${controlesVisibles ? "visible" : ""}`}>
        <div className="v6-progress">
          <span style={{ width: `${((diapositiva + 1) / slides.length) * 100}%` }} />
        </div>

        <div className="v6-controls">
          <button onClick={anterior} disabled={diapositiva === 0} title="Anterior">
            <ChevronLeft />
          </button>

          {pista && (
            <button
              onClick={alternarAudio}
              className={reproduciendo ? "active" : ""}
              disabled={audioError}
              title={audioError ? "No se encontró el archivo de audio" : (reproduciendo ? "Pausar pista" : "Reproducir pista")}
            >
              {reproduciendo ? <Pause /> : <Play />}
            </button>
          )}

          {pista && (
            <button onClick={alternarSilencio} title={silenciado ? "Activar sonido (M)" : "Silenciar (M)"}>
              {silenciado ? <VolumeX /> : <Volume2 />}
            </button>
          )}

          <button onClick={siguiente} disabled={diapositiva === slides.length - 1} title="Siguiente">
            <ChevronRight />
          </button>
        </div>

        <div className="v6-help">
          ← → cambiar · ESPACIO pista · M silencio · ESC salir
        </div>

        {audioError && (
          <div className="v6-audio-error">
            No se encontró la pista de este himno. Revisa <b>public/audios_himnos/</b> y el nombre indicado en <b>himnos.json</b>.
          </div>
        )}
      </div>

      <style>{`
        .himno-presentacion-v6 {
          position: fixed;
          inset: 0;
          z-index: 99999;
          overflow: hidden;
          outline: none;
          color: #fff;
          background:
            radial-gradient(circle at 78% 12%, rgba(47,100,220,.38), transparent 34%),
            radial-gradient(circle at 18% 82%, rgba(20,76,180,.24), transparent 30%),
            linear-gradient(135deg, #030817 0%, #07142d 48%, #02050d 100%);
          display: grid;
          place-items: center;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .himno-presentacion-v6::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
        }

        .v6-top, .v6-bottom {
          position: fixed;
          left: 0;
          right: 0;
          z-index: 5;
          transition: opacity .35s ease, transform .35s ease;
          opacity: 0;
          pointer-events: none;
        }
        .v6-top.visible, .v6-bottom.visible {
          opacity: 1;
          pointer-events: auto;
        }
        .v6-top {
          top: 0;
          padding: 22px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(#020713aa, transparent);
        }
        .v6-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .18em;
          color: #cbd9f7;
        }
        .v6-counter {
          font-variant-numeric: tabular-nums;
          font-size: 12px;
          color: #9eafd1;
          letter-spacing: .12em;
        }
        .v6-top-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .v6-fullscreen {
          width: 42px;
          height: 42px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 12px;
          background: rgba(255,255,255,.07);
          color: #fff;
          display: grid;
          place-items: center;
          cursor: pointer;
        }
        .v6-fullscreen:hover { background: rgba(255,255,255,.15); }
        .v6-close {
          width: 42px;
          height: 42px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 12px;
          background: rgba(255,255,255,.07);
          color: #fff;
          display: grid;
          place-items: center;
          cursor: pointer;
        }
        .v6-close:hover { background: rgba(255,255,255,.15); }

        .v6-slide {
          position: relative;
          z-index: 2;
          width: min(1450px, 90vw);
          max-height: 82vh;
          text-align: center;
          animation: v6-in .35s ease both;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        @keyframes v6-in {
          from { opacity: 0; transform: translateY(12px) scale(.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .v6-kicker {
          color: #9dbaff;
          font-size: clamp(11px, 1vw, 15px);
          font-weight: 900;
          letter-spacing: .28em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .v6-kicker span { color: #7185aa; }
        .v6-slide h1 {
          margin: 0;
          max-width: 1100px;
          font-size: clamp(44px, 7vw, 108px);
          line-height: 1.08;
          letter-spacing: -.035em;
          text-wrap: balance;
          text-shadow: 0 10px 50px rgba(0,0,0,.35);
        }
        .v6-title-line {
          width: min(170px, 22vw);
          height: 3px;
          margin: 34px auto 20px;
          border-radius: 99px;
          background: #7fa7ff;
          box-shadow: 0 0 28px rgba(127,167,255,.45);
        }
        .v6-hint {
          margin: 0;
          color: #7e8fae;
          font-size: 12px;
          letter-spacing: .1em;
        }
        .v6-slide p {
          margin: 0;
          max-width: 1320px;
          white-space: pre-line;
          font-weight: 600;
          line-height: 1.35;
          letter-spacing: .005em;
          text-shadow: 0 8px 35px rgba(0,0,0,.45);
        }
        .v6-large p { font-size: clamp(32px, 4.2vw, 68px); }
        .v6-medium p { font-size: clamp(28px, 3.45vw, 55px); }
        .v6-compact p { font-size: clamp(24px, 2.75vw, 45px); }

        .v6-bottom {
          bottom: 0;
          padding: 0 28px 20px;
          background: linear-gradient(transparent, #020713dd);
        }
        .v6-progress {
          height: 3px;
          background: rgba(255,255,255,.12);
          border-radius: 99px;
          overflow: hidden;
        }
        .v6-progress span {
          display: block;
          height: 100%;
          background: #87aaff;
          transition: width .25s ease;
        }
        .v6-controls {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 12px;
        }
        .v6-controls button {
          width: 43px;
          height: 43px;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 12px;
          background: rgba(255,255,255,.07);
          color: #fff;
          display: grid;
          place-items: center;
          cursor: pointer;
        }
        .v6-controls button:hover, .v6-controls button.active {
          background: rgba(126,164,255,.2);
          border-color: rgba(126,164,255,.45);
        }
        .v6-controls button:disabled {
          opacity: .28;
          cursor: not-allowed;
        }
        .v6-help {
          text-align: center;
          color: #70819e;
          font-size: 10px;
          margin-top: 8px;
          letter-spacing: .06em;
        }
        .v6-audio-error {
          margin: 10px auto 0;
          width: fit-content;
          max-width: 90vw;
          padding: 8px 12px;
          border-radius: 9px;
          background: rgba(180,50,50,.16);
          border: 1px solid rgba(255,100,100,.2);
          color: #ffb5b5;
          font-size: 11px;
        }

        @media (max-width: 700px) {
          .v6-top { padding: 14px 15px; }
          .v6-brand span { display: none; }
          .v6-slide { width: 92vw; max-height: 78vh; }
          .v6-slide p { line-height: 1.28; }
          .v6-large p { font-size: clamp(25px, 6vw, 40px); }
          .v6-medium p { font-size: clamp(22px, 5.3vw, 34px); }
          .v6-compact p { font-size: clamp(20px, 4.8vw, 30px); }
          .v6-bottom { padding: 0 14px 12px; }
          .v6-help { display: none; }
        }
      `}</style>
    </div>
  );
}
