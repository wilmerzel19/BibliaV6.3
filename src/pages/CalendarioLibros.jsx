import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Leaf, Search, Sparkles, Star, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { normalizeArray } from "../services/dataService";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

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

export default function CalendarioLibros({ data }) {
  const items = useMemo(() => normalizeArray(data), [data]);
  const today = getTodayKey();
  const [selectedDate, setSelectedDate] = useState(today);
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("all");
  const [favorite, setFavorite] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

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

  if (!ordered.length) {
    return (
      <div className="daily-empty">
        <Leaf size={30} />
        <h2>No hay lecturas disponibles</h2>
        <p>Agrega tus lecturas al archivo <strong>libros.json</strong> para mostrarlas aquí.</p>
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
        <button className="daily-tab">
          <span className="daily-tab-icon book">▤</span>
          <span><strong>El Señor está cerca</strong><small>Lecturas y meditaciones diarias</small></span>
        </button>
        <button className="daily-tab active">
          <Leaf size={24} />
          <span><strong>La Buena Semilla</strong><small>Lectura diaria y meditación</small></span>
        </button>
      </div>

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
                  <div className="daily-label">LA BUENA SEMILLA</div>
                  <p className="daily-date-long">{formatLongDate(selected.fecha)}</p>
                </div>
                <button
                  className={`daily-star ${favorite ? "on" : ""}`}
                  onClick={() => setFavorite(v => !v)}
                  title="Marcar como favorita"
                  aria-label="Marcar como favorita"
                ><Star size={21} fill={favorite ? "currentColor" : "none"} /></button>
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
                  <div className="daily-audio-title">Escuchar lectura <span>Audio de La Buena Semilla</span></div>
                  <div className="daily-audio-track"><span style={{width:`${progress}%`}} /></div>
                  <div className="daily-audio-times"><span>{playing ? "Reproduciendo" : "0:00"}</span><span>Lectura diaria</span></div>
                </div>
                <button className="daily-audio-volume" onClick={toggleMute} aria-label={muted ? "Activar sonido" : "Silenciar"}>
                  {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
                </button>
              </div>

              <div className="daily-reading">
                {String(selected.texto || "").split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
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
    </section>
  );
}
