import { useMemo, useState } from "react";
import SearchBox from "../components/SearchBox";
import EmptyState from "../components/EmptyState";
import JsonPreview from "../components/JsonPreview";
import { normalizeArray } from "../services/dataService";

export default function Estudios({ data }) {
  const items = useMemo(() => normalizeArray(data), [data]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const filtered = items.filter(x => JSON.stringify(x).toLowerCase().includes(query.toLowerCase()));

  if (!items.length) return <EmptyState title="No hay estudios" text="Agrega tus datos en estudios.json."/>;

  if (selected) return <div><button className="back-btn" onClick={()=>setSelected(null)}>← Volver</button><JsonPreview data={selected}/></div>;

  return <>
    <div className="toolbar"><SearchBox value={query} onChange={setQuery} placeholder="Buscar estudio..." /></div>
    <div className="content-list">{filtered.map((x,i)=><button className="content-row" key={i} onClick={()=>setSelected(x)}><strong>{x.titulo || x.title || x.nombre || `Estudio ${i+1}`}</strong><span>{x.descripcion || x.description || "Abrir estudio →"}</span></button>)}</div>
  </>;
}