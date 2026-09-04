import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search, ChevronLeft, ChevronRight, BookOpen, Copy, Check, Volume2, Square,
  Menu, X, BookMarked, Share2, Bookmark, BookmarkCheck, Maximize, Minimize,
  Settings2, MonitorPlay, RotateCcw, AlertTriangle, Loader2
} from "lucide-react";

const LIBROS = [
  {
    numero: 1,
    nombre: "Génesis",
    archivo: "genesis",
    capitulos: 50
  },
  {
    numero: 2,
    nombre: "Éxodo",
    archivo: "exodo",
    capitulos: 40
  },
  {
    numero: 3,
    nombre: "Levítico",
    archivo: "levitico",
    capitulos: 27
  },
  {
    numero: 4,
    nombre: "Números",
    archivo: "numeros",
    capitulos: 36
  },
  {
    numero: 5,
    nombre: "Deuteronomio",
    archivo: "deuteronomio",
    capitulos: 34
  },
  {
    numero: 6,
    nombre: "Josué",
    archivo: "josue",
    capitulos: 24
  },
  {
    numero: 7,
    nombre: "Jueces",
    archivo: "jueces",
    capitulos: 21
  },
  {
    numero: 8,
    nombre: "Rut",
    archivo: "rut",
    capitulos: 4
  },
  {
    numero: 9,
    nombre: "1 Samuel",
    archivo: "1-samuel",
    capitulos: 31
  },
  {
    numero: 10,
    nombre: "2 Samuel",
    archivo: "2-samuel",
    capitulos: 24
  },
  {
    numero: 11,
    nombre: "1 Reyes",
    archivo: "1-reyes",
    capitulos: 22
  },
  {
    numero: 12,
    nombre: "2 Reyes",
    archivo: "2-reyes",
    capitulos: 25
  },
  {
    numero: 13,
    nombre: "1 Crónicas",
    archivo: "1-cronicas",
    capitulos: 29
  },
  {
    numero: 14,
    nombre: "2 Crónicas",
    archivo: "2-cronicas",
    capitulos: 36
  },
  {
    numero: 15,
    nombre: "Esdras",
    archivo: "esdras",
    capitulos: 10
  },
  {
    numero: 16,
    nombre: "Nehemías",
    archivo: "nehemias",
    capitulos: 13
  },
  {
    numero: 17,
    nombre: "Ester",
    archivo: "ester",
    capitulos: 10
  },
  {
    numero: 18,
    nombre: "Job",
    archivo: "job",
    capitulos: 42
  },
  {
    numero: 19,
    nombre: "Salmos",
    archivo: "salmos",
    capitulos: 150
  },
  {
    numero: 20,
    nombre: "Proverbios",
    archivo: "proverbios",
    capitulos: 31
  },
  {
    numero: 21,
    nombre: "Eclesiastés",
    archivo: "eclesiastes",
    capitulos: 12
  },
  {
    numero: 22,
    nombre: "Cantares",
    archivo: "cantares",
    capitulos: 8
  },
  {
    numero: 23,
    nombre: "Isaías",
    archivo: "isaias",
    capitulos: 66
  },
  {
    numero: 24,
    nombre: "Jeremías",
    archivo: "jeremias",
    capitulos: 52
  },
  {
    numero: 25,
    nombre: "Lamentaciones",
    archivo: "lamentaciones",
    capitulos: 5
  },
  {
    numero: 26,
    nombre: "Ezequiel",
    archivo: "ezequiel",
    capitulos: 48
  },
  {
    numero: 27,
    nombre: "Daniel",
    archivo: "daniel",
    capitulos: 12
  },
  {
    numero: 28,
    nombre: "Oseas",
    archivo: "oseas",
    capitulos: 14
  },
  {
    numero: 29,
    nombre: "Joel",
    archivo: "joel",
    capitulos: 3
  },
  {
    numero: 30,
    nombre: "Amós",
    archivo: "amos",
    capitulos: 9
  },
  {
    numero: 31,
    nombre: "Abdías",
    archivo: "abdias",
    capitulos: 1
  },
  {
    numero: 32,
    nombre: "Jonás",
    archivo: "jonas",
    capitulos: 4
  },
  {
    numero: 33,
    nombre: "Miqueas",
    archivo: "miqueas",
    capitulos: 7
  },
  {
    numero: 34,
    nombre: "Nahúm",
    archivo: "nahum",
    capitulos: 3
  },
  {
    numero: 35,
    nombre: "Habacuc",
    archivo: "habacuc",
    capitulos: 3
  },
  {
    numero: 36,
    nombre: "Sofonías",
    archivo: "sofonia",
    capitulos: 3
  },
  {
    numero: 37,
    nombre: "Hageo",
    archivo: "hageo",
    capitulos: 2
  },
  {
    numero: 38,
    nombre: "Zacarías",
    archivo: "zacarias",
    capitulos: 14
  },
  {
    numero: 39,
    nombre: "Malaquías",
    archivo: "malaquias",
    capitulos: 4
  },

  // =====================================================
  // NUEVO TESTAMENTO
  // =====================================================

  {
    numero: 40,
    nombre: "Mateo",
    archivo: "mateo",
    capitulos: 28
  },
  {
    numero: 41,
    nombre: "Marcos",
    archivo: "marcos",
    capitulos: 16
  },
  {
    numero: 42,
    nombre: "Lucas",
    archivo: "lucas",
    capitulos: 24
  },
  {
    numero: 43,
    nombre: "Juan",
    archivo: "juan",
    capitulos: 21
  },
  {
    numero: 44,
    nombre: "Hechos",
    archivo: "hechos",
    capitulos: 28
  },
  {
    numero: 45,
    nombre: "Romanos",
    archivo: "romanos",
    capitulos: 16
  },
  {
    numero: 46,
    nombre: "1 Corintios",
    archivo: "1-corintios",
    capitulos: 16
  },
  {
    numero: 47,
    nombre: "2 Corintios",
    archivo: "2-corintios",
    capitulos: 13
  },
  {
    numero: 48,
    nombre: "Gálatas",
    archivo: "galatas",
    capitulos: 6
  },
  {
    numero: 49,
    nombre: "Efesios",
    archivo: "efesios",
    capitulos: 6
  },
  {
    numero: 50,
    nombre: "Filipenses",
    archivo: "filipenses",
    capitulos: 4
  },
  {
    numero: 51,
    nombre: "Colosenses",
    archivo: "colosenses",
    capitulos: 4
  },
  {
    numero: 52,
    nombre: "1 Tesalonicenses",
    archivo: "1-tesalonicenses",
    capitulos: 5
  },
  {
    numero: 53,
    nombre: "2 Tesalonicenses",
    archivo: "2-tesalonicenses",
    capitulos: 3
  },
  {
    numero: 54,
    nombre: "1 Timoteo",
    archivo: "1-timoteo",
    capitulos: 6
  },
  {
    numero: 55,
    nombre: "2 Timoteo",
    archivo: "2-timoteo",
    capitulos: 4
  },
  {
    numero: 56,
    nombre: "Tito",
    archivo: "tito",
    capitulos: 3
  },
  {
    numero: 57,
    nombre: "Filemón",
    archivo: "filemon",
    capitulos: 1
  },
  {
    numero: 58,
    nombre: "Hebreos",
    archivo: "hebreos",
    capitulos: 13
  },
  {
    numero: 59,
    nombre: "Santiago",
    archivo: "santiago",
    capitulos: 5
  },
  {
    numero: 60,
    nombre: "1 Pedro",
    archivo: "1-pedro",
    capitulos: 5
  },
  {
    numero: 61,
    nombre: "2 Pedro",
    archivo: "2-pedro",
    capitulos: 3
  },
  {
    numero: 62,
    nombre: "1 Juan",
    archivo: "1-juan",
    capitulos: 5
  },
  {
    numero: 63,
    nombre: "2 Juan",
    archivo: "2-juan",
    capitulos: 1
  },
  {
    numero: 64,
    nombre: "3 Juan",
    archivo: "3-juan",
    capitulos: 1
  },
  {
    numero: 65,
    nombre: "Judas",
    archivo: "judas",
    capitulos: 1
  },
  {
    numero: 66,
    nombre: "Apocalipsis",
    archivo: "apocalipsis",
    capitulos: 22
  }
];



const VERSIONES = [
  {
    id: "rvr1960",
    nombre: "Reina-Valera 1960",
    sigla: "RVR60",
    descripcion: "Biblia local completa",
    color: "blue",
    bases: ["/data/biblia/rvr1960", "/data/biblia"]
  },
  {
    id: "lbla",
    nombre: "Biblia de las Américas",
    sigla: "LBLA",
    descripcion: "Biblia de las Américas · archivos locales",
    color: "violet",
    bases: ["/data/biblia/lbla", "/data/biblia/biblia-americas", "/data/biblia/Ibla"]
  },
  {
    id: "rv1909",
    nombre: "Reina-Valera 1909",
    sigla: "RV09",
    descripcion: "Fuente externa · requiere Internet",
    color: "amber",
    bases: []
  }
];

const CACHE_PREFIX = "biblia_v3_cache_";

function texto(v) { return String(v ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim(); }

function normalizarVersiculos(value) {
  let list = Array.isArray(value) ? value : value && typeof value === "object" ? Object.values(value) : [];
  return list.map((v, i) => {
    if (typeof v === "string") return { numero: i + 1, texto: texto(v) };
    const numero = Number(v?.numero ?? v?.number ?? v?.verse ?? v?.v ?? i + 1);
    return { ...v, numero: Number.isFinite(numero) ? numero : i + 1, texto: texto(v?.texto ?? v?.text ?? v?.content ?? v?.contenido ?? v?.t) };
  }).filter(v => v.texto);
}

function normalizarCapitulo(json, libro, capitulo, version) {
  if (!json) return null;
  let list = json?.versiculos ?? json?.verses ?? json?.chapter?.verses ?? json?.data;
  if (!Array.isArray(list) && list && typeof list === "object") list = Object.entries(list).map(([numero, texto]) => ({ numero, texto }));
  if (!Array.isArray(list) && Array.isArray(json)) list = json;
  if (!list) {
    const raw = json?.texto ?? json?.contenido ?? json?.content;
    if (typeof raw === "string") list = raw.split("\n").filter(Boolean).map((t, i) => ({ numero: i + 1, texto: t }));
  }
  return {
    libro: libro.nombre,
    capitulo,
    version,
    titulo: texto(json?.titulo ?? json?.title ?? `${libro.nombre} ${capitulo}`),
    versiculos: normalizarVersiculos(list)
  };
}

function archivoPrincipal(libro, capitulo) {
  return `${String(libro.numero).padStart(2, "0")}_${libro.archivo}_${String(capitulo).padStart(3, "0")}.json`;
}

function candidatos(base, libro, capitulo) {
  const n = archivoPrincipal(libro, capitulo);
  return [
    `${base}/${n}`,
    `${base}/${libro.archivo}_${capitulo}.json`,
    `${base}/${libro.archivo === "genesis" ? "génesis" : libro.archivo}_${capitulo}.json`
  ];
}

async function jsonSeguro(url, signal) {
  const r = await fetch(url, { signal, cache: "no-store", headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const type = r.headers.get("content-type") || "";
  if (!type.includes("json")) throw new Error("El servidor devolvió HTML en vez de JSON");
  return r.json();
}

async function cargarLocal(version, libro, capitulo, signal) {
  const cacheKey = `${CACHE_PREFIX}${version.id}_${libro.numero}_${capitulo}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return { ...JSON.parse(cached), desdeCache: true };
  } catch {}
  let ultimo = "Archivo no encontrado";
  for (const base of version.bases) {
    for (const url of candidatos(base, libro, capitulo)) {
      try {
        const data = normalizarCapitulo(await jsonSeguro(url, signal), libro, capitulo, version.sigla);
        if (data?.versiculos?.length) {
          try { sessionStorage.setItem(cacheKey, JSON.stringify(data)); } catch {}
          return { ...data, fuente: url };
        }
        ultimo = "JSON sin versículos";
      } catch (e) {
        if (e?.name === "AbortError") throw e;
        ultimo = e?.message || ultimo;
      }
    }
  }
  throw new Error(`${version.nombre}: no hay un archivo local para ${libro.nombre} ${capitulo}. ${ultimo}`);
}

async function cargarRV1909(libro, capitulo, signal) {
  const key = `${CACHE_PREFIX}rv1909_${libro.numero}_${capitulo}`;
  try { const c = localStorage.getItem(key); if (c) return { ...JSON.parse(c), desdeCache: true }; } catch {}
  const urls = [
    `https://api.getbible.net/v2/valera/${libro.numero}/${capitulo}.json`,
    `https://api.getbible.net/v1/valera/${libro.numero}/${capitulo}.json`
  ];
  for (const url of urls) {
    try {
      const data = normalizarCapitulo(await jsonSeguro(url, signal), libro, capitulo, "RV09");
      if (data?.versiculos?.length) { try { localStorage.setItem(key, JSON.stringify(data)); } catch {} return { ...data, fuente: url }; }
    } catch (e) { if (e?.name === "AbortError") throw e; }
  }
  throw new Error("No se pudo conectar con la fuente de RV1909. Comprueba tu Internet.");
}

function esEntrada(e) { return ["INPUT", "TEXTAREA", "SELECT"].includes(e.target?.tagName); }

export default function Biblia() {
  const [libroActual, setLibroActual] = useState(LIBROS[0]);
  const [capituloActual, setCapituloActual] = useState(1);
  const [versionActual, setVersionActual] = useState(() => localStorage.getItem("biblia_version_v3") || "rvr1960");
  const [contenido, setContenido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [libroQuery, setLibroQuery] = useState("");
  const [versoQuery, setVersoQuery] = useState("");
  const [menuLibros, setMenuLibros] = useState(false);
  const [proyectando, setProyectando] = useState(false);
  const [versoProy, setVersoProy] = useState(0);
  const [tamano, setTamano] = useState(() => Number(localStorage.getItem("biblia_tamano_v3")) || 25);
  const [mostrarNumeros, setMostrarNumeros] = useState(() => localStorage.getItem("biblia_numeros_v3") !== "false");
  const [copiado, setCopiado] = useState("");
  const [hablando, setHablando] = useState(false);
  const [favoritos, setFavoritos] = useState(() => { try { return JSON.parse(localStorage.getItem("biblia_favoritos") || "[]"); } catch { return []; } });
  const abortRef = useRef(null);
  const presentationRef = useRef(null);
  const versoProyTargetRef = useRef("start"); // "start" | "end" — dónde debe caer el versículo al cambiar de capítulo mientras se proyecta

  const version = VERSIONES.find(v => v.id === versionActual) || VERSIONES[0];

  const cargar = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setCargando(true); setError(""); setContenido(null);
    try {
      const data = version.id === "rv1909"
        ? await cargarRV1909(libroActual, capituloActual, controller.signal)
        : await cargarLocal(version, libroActual, capituloActual, controller.signal);
      if (!controller.signal.aborted) {
        setContenido(data);
        const total = data?.versiculos?.length || 1;
        setVersoProy(versoProyTargetRef.current === "end" ? total - 1 : 0);
        versoProyTargetRef.current = "start";
      }
    } catch (e) {
      if (e?.name !== "AbortError") setError(e?.message || "No se pudo cargar el capítulo.");
    } finally {
      if (!controller.signal.aborted) setCargando(false);
    }
  }, [version, libroActual, capituloActual]);

  useEffect(() => { localStorage.setItem("biblia_version_v3", versionActual); cargar(); return () => abortRef.current?.abort(); }, [versionActual, libroActual, capituloActual, cargar]);
  useEffect(() => { localStorage.setItem("biblia_tamano_v3", tamano); }, [tamano]);
  useEffect(() => { localStorage.setItem("biblia_numeros_v3", String(mostrarNumeros)); }, [mostrarNumeros]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const irCapitulo = useCallback((n) => { setCapituloActual(Math.max(1, Math.min(libroActual.capitulos, Number(n)))); window.scrollTo({ top: 0, behavior: "smooth" }); }, [libroActual]);
  const anterior = useCallback(() => {
    const i = LIBROS.findIndex(l => l.numero === libroActual.numero);
    if (capituloActual > 1) return irCapitulo(capituloActual - 1);
    if (i > 0) { setLibroActual(LIBROS[i - 1]); setCapituloActual(LIBROS[i - 1].capitulos); }
  }, [libroActual, capituloActual, irCapitulo]);
  const siguiente = useCallback(() => {
    const i = LIBROS.findIndex(l => l.numero === libroActual.numero);
    if (capituloActual < libroActual.capitulos) return irCapitulo(capituloActual + 1);
    if (i < LIBROS.length - 1) { setLibroActual(LIBROS[i + 1]); setCapituloActual(1); }
  }, [libroActual, capituloActual, irCapitulo]);

  const iLibro = LIBROS.findIndex(l => l.numero === libroActual.numero);
  const hayAnterior = capituloActual > 1 || iLibro > 0;
  const haySiguiente = capituloActual < libroActual.capitulos || iLibro < LIBROS.length - 1;
  const anteriorLabel = capituloActual > 1 ? `${libroActual.nombre} ${capituloActual - 1}` : iLibro > 0 ? `${LIBROS[iLibro - 1].nombre} ${LIBROS[iLibro - 1].capitulos}` : "—";
  const siguienteLabel = capituloActual < libroActual.capitulos ? `${libroActual.nombre} ${capituloActual + 1}` : iLibro < LIBROS.length - 1 ? `${LIBROS[iLibro + 1].nombre} 1` : "—";

  // Navegación de versículo EN PROYECCIÓN: al llegar al final/inicio del capítulo,
  // continúa automáticamente al capítulo siguiente/anterior en vez de quedarse "atascada".
  const siguienteVersoProyeccion = useCallback(() => {
    const total = contenido?.versiculos?.length || 0;
    if (versoProy < total - 1) { setVersoProy(i => i + 1); return; }
    if (haySiguiente) { versoProyTargetRef.current = "start"; siguiente(); }
  }, [contenido, versoProy, haySiguiente, siguiente]);
  const anteriorVersoProyeccion = useCallback(() => {
    if (versoProy > 0) { setVersoProy(i => i - 1); return; }
    if (hayAnterior) { versoProyTargetRef.current = "end"; anterior(); }
  }, [versoProy, hayAnterior, anterior]);

  async function abrirProyeccion() {
    versoProyTargetRef.current = "start";
    setVersoProy(0); setProyectando(true);
    setTimeout(async () => { try { await presentationRef.current?.requestFullscreen?.(); } catch {} }, 0);
  }
  async function cerrarProyeccion() { setProyectando(false); try { if (document.fullscreenElement) await document.exitFullscreen(); } catch {} }

  useEffect(() => {
    const key = e => {
      if (esEntrada(e)) return;
      if (proyectando) {
        if (e.key === "ArrowLeft") { e.preventDefault(); anteriorVersoProyeccion(); }
        if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); siguienteVersoProyeccion(); }
        if (e.key === "Escape") cerrarProyeccion();
        if (e.key.toLowerCase() === "p") cerrarProyeccion();
      } else {
        if (e.key === "ArrowLeft") anterior();
        if (e.key === "ArrowRight") siguiente();
        if (e.key.toLowerCase() === "p") abrirProyeccion();
      }
    };
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  }, [anterior, siguiente, proyectando, anteriorVersoProyeccion, siguienteVersoProyeccion]);

  const librosFiltrados = useMemo(() => LIBROS.filter(l => !libroQuery || l.nombre.toLowerCase().includes(libroQuery.toLowerCase())), [libroQuery]);
  const versiculos = useMemo(() => {
    const q = versoQuery.trim().toLowerCase();
    return !q ? contenido?.versiculos || [] : (contenido?.versiculos || []).filter(v => `${v.numero} ${v.texto}`.toLowerCase().includes(q));
  }, [contenido, versoQuery]);

  const clave = v => `${versionActual}:${libroActual.numero}:${capituloActual}:${v.numero}`;
  const esFav = v => favoritos.includes(clave(v));
  const toggleFav = v => { const k = clave(v); const next = esFav(v) ? favoritos.filter(x => x !== k) : [...favoritos, k]; setFavoritos(next); localStorage.setItem("biblia_favoritos", JSON.stringify(next)); };

  async function copiar(v) {
    const t = `${libroActual.nombre} ${capituloActual}:${v.numero}\n${v.texto}\n\n${version.nombre}`;
    try { await navigator.clipboard.writeText(t); } catch { const ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
    setCopiado(String(v.numero)); setTimeout(() => setCopiado(""), 1400);
  }
  async function compartir(v) {
    const t = `${libroActual.nombre} ${capituloActual}:${v.numero}\n${v.texto}\n\n${version.nombre}`;
    if (navigator.share) { try { await navigator.share({ title: `${libroActual.nombre} ${capituloActual}:${v.numero}`, text: t }); } catch {} } else copiar(v);
  }
  function leer() {
    if (!contenido?.versiculos?.length || !window.speechSynthesis) return;
    if (hablando) { speechSynthesis.cancel(); setHablando(false); return; }
    const u = new SpeechSynthesisUtterance(contenido.versiculos.map(v => `${v.numero}. ${v.texto}`).join(" "));
    u.lang = "es-ES"; u.rate = .88; u.onend = () => setHablando(false); u.onerror = () => setHablando(false); speechSynthesis.speak(u); setHablando(true);
  }

  let vista;
  if (proyectando) {
    const versos = contenido?.versiculos || [];
    const v = versos[versoProy] || versos[0];
    const enPrimerVerso = versoProy <= 0;
    const enUltimoVerso = !!versos.length && versoProy >= versos.length - 1;
    const deshabilitarVersoAnterior = enPrimerVerso && !hayAnterior;
    const deshabilitarVersoSiguiente = enUltimoVerso && !haySiguiente;
    const labelVersoAnterior = enPrimerVerso && hayAnterior ? anteriorLabel : "Versículo anterior";
    const labelVersoSiguiente = enUltimoVerso && haySiguiente ? siguienteLabel : "Versículo siguiente";
    const progreso = versos.length ? ((versoProy + 1) / versos.length) * 100 : 0;

    vista = <div ref={presentationRef} className="b3-projector">
      <div className="b3-projector-progress"><div style={{width: `${progreso}%`}}/></div>
      <div className="b3-projector-top">
        <div><span>{version.sigla} · {version.nombre}</span><strong>{libroActual.nombre} {capituloActual}</strong></div>
        <div className="b3-projector-actions">
          <button onClick={() => setTamano(s => Math.max(20, s - 2))}>A−</button>
          <button onClick={() => setTamano(s => Math.min(80, s + 2))}>A+</button>
          <button onClick={cerrarProyeccion}><Minimize size={18}/> Salir</button>
        </div>
      </div>
      <div className="b3-projector-center">
        {cargando ? (
          <div className="b3-projector-loading"><Loader2 className="b3-spin" size={40}/><p>Cargando {libroActual.nombre} {capituloActual}…</p></div>
        ) : error ? (
          <div className="b3-projector-error"><AlertTriangle size={40}/><p>{error}</p></div>
        ) : v ? (
          <div key={`${versionActual}-${libroActual.numero}-${capituloActual}-${v.numero}`} className="b3-projector-fade">
            <div className="b3-projector-ref">{libroActual.nombre} {capituloActual}:{v.numero}</div>
            <div className="b3-projector-text" style={{fontSize: `clamp(32px, ${Math.max(4, tamano / 6)}vw, ${Math.min(96, tamano * 2.2)}px)`}}>{v.texto}</div>
            <div className="b3-projector-count">Versículo {versoProy + 1} de {versos.length}</div>
          </div>
        ) : null}
      </div>
      <div className="b3-projector-controls">
        <button disabled={deshabilitarVersoAnterior} onClick={anteriorVersoProyeccion}><ChevronLeft/> {labelVersoAnterior}</button>
        <button disabled={deshabilitarVersoSiguiente} onClick={siguienteVersoProyeccion}>{labelVersoSiguiente} <ChevronRight/></button>
      </div>
      <div className="b3-projector-secondary">
        <button disabled={!hayAnterior} onClick={() => { versoProyTargetRef.current = "start"; anterior(); }}><ChevronLeft size={14}/> Ir a {anteriorLabel}</button>
        <button disabled={!haySiguiente} onClick={() => { versoProyTargetRef.current = "start"; siguiente(); }}>Ir a {siguienteLabel} <ChevronRight size={14}/></button>
      </div>
      <div className="b3-projector-hint">← → versículos (cruzan de capítulo automáticamente) · ESPACIO siguiente · P proyección · ESC salir</div>
    </div>;
  } else {
  vista = <div className="biblia-v3">
    <section className="b3-hero"><div><div className="b3-kicker"><BookOpen size={16}/> MI BIBLIOTECA · BIBLIA V3</div><h1>La Biblia, <em>lista para leer y proyectar.</em></h1><p>Una experiencia pensada para estudio personal, enseñanza y culto en pantalla grande.</p><div className="b3-hero-buttons"><button className="b3-primary" onClick={abrirProyeccion} disabled={!contenido}><MonitorPlay size={17}/> Proyectar capítulo</button><span className="b3-shortcut">P · abrir proyección</span></div></div><div className="b3-hero-icon"><BookOpen size={120}/></div></section>

    <section className="b3-versions"><div className="b3-section-title"><div className="b3-title-icon"><BookMarked size={19}/></div><div><strong>Versiones bíblicas</strong><small>Selector inteligente · recuerda tu última elección</small></div></div><div className="b3-version-grid">{VERSIONES.map(v => <button key={v.id} className={`b3-version ${versionActual === v.id ? "selected" : ""}`} onClick={() => { setVersionActual(v.id); setVersoQuery(""); }}><span className={`b3-version-badge ${v.color}`}>{v.sigla}</span><span className="b3-version-copy"><strong>{v.nombre}</strong><small>{v.descripcion}</small></span>{versionActual === v.id && <Check size={18}/>}</button>)}</div><div className="b3-version-status"><span className="b3-dot"/> {version.id === "rvr1960" ? "RVR1960 completa detectada en tu biblioteca local." : version.id === "lbla" ? "LBLA detectada localmente. Los archivos disponibles determinan los capítulos." : "RV1909 se carga desde Internet y queda guardada en caché."}</div></section>

    <div className="b3-layout">
      <aside className={`b3-books ${menuLibros ? "open" : ""}`}><div className="b3-books-head"><div><strong>Libros</strong><small>66 libros · 1,189 capítulos</small></div><button onClick={() => setMenuLibros(false)}><X/></button></div><label className="b3-book-search"><Search size={16}/><input value={libroQuery} onChange={e => setLibroQuery(e.target.value)} placeholder="Buscar libro..."/></label><div className="b3-book-list"><div className="b3-testament">ANTIGUO TESTAMENTO</div>{librosFiltrados.filter(l => l.numero <= 39).map(l => <button key={l.numero} className={l.numero === libroActual.numero ? "active" : ""} onClick={() => { setLibroActual(l); setCapituloActual(1); setMenuLibros(false); }}><b>{String(l.numero).padStart(2,"0")}</b><span>{l.nombre}</span><small>{l.capitulos}</small></button>)}<div className="b3-testament">NUEVO TESTAMENTO</div>{librosFiltrados.filter(l => l.numero >= 40).map(l => <button key={l.numero} className={l.numero === libroActual.numero ? "active" : ""} onClick={() => { setLibroActual(l); setCapituloActual(1); setMenuLibros(false); }}><b>{String(l.numero).padStart(2,"0")}</b><span>{l.nombre}</span><small>{l.capitulos}</small></button>)}</div></aside>
      {menuLibros && <div className="b3-overlay" onClick={() => setMenuLibros(false)}/>} 
      <main className="b3-reader">
        <div className="b3-reader-head"><button className="b3-mobile-books" onClick={() => setMenuLibros(true)}><Menu size={18}/> Libros</button><div><span className="b3-reader-version">{version.sigla} · {version.nombre}</span><h2>{libroActual.nombre} <em>{capituloActual}</em></h2></div><div className="b3-actions"><button className={hablando ? "active" : ""} onClick={leer}>{hablando ? <Square size={17}/> : <Volume2 size={17}/>}<span>{hablando ? "Detener" : "Escuchar"}</span></button><button className="project" onClick={abrirProyeccion} disabled={!contenido}><MonitorPlay size={17}/><span>Proyectar</span></button></div></div>
        <div className="b3-chapter-nav"><button disabled={!hayAnterior} onClick={anterior}><ChevronLeft/><span>Anterior</span><small>{anteriorLabel}</small></button><label><span>CAPÍTULO</span><select value={capituloActual} onChange={e => irCapitulo(e.target.value)}>{Array.from({length: libroActual.capitulos}, (_,i) => <option key={i+1} value={i+1}>{libroActual.nombre} · Capítulo {i+1}</option>)}</select></label><button disabled={!haySiguiente} onClick={siguiente}><span>Siguiente</span><small>{siguienteLabel}</small><ChevronRight/></button></div>
        <div className="b3-toolbar"><div className="b3-reader-search"><Search size={18}/><input value={versoQuery} onChange={e => setVersoQuery(e.target.value)} placeholder="Buscar palabra o versículo en este capítulo..."/>{versoQuery && <button onClick={() => setVersoQuery("")}><X size={16}/></button>}</div><div className="b3-tools"><button onClick={() => setTamano(s => Math.max(16, s-1))}>A−</button><span>{tamano}px</span><button onClick={() => setTamano(s => Math.min(48, s+1))}>A+</button><button className={mostrarNumeros ? "on" : ""} title="Números de versículos" onClick={() => setMostrarNumeros(v => !v)}>#</button></div></div>
        {versoQuery && <div className="b3-result-count"><Search size={14}/> {versiculos.length} resultado{versiculos.length === 1 ? "" : "s"}</div>}
        {cargando ? <div className="b3-state"><Loader2 className="b3-spin" size={42}/><h3>Cargando {libroActual.nombre} {capituloActual}</h3><p>{version.nombre}</p></div> : error ? <div className="b3-state b3-error"><AlertTriangle size={44}/><h3>Este capítulo no está disponible</h3><p>{error}</p><div className="b3-help"><strong>Consejo</strong><span>Si cambiaste de versión, esta pantalla busca automáticamente en las carpetas compatibles. No se intenta interpretar HTML como JSON.</span></div><div className="b3-state-actions"><button className="b3-primary" onClick={cargar}><RotateCcw size={16}/> Reintentar</button><button onClick={() => setVersionActual("rvr1960")}>Volver a RVR1960</button></div></div> : versiculos.length ? <article className="b3-verses">{versiculos.map(v => <div key={v.numero} className={`b3-verse ${esFav(v) ? "favorite" : ""}`}><div className="b3-verse-main">{mostrarNumeros && <span className="b3-num">{v.numero}</span>}<p style={{fontSize: `${tamano}px`}}>{v.texto}</p><small>{libroActual.nombre} {capituloActual}:{v.numero} · {version.sigla}</small></div><div className="b3-verse-actions"><button className={esFav(v) ? "on" : ""} title="Favorito" onClick={() => toggleFav(v)}>{esFav(v) ? <BookmarkCheck size={17}/> : <Bookmark size={17}/>}</button><button title="Copiar" onClick={() => copiar(v)}>{copiado === String(v.numero) ? <Check size={17}/> : <Copy size={17}/>}</button><button title="Compartir" onClick={() => compartir(v)}><Share2 size={17}/></button></div></div>)}</article> : <div className="b3-state"><Search size={38}/><h3>Sin resultados</h3><p>Prueba otra palabra.</p></div>}
        <div className="b3-footer-nav"><button disabled={!hayAnterior} onClick={anterior}><ChevronLeft/><div><small>CAPÍTULO ANTERIOR</small><strong>{anteriorLabel}</strong></div></button><div><span>{version.sigla}</span><strong>{libroActual.nombre} {capituloActual}</strong></div><button disabled={!haySiguiente} onClick={siguiente}><div><small>CAPÍTULO SIGUIENTE</small><strong>{siguienteLabel}</strong></div><ChevronRight/></button></div>
      </main>
    </div>
  </div>;
  }

  return <>
    {vista}
    <style>{`
.biblia-v3{--b3:#245bd5;--b3-ink:#172238;--b3-muted:#7d889b;min-height:100vh;background:#f3f6fb;color:var(--b3-ink);padding-bottom:45px}.b3-hero{max-width:1460px;margin:0 auto;padding:42px 44px;background:linear-gradient(120deg,#0d2862,#2563eb);color:#fff;border-radius:0 0 30px 30px;display:flex;justify-content:space-between;align-items:center;overflow:hidden}.b3-kicker{display:flex;align-items:center;gap:8px;font-size:10px;font-weight:900;letter-spacing:1.7px;opacity:.82}.b3-hero h1{font-size:40px;line-height:1.05;margin:14px 0 10px}.b3-hero h1 em{font-style:normal;color:#bcd3ff}.b3-hero p{color:#dce8ff;max-width:650px;margin:0;line-height:1.6}.b3-hero-buttons{display:flex;align-items:center;gap:12px;margin-top:22px}.b3-primary{border:0;background:#fff;color:#1647b5;border-radius:11px;padding:11px 15px;font-weight:900;display:inline-flex;align-items:center;gap:8px}.b3-primary:disabled{opacity:.5}.b3-shortcut{font-size:10px;color:#bed1f9}.b3-hero-icon{opacity:.12;transform:rotate(-10deg);margin-right:50px}.b3-versions{max-width:1400px;margin:20px auto 16px;background:#fff;border:1px solid #e1e7f0;border-radius:20px;padding:18px 20px}.b3-section-title{display:flex;align-items:center;gap:10px}.b3-title-icon{width:40px;height:40px;border-radius:12px;background:#edf3ff;color:#2d5fd0;display:grid;place-items:center}.b3-section-title div:last-child{display:flex;flex-direction:column}.b3-section-title strong{font-size:14px}.b3-section-title small{font-size:10px;color:var(--b3-muted);margin-top:2px}.b3-version-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:13px}.b3-version{border:1px solid #e0e6ef;background:#fafbfe;border-radius:14px;padding:11px;display:flex;align-items:center;gap:10px;text-align:left;color:#26344a;transition:.16s}.b3-version:hover{transform:translateY(-1px);border-color:#9cb4eb}.b3-version.selected{background:#f0f5ff;border-color:#7093e2;box-shadow:0 5px 18px #245bd514}.b3-version-copy{display:flex;flex-direction:column;flex:1}.b3-version-copy strong{font-size:12px}.b3-version-copy small{font-size:9px;color:#8995a8;margin-top:3px}.b3-version-badge{width:43px;height:43px;border-radius:12px;display:grid;place-items:center;font-size:9px;font-weight:950}.b3-version-badge.blue{background:#e6efff;color:#285dce}.b3-version-badge.violet{background:#eee9ff;color:#6844bd}.b3-version-badge.amber{background:#fff0d5;color:#b66a06}.b3-version-status{display:flex;align-items:center;gap:7px;margin-top:10px;font-size:9px;color:#7e8a9e}.b3-dot{width:7px;height:7px;border-radius:50%;background:#35a66f;display:inline-block}.b3-layout{max-width:1400px;margin:auto;display:grid;grid-template-columns:285px 1fr;gap:18px}.b3-books{background:#fff;border:1px solid #e1e7f0;border-radius:18px;max-height:calc(100vh - 165px);position:sticky;top:15px;overflow:auto}.b3-books-head{padding:17px 15px 12px;display:flex;justify-content:space-between;align-items:center}.b3-books-head strong,.b3-books-head small{display:block}.b3-books-head strong{font-size:14px}.b3-books-head small{font-size:9px;color:#8b96a8;margin-top:3px}.b3-books-head button{display:none;border:0;background:#f0f3f8;border-radius:8px}.b3-book-search{height:39px;margin:0 12px 9px;border:1px solid #e0e5ed;border-radius:9px;display:flex;align-items:center;gap:7px;padding:0 9px;color:#8b96a7}.b3-book-search input{border:0;outline:0;width:100%;font-size:11px}.b3-testament{padding:12px 14px 6px;font-size:8px;font-weight:950;letter-spacing:1px;color:#9aa4b4}.b3-book-list>button{width:100%;border:0;background:transparent;padding:7px 12px;display:flex;align-items:center;gap:8px;text-align:left;color:#526078;font-size:11px}.b3-book-list>button:hover{background:#f5f7fb}.b3-book-list>button.active{background:#edf3ff;color:#2d5fd0;font-weight:900}.b3-book-list>button b{width:26px;height:26px;border-radius:7px;background:#f1f3f7;display:grid;place-items:center;font-size:8px;color:#7c8798}.b3-book-list>button.active b{background:#dbe7ff;color:#2d5fd0}.b3-book-list>button span{flex:1}.b3-book-list>button small{font-size:8px;color:#a0a9b6}.b3-reader{min-width:0}.b3-reader-head{background:#fff;border:1px solid #e1e7f0;border-radius:18px;padding:19px 21px;display:flex;align-items:center;justify-content:space-between;gap:15px}.b3-reader-version{font-size:9px;font-weight:950;letter-spacing:.8px;color:#4168cc}.b3-reader-head h2{font-size:28px;margin:5px 0 0}.b3-reader-head h2 em{font-style:normal;color:#2d61d2}.b3-actions{display:flex;gap:7px}.b3-actions button{border:1px solid #dce3ee;background:#fff;color:#536177;border-radius:10px;padding:10px 12px;display:flex;align-items:center;gap:7px;font-size:11px;font-weight:900}.b3-actions button.active{background:#edf3ff;color:#2d5fd0}.b3-actions button.project{background:#1f5bd5;color:#fff;border-color:#1f5bd5}.b3-actions button:disabled{opacity:.45}.b3-mobile-books{display:none}.b3-chapter-nav{display:grid;grid-template-columns:1fr 230px 1fr;gap:9px;margin:12px 0}.b3-chapter-nav>button,.b3-chapter-nav>label{min-height:58px;border:1px solid #dfe5ed;background:#fff;border-radius:12px;padding:7px 12px;color:#526078}.b3-chapter-nav>button{display:flex;align-items:center;gap:8px;text-align:left;font-weight:900}.b3-chapter-nav>button:last-child{justify-content:flex-end;text-align:right}.b3-chapter-nav>button small{display:block;color:#9aa4b2;font-size:8px;margin-top:3px}.b3-chapter-nav>button:disabled{opacity:.4}.b3-chapter-nav label{display:flex;flex-direction:column;justify-content:center;gap:4px}.b3-chapter-nav label span{font-size:7px;font-weight:950;color:#9aa4b2;letter-spacing:1px}.b3-chapter-nav select{border:0;outline:0;font-weight:900;color:#2e3c52;background:#fff}.b3-toolbar{display:flex;gap:8px;margin-bottom:12px}.b3-reader-search{height:45px;flex:1;background:#fff;border:1px solid #dfe5ed;border-radius:11px;display:flex;align-items:center;gap:8px;padding:0 12px;color:#8b96a8}.b3-reader-search input{border:0;outline:0;background:transparent;flex:1;font-size:12px}.b3-reader-search button{border:0;background:transparent;color:#8b96a8}.b3-tools{display:flex;align-items:center;gap:3px;background:#fff;border:1px solid #dfe5ed;border-radius:11px;padding:4px}.b3-tools button{border:0;background:#f4f6fa;width:33px;height:33px;border-radius:7px;font-weight:900;color:#526078}.b3-tools button.on{background:#edf3ff;color:#2d5fd0}.b3-tools span{font-size:9px;color:#7d899d;padding:0 3px}.b3-result-count{background:#edf3ff;color:#3561c7;border-radius:9px;padding:8px 11px;font-size:10px;font-weight:900;margin-bottom:10px;display:flex;align-items:center;gap:6px}.b3-verses{display:flex;flex-direction:column;gap:9px}.b3-verse{background:#fff;border:1px solid #e0e6ef;border-radius:15px;padding:19px 14px 14px 52px;position:relative;display:grid;grid-template-columns:1fr auto;gap:10px}.b3-verse.favorite{border-color:#b7caf6;background:#fbfcff}.b3-verse-main{min-width:0}.b3-num{position:absolute;left:14px;top:18px;width:28px;height:28px;border-radius:8px;background:#eaf0ff;color:#3562cd;display:grid;place-items:center;font-size:10px;font-weight:950}.b3-verse-main p{font-family:Georgia,'Times New Roman',serif;line-height:1.7;margin:0;color:#293449}.b3-verse-main small{display:block;color:#a0a9b7;font-size:8px;font-weight:900;letter-spacing:.3px;margin-top:10px;text-transform:uppercase}.b3-verse-actions{display:flex;gap:3px;align-items:flex-start}.b3-verse-actions button{width:31px;height:31px;border:0;background:transparent;border-radius:8px;color:#8c96a6}.b3-verse-actions button:hover,.b3-verse-actions button.on{background:#edf3ff;color:#2f60d0}.b3-state{background:#fff;border:1px solid #e0e6ef;border-radius:16px;min-height:320px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:30px}.b3-state h3{margin:13px 0 5px}.b3-state p{margin:0;color:#7e8a9e;font-size:12px;max-width:700px}.b3-spin{animation:b3spin 1s linear infinite;color:#3563d0}@keyframes b3spin{to{transform:rotate(360deg)}}.b3-error>svg{color:#d18a2b}.b3-help{max-width:650px;background:#fff7e8;color:#85652e;border-radius:10px;padding:11px;margin:15px 0;text-align:left;font-size:10px;display:flex;flex-direction:column;gap:4px}.b3-state-actions{display:flex;gap:8px}.b3-state-actions>button:last-child{border:1px solid #dce3ee;background:#fff;color:#526078;border-radius:10px;padding:10px 13px;font-weight:900}.b3-footer-nav{margin-top:14px;background:#fff;border:1px solid #e0e6ef;border-radius:15px;padding:8px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px}.b3-footer-nav>button{border:0;background:#f4f6fa;border-radius:10px;min-height:56px;padding:6px 10px;display:flex;align-items:center;gap:8px;text-align:left;color:#56637a}.b3-footer-nav>button:last-child{justify-content:flex-end;text-align:right}.b3-footer-nav>button:disabled{opacity:.35}.b3-footer-nav small{display:block;font-size:7px;font-weight:950;color:#9aa4b2;letter-spacing:1px}.b3-footer-nav strong{display:block;font-size:10px;margin-top:3px}.b3-footer-nav>div{text-align:center}.b3-footer-nav>div span{display:inline-block;background:#edf3ff;color:#3d63c4;border-radius:20px;padding:5px 8px;font-size:8px;font-weight:950}.b3-footer-nav>div strong{display:block;margin-top:5px;font-size:11px}.b3-overlay{display:none}.b3-projector{position:fixed;inset:0;z-index:99999;background:radial-gradient(circle at 50% 0,#183765,#050912 65%);color:#fff;display:flex;flex-direction:column}.b3-projector-progress{height:3px;background:#ffffff14;flex-shrink:0}.b3-projector-progress>div{height:100%;background:linear-gradient(90deg,#4d8dff,#a9c5ff);transition:width .4s ease}.b3-projector-top{height:72px;padding:0 28px;display:flex;align-items:center;justify-content:space-between;background:#0005;border-bottom:1px solid #fff1;flex-shrink:0}.b3-projector-top span{display:block;color:#9dbdff;font-size:9px;font-weight:950;letter-spacing:1px}.b3-projector-top strong{display:block;font-size:18px;margin-top:3px}.b3-projector-actions{display:flex;gap:6px}.b3-projector-actions button{border:1px solid #ffffff22;background:#ffffff10;color:#fff;border-radius:9px;padding:9px 12px;display:flex;align-items:center;gap:6px;font-weight:900}.b3-projector-center{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:45px 8vw;min-height:0}.b3-projector-ref{font-size:clamp(16px,2vw,25px);color:#a9c5ff;font-weight:950;margin-bottom:22px;letter-spacing:.3px}.b3-projector-text{max-width:1250px;font-family:Georgia,'Times New Roman',serif;line-height:1.45;text-shadow:0 3px 20px #000;max-height:52vh;overflow:auto}.b3-projector-count{margin-top:24px;color:#7286a8;font-size:10px}.b3-projector-fade{animation:b3fade .38s ease;display:flex;flex-direction:column;align-items:center}@keyframes b3fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.b3-projector-loading,.b3-projector-error{display:flex;flex-direction:column;align-items:center;gap:16px;color:#a9c5ff}.b3-projector-error{color:#ffb4b4}.b3-projector-loading p,.b3-projector-error p{margin:0;font-size:13px;color:#c9d8f5;max-width:600px}.b3-projector-controls{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px 20px 8px;flex-shrink:0}.b3-projector-controls button{border:1px solid #ffffff20;background:#ffffff12;color:#eef4ff;border-radius:10px;padding:15px;display:flex;justify-content:center;align-items:center;gap:7px;font-size:12px;font-weight:900}.b3-projector-controls button:hover:not(:disabled){background:#ffffff1c}.b3-projector-controls button:disabled{opacity:.3}.b3-projector-secondary{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:0 20px 12px;flex-shrink:0}.b3-projector-secondary button{border:1px solid #ffffff14;background:transparent;color:#8fa3c4;border-radius:8px;padding:8px;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:5px}.b3-projector-secondary button:hover:not(:disabled){background:#ffffff0b;color:#dce7fb}.b3-projector-secondary button:disabled{opacity:.3}.b3-projector-hint{text-align:center;color:#637696;font-size:9px;padding-bottom:10px;flex-shrink:0}@media(max-width:1050px){.b3-layout{margin:0 14px}.b3-versions{margin-left:14px;margin-right:14px}.b3-layout{grid-template-columns:245px 1fr}}@media(max-width:850px){.b3-hero{border-radius:0 0 22px 22px;padding:30px 22px}.b3-hero h1{font-size:30px}.b3-hero-icon{display:none}.b3-version-grid{grid-template-columns:1fr}.b3-layout{display:block;margin:0 10px}.b3-books{position:fixed;left:-320px;top:0;bottom:0;width:300px;height:100vh;max-height:none;z-index:100000;border-radius:0;transition:left .2s}.b3-books.open{left:0}.b3-books-head button{display:block}.b3-overlay{display:block;position:fixed;inset:0;background:#0008;z-index:99999}.b3-mobile-books{display:flex;border:1px solid #dfe5ed;background:#fff;border-radius:9px;padding:9px;align-items:center;gap:5px;font-size:10px;font-weight:900}.b3-reader-head{align-items:flex-start}.b3-actions button{width:40px;height:40px;padding:0;justify-content:center}.b3-actions span{display:none}.b3-chapter-nav{grid-template-columns:1fr 1fr}.b3-chapter-nav label{grid-column:1/-1;grid-row:1}.b3-chapter-nav>button{grid-row:2}.b3-toolbar{flex-direction:column}.b3-tools{justify-content:center}.b3-projector-secondary{grid-template-columns:1fr 1fr}}@media(max-width:600px){.b3-hero{padding:25px 18px}.b3-hero h1{font-size:26px}.b3-hero-buttons{align-items:flex-start;flex-direction:column}.b3-versions{margin:10px}.b3-layout{margin:0 8px}.b3-reader-head{padding:15px}.b3-reader-head h2{font-size:23px}.b3-verse{grid-template-columns:1fr;padding-left:47px}.b3-verse-actions{justify-content:flex-end}.b3-footer-nav{grid-template-columns:1fr 1fr}.b3-footer-nav>div{grid-column:1/-1;grid-row:1}.b3-footer-nav>button{grid-row:2}.b3-projector-top{padding:0 12px}.b3-projector-actions button:not(:last-child){display:none}.b3-projector-center{padding:30px 16px}.b3-projector-controls{padding:9px;grid-template-columns:1fr 1fr}.b3-projector-secondary{grid-template-columns:1fr 1fr}.b3-projector-hint{display:none}}
`}</style>
  </>;
}
