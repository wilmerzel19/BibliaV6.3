const KEY = "mi-biblioteca-settings";

export function getSetting(name, fallback = null) {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "{}");
    return data[name] ?? fallback;
  } catch {
    return fallback;
  }
}

export function saveSetting(name, value) {
  const data = JSON.parse(localStorage.getItem(KEY) || "{}");
  data[name] = value;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getFavorites() {
  try { return JSON.parse(localStorage.getItem("mi-biblioteca-favorites") || "[]"); }
  catch { return []; }
}

export function toggleFavorite(item) {
  const favorites = getFavorites();
  const id = item.id ?? item.numero ?? item.title ?? JSON.stringify(item);
  const exists = favorites.some(x => x._id === id);
  const next = exists ? favorites.filter(x => x._id !== id) : [...favorites, {...item, _id: id}];
  localStorage.setItem("mi-biblioteca-favorites", JSON.stringify(next));
  return next;
}