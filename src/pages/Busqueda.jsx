import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SearchBox from "../components/SearchBox";

export default function Busqueda({ data }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const out = [];
    Object.entries(data).forEach(([type, value]) => {
      const arr = Array.isArray(value) ? value : Object.values(value || {}).filter(x => typeof x === "object");
      arr.forEach((item, index) => {
        const text = JSON.stringify(item);
        if (text.toLowerCase().includes(query.toLowerCase())) {
          out.push({type, index, title:item.titulo || item.title || item.nombre || `${type} ${index+1}`, item});
        }
      });
    });
    return out.slice(0, 100);
  }, [query, data]);

  return <>
    <SearchBox value={query} onChange={setQuery} placeholder="Busca una palabra, versículo, libro..." />
    {!query ? <div className="search-hint"><h2>Búsqueda global</h2><p>Busca simultáneamente dentro de los JSON cargados.</p></div> :
      <div className="results">{results.map((r,i)=><div className="result" key={i}><span>{r.type}</span><strong>{r.title}</strong><small>Coincidencia encontrada en el contenido</small></div>)}</div>}
  </>;
}