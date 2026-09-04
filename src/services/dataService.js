const DATA_FILES = {
  biblia: "/data/biblia.json",
  libros: "/data/libros.json",
  revistas: "/data/revistas.json",
  estudios: "/data/estudios.json",
  himnos: "/data/himnos.json",
  categorias: "/data/categorias.json",
};

async function loadJson(path) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`No se pudo cargar ${path}:`, error.message);
    return [];
  }
}

export async function loadAllData() {
  const entries = await Promise.all(
    Object.entries(DATA_FILES).map(async ([key, path]) => [key, await loadJson(path)])
  );
  return Object.fromEntries(entries);
}

export async function reloadFile(name) {
  if (!DATA_FILES[name]) throw new Error(`Archivo no configurado: ${name}`);
  return loadJson(DATA_FILES[name]);
}

export function getDataFiles() {
  return {...DATA_FILES};
}


/*
  ADAPTADOR DE DATOS

  Tus JSON pueden tener estructuras diferentes.
  Este proyecto mantiene el cargador separado para que solo haya
  que modificar/adaptar esta capa cuando conozcamos tus JSON reales.
*/
export function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  for (const key of ["items", "data", "libros", "capitulos", "versiculos", "hymns", "books", "results"]) {
    if (Array.isArray(value[key])) return value[key];
  }
  return Object.values(value).filter(v => typeof v === "object");
}

export async function cargarAudios() {
  const respuesta = await fetch("/data/audios.json");

  if (!respuesta.ok) {
    throw new Error("No se pudo cargar audios.json");
  }

  return await respuesta.json();
}
