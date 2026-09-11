import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ExternalLink, Leaf, Search, Sparkles, Star, Play, Pause, Volume2, VolumeX,
  Presentation, Minimize, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { normalizeArray } from "../services/dataService";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const FUENTES = {
  semilla: { key: "semilla", label: "La Buena Semilla", titulo: "La Buena Semilla", sub: "Lectura diaria y meditación", icono: Leaf },
  senor: { key: "senor", label: "El Señor está Cerca", titulo: "El Señor está Cerca", sub: "Lecturas y meditaciones diarias", icono: Sparkles },
};

function formatLongDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(date);
}

function shortDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return { year, month: MONTHS[Number(month) - 1]?.slice(0, 3).toUpperCase(), day };
}

function getTodayKey() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function firstParagraph(text = "") {
  return String(text).split(/\n\s*\n/).map(s => s.trim()).find(Boolean) || "";
}

function parrafosDe(text = "") {
  return String(text).split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
}

function esEntrada(e) { return ["INPUT", "TEXTAREA", "SELECT"].includes(e.target?.tagName); }

export default function CalendarioLibros({ data, dataSemilla, dataSenor, tabInicial }) {
  // Compatibilidad: si algún componente aún pasa "data" (La Buena Semilla), lo usamos como dataSemilla.
  const fuenteDatos = {
    semilla: dataSemilla ?? data,
    senor: dataSenor,
  };

  const [fuente, setFuente] = useState(tabInicial === "senor" ? "senor" : "semilla");
  const items = useMemo(() => normalizeArray(fuenteDatos[fuente]), [fuenteDatos.semilla, fuenteDatos.senor, fuente]);

  const today = getTodayKey();
  const [selectedDate, setSelectedDate] = useState(today);
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("all");
  const [favorite, setFavorite] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Proyección
  const [proyectando, setProyectando] = useState(false);
  const [paraIdx, setParaIdx] = useState(0);
  const [tamanoProy, setTamanoProy] = useState(24);
  const projectorRef = useRef(null);
  const paraTargetRef = useRef("start"); // "start" | "end"

  const cambiarFuente = (clave) => {
    if (clave === fuente) return;
    setFuente(clave);
    setQuery("");
    setMonth("all");
    setSelectedDate(today);
    setFavorite(false);
  };

  const ordered = useMemo(() => (
    [...items].filter(x => x && x.fecha).sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)))
  ), [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ordered.filter(item => {
      const itemMonth = String(item.fecha).slice(5, 7);
      const matchesMonth = month === "all" || itemMonth === month;
      const haystack = `${item.titulo || ""} ${item.autor || ""} ${item.texto || ""}`.toLowerCase();
      return matchesMonth && (!q || haystack.includes(q));
    });
  }, [ordered, month, query]);

  const selected = useMemo(() => {
    const exact = ordered.find(x => x.fecha === selectedDate);
    return exact || filtered[0] || ordered[0] || null;
  }, [ordered, filtered, selectedDate]);

  useEffect(() => {
    if (selected?.fecha && selected.fecha !== selectedDate) setSelectedDate(selected.fecha);
  }, [selected, selectedDate]);

  const verse = selected?.versiculo || selected?.versiculoTexto || selected?.versiculo_texto || selected?.textoVersiculo || selected?.versiculo?.texto || "";
  const verseRef = selected?.referencia || selected?.referenciaBiblica || selected?.versiculoReferencia || selected?.versiculo?.referencia || "";

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
  }, [selected?.fecha]);

  useEffect(() => () => {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  const toggleAudio = () => {
    if (selected?.audio || selected?.audioUrl || selected?.audio_url) return setPlaying(v => !v);
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (playing) {
      window.speechSynthesis.pause();
      setPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${selected?.titulo || ""}. ${verse ? `${verse}.` : ""} ${selected?.texto || ""}`);
    utterance.lang = "es-ES";
    utterance.rate = 0.92;
    utterance.volume = muted ? 0 : 1;
    utterance.onstart = () => { setPlaying(true); setProgress(0); };
    utterance.onend = () => { setPlaying(false); setProgress(100); };
    utterance.onerror = () => { setPlaying(false); };
    window.speechSynthesis.speak(utterance);
  };

  const toggleMute = () => {
    setMuted(v => !v);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (!muted) window.speechSynthesis.pause();
      else if (playing) window.speechSynthesis.resume();
    }
  };

  const selectToday = () => {
    setQuery("");
    setMonth("all");
    setSelectedDate(today);
  };

  // ---- Navegación de día (para proyección) ----
  const ordenIndex = ordered.findIndex(x => x.fecha === selected?.fecha);
  const diaAnterior = ordenIndex > 0 ? ordered[ordenIndex - 1] : null;
  const diaSiguiente = ordenIndex >= 0 && ordenIndex < ordered.length - 1 ? ordered[ordenIndex + 1] : null;

  const irADia = useCallback((dia) => { if (dia) setSelectedDate(dia.fecha); }, []);

  // ---- Proyección ----
  const parrafos = useMemo(() => parrafosDe(selected?.texto), [selected]);

  useEffect(() => {
    setParaIdx(paraTargetRef.current === "end" ? Math.max(0, parrafos.length - 1) : 0);
    paraTargetRef.current = "start";
  }, [selected?.fecha, parrafos.length]);

  async function abrirProyeccion() {
    if (!selected) return;
    paraTargetRef.current = "start";
    setParaIdx(0);
    setProyectando(true);
    setTimeout(async () => { try { await projectorRef.current?.requestFullscreen?.(); } catch {} }, 0);
  }
  async function cerrarProyeccion() {
    setProyectando(false);
    try { if (document.fullscreenElement) await document.exitFullscreen(); } catch {}
  }

  const siguienteParrafo = useCallback(() => {
    if (paraIdx < parrafos.length - 1) { setParaIdx(i => i + 1); return; }
    if (diaSiguiente) { paraTargetRef.current = "start"; irADia(diaSiguiente); }
  }, [paraIdx, parrafos, diaSiguiente, irADia]);

  const anteriorParrafo = useCallback(() => {
    if (paraIdx > 0) { setParaIdx(i => i - 1); return; }
    if (diaAnterior) { paraTargetRef.current = "end"; irADia(diaAnterior); }
  }, [paraIdx, diaAnterior, irADia]);

  useEffect(() => {
    if (!proyectando) return;
    const key = e => {
      if (esEntrada(e)) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); anteriorParrafo(); }
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); siguienteParrafo(); }
      if (e.key === "Escape") cerrarProyeccion();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [proyectando, anteriorParrafo, siguienteParrafo]);

  const fuenteActual = FUENTES[fuente];

  if (proyectando) {
    const enPrimerParrafo = paraIdx <= 0;
    const enUltimoParrafo = !!parrafos.length && paraIdx >= parrafos.length - 1;
    const progresoBar = parrafos.length ? ((paraIdx + 1) / parrafos.length) * 100 : 0;
    const texto = parrafos[paraIdx] || firstParagraph(selected?.texto) || "Sin contenido.";

    return (
      <div ref={projectorRef} className="daily-projector">
        <div className="daily-projector-progress"><div style={{ width: `${progresoBar}%` }} /></div>
        <div className="daily-projector-top">
          <div><span>{fuenteActual.titulo.toUpperCase()}</span><strong>{selected?.titulo || "Lectura del día"}</strong></div>
          <div className="daily-projector-actions">
            <button onClick={() => setTamanoProy(s => Math.max(16, s - 2))}>A−</button>
            <button onClick={() => setTamanoProy(s => Math.min(60, s + 2))}>A+</button>
            <button onClick={cerrarProyeccion}><Minimize size={18} /> Salir</button>
          </div>
        </div>
        <div className="daily-projector-center">
          {!selected ? (
            <div className="daily-projector-loading"><Loader2 className="daily-spin" size={40} /><p>Cargando lectura…</p></div>
          ) : (
            <div key={`${fuente}-${selected.fecha}-${paraIdx}`} className="daily-projector-fade">
              <div className="daily-projector-ref">{formatLongDate(selected.fecha)}</div>
              <div className="daily-projector-text" style={{ fontSize: `clamp(26px, ${Math.max(3.2, tamanoProy / 6)}vw, ${Math.min(72, tamanoProy * 2)}px)` }}>{texto}</div>
              <div className="daily-projector-count">Párrafo {paraIdx + 1} de {parrafos.length || 1}</div>
            </div>
          )}
        </div>
        <div className="daily-projector-controls">
          <button disabled={enPrimerParrafo && !diaAnterior} onClick={anteriorParrafo}><ChevronLeft /> Anterior</button>
          <button disabled={enUltimoParrafo && !diaSiguiente} onClick={siguienteParrafo}>Siguiente <ChevronRight /></button>
        </div>
        <div className="daily-projector-secondary">
          <button disabled={!diaAnterior} onClick={() => { paraTargetRef.current = "start"; irADia(diaAnterior); }}><ChevronLeft size={14} /> {diaAnterior ? formatLongDate(diaAnterior.fecha) : "—"}</button>
          <button disabled={!diaSiguiente} onClick={() => { paraTargetRef.current = "start"; irADia(diaSiguiente); }}>{diaSiguiente ? formatLongDate(diaSiguiente.fecha) : "—"} <ChevronRight size={14} /></button>
        </div>
        <div className="daily-projector-hint">← → párrafos (cruzan de día automáticamente) · ESPACIO siguiente · ESC salir</div>
        <style>{`
.daily-projector{position:fixed;inset:0;z-index:99999;background:radial-gradient(circle at 50% 0,#1d594e,#0a1612 65%);color:#fff;display:flex;flex-direction:column;font-family:Georgia,'Times New Roman',serif}
.daily-projector-progress{height:3px;background:#ffffff14;flex-shrink:0}
.daily-projector-progress>div{height:100%;background:linear-gradient(90deg,#d8ad54,#f3d99a);transition:width .4s ease}
.daily-projector-top{height:72px;padding:0 28px;display:flex;align-items:center;justify-content:space-between;background:#0005;border-bottom:1px solid #fff1;flex-shrink:0;font-family:Inter,system-ui,sans-serif}
.daily-projector-top span{display:block;color:#bcd8cd;font-size:9px;font-weight:950;letter-spacing:1px}
.daily-projector-top strong{display:block;font-size:18px;margin-top:3px;font-family:Georgia,serif}
.daily-projector-actions{display:flex;gap:6px}
.daily-projector-actions button{border:1px solid #ffffff22;background:#ffffff10;color:#fff;border-radius:9px;padding:9px 12px;display:flex;align-items:center;gap:6px;font-weight:900;font-family:Inter,system-ui,sans-serif}
.daily-projector-center{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:45px 8vw;min-height:0}
.daily-projector-ref{font:800 clamp(13px,1.6vw,18px) Inter,system-ui,sans-serif;color:#d8ad54;margin-bottom:22px;letter-spacing:.3px;text-transform:capitalize}
.daily-projector-text{max-width:1250px;line-height:1.5;text-shadow:0 3px 20px #000;max-height:55vh;overflow:auto}
.daily-projector-count{margin-top:24px;color:#8fa89e;font:11px Inter,system-ui,sans-serif}
.daily-projector-fade{animation:dpfade .38s ease;display:flex;flex-direction:column;align-items:center}
@keyframes dpfade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.daily-projector-loading{display:flex;flex-direction:column;align-items:center;gap:16px;color:#bcd8cd;font-family:Inter,system-ui,sans-serif}
.daily-spin{animation:dpspin 1s linear infinite}
@keyframes dpspin{to{transform:rotate(360deg)}}
.daily-projector-controls{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px 20px 8px;flex-shrink:0;font-family:Inter,system-ui,sans-serif}
.daily-projector-controls button{border:1px solid #ffffff20;background:#ffffff12;color:#eef4ff;border-radius:10px;padding:15px;display:flex;justify-content:center;align-items:center;gap:7px;font-size:12px;font-weight:900}
.daily-projector-controls button:disabled{opacity:.3}
.daily-projector-secondary{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:0 20px 12px;flex-shrink:0;font-family:Inter,system-ui,sans-serif}
.daily-projector-secondary button{border:1px solid #ffffff14;background:transparent;color:#9db8ac;border-radius:8px;padding:8px;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:5px}
.daily-projector-secondary button:disabled{opacity:.3}
.daily-projector-hint{text-align:center;color:#6c8579;font:9px Inter,system-ui,sans-serif;padding-bottom:10px;flex-shrink:0}
@media(max-width:650px){.daily-projector-top{padding:0 12px}.daily-projector-center{padding:30px 16px}.daily-projector-controls{padding:9px}.daily-projector-hint{display:none}}
`}</style>
      </div>
    );
  }

  return (
    <section className="daily-reader">
      <header className="daily-brandbar">
        <div className="daily-brand">
          <div className="daily-mark"><Sparkles size={21} /></div>
          <div>
            <div className="daily-kicker">LECTURAS DIARIAS 2026</div>
            <h1>Calendarios Bíblicos</h1>
          </div>
        </div>
        <button className="daily-today" onClick={selectToday}>Ir a hoy</button>
      </header>

      <div className="daily-tabs" aria-label="Calendarios">
        <button className={`daily-tab ${fuente === "senor" ? "active" : ""}`} onClick={() => cambiarFuente("senor")}>
          <span className="daily-tab-icon book">▤</span>
          <span><strong>El Señor está cerca</strong><small>Lecturas y meditaciones diarias</small></span>
        </button>
        <button className={`daily-tab ${fuente === "semilla" ? "active" : ""}`} onClick={() => cambiarFuente("semilla")}>
          <Leaf size={24} />
          <span><strong>La Buena Semilla</strong><small>Lectura diaria y meditación</small></span>
        </button>
      </div>

      {!ordered.length ? (
        <div className="daily-empty">
          <Leaf size={30} />
          <h2>No hay lecturas disponibles en {fuenteActual.titulo}</h2>
          <p>Agrega tus lecturas al archivo correspondiente para mostrarlas aquí, o cambia de pestaña arriba.</p>
        </div>
      ) : (
        <div className="daily-layout">
          <aside className="daily-sidebar">
            <div className="daily-search">
              <Search size={17} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar título, texto o autor..."
                aria-label="Buscar lecturas"
              />
            </div>
            <select value={month} onChange={e => setMonth(e.target.value)} className="daily-month">
              <option value="all">Todos los meses</option>
              {MONTHS.map((name, i) => <option key={name} value={String(i + 1).padStart(2, "0")}>{name}</option>)}
            </select>

            <div className="daily-list">
              {filtered.map(item => {
                const d = shortDate(item.fecha);
                const isSelected = selected?.fecha === item.fecha;
                return (
                  <button
                    className={`daily-item ${isSelected ? "selected" : ""}`}
                    key={item.fecha}
                    onClick={() => setSelectedDate(item.fecha)}
                  >
                    <span className="daily-date"><b>{d.day}</b><small>{d.month}</small></span>
                    <span className="daily-item-copy">
                      <strong>{item.titulo || "Sin título"}</strong>
                      <small>{item.autor || "Lectura diaria"}</small>
                    </span>
                  </button>
                );
              })}
              {!filtered.length && <div className="daily-no-results">No encontramos lecturas con esa búsqueda.</div>}
            </div>
          </aside>

          <article className="daily-content">
            {selected && (
              <>
                <div className="daily-content-head">
                  <div>
                    <div className="daily-label">{fuenteActual.titulo.toUpperCase()}</div>
                    <p className="daily-date-long">{formatLongDate(selected.fecha)}</p>
                  </div>
                  <div className="daily-content-actions">
                    <button
                      className="daily-project"
                      onClick={abrirProyeccion}
                      title="Proyectar esta lectura"
                      aria-label="Proyectar esta lectura"
                    ><Presentation size={19} /></button>
                    <button
                      className={`daily-star ${favorite ? "on" : ""}`}
                      onClick={() => setFavorite(v => !v)}
                      title="Marcar como favorita"
                      aria-label="Marcar como favorita"
                    ><Star size={21} fill={favorite ? "currentColor" : "none"} /></button>
                  </div>
                </div>

                <h2>{selected.titulo || "Lectura del día"}</h2>

                <div className="daily-highlight">
                  <span className="daily-highlight-line" />
                  <p>{verse || firstParagraph(selected.texto)}</p>
                  <strong>{verseRef || selected.autor || "Lectura diaria"}</strong>
                </div>

                <div className="daily-audio">
                  <button className="daily-audio-play" onClick={toggleAudio} aria-label={playing ? "Pausar lectura" : "Escuchar lectura"}>
                    {playing ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}
                  </button>
                  <div className="daily-audio-main">
                    <div className="daily-audio-title">Escuchar lectura <span>Audio de {fuenteActual.titulo}</span></div>
                    <div className="daily-audio-track"><span style={{width:`${progress}%`}} /></div>
                    <div className="daily-audio-times"><span>{playing ? "Reproduciendo" : "0:00"}</span><span>Lectura diaria</span></div>
                  </div>
                  <button className="daily-audio-volume" onClick={toggleMute} aria-label={muted ? "Activar sonido" : "Silenciar"}>
                    {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
                  </button>
                </div>

                <div className="daily-reading">
                  {parrafos.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {selected.url && (
                  <a className="daily-source" href={selected.url} target="_blank" rel="noreferrer">
                    Abrir fuente original <ExternalLink size={16} />
                  </a>
                )}
              </>
            )}
          </article>
        </div>
      )}
      <style>{`
.daily-content-actions{display:flex;align-items:center;gap:8px}
.daily-project{width:41px;height:41px;border-radius:50%;border:1px solid #e1e5de;background:#fff;color:#1d594e;display:grid;place-items:center;cursor:pointer}
.daily-project:hover{background:#eef6f2}
`}</style>
    </section>
  );
}
