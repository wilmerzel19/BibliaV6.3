import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SearchBox from "../components/SearchBox";
import EmptyState from "../components/EmptyState";
import JsonPreview from "../components/JsonPreview";
import CalendarioLibros from "./CalendarioLibros";
import { normalizeArray } from "../services/dataService";

const labels = { libros:"Libros", revistas:"Revistas", documentos:"Documentos" };

export default function Contenido({ data }) {
  const { tipo } = useParams();
  const source = tipo === "libros" ? data.libros : tipo === "revistas" ? data.revistas : data.categorias;
  const items = useMemo(() => normalizeArray(source), [source]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const filtered = items.filter(x => JSON.stringify(x).toLowerCase().includes(query.toLowerCase()));

  if (tipo === "libros") return <CalendarioLibros data={data.libros} />;

  if (!items.length) return <EmptyState title={`${labels[tipo] || "Contenido"} vacío`} />;

  if (selected) return <div><button className="back-btn" onClick={() => setSelected(null)}>← Volver</button><h2>{selected.titulo || selected.title || selected.nombre || "Contenido"}</h2><JsonPreview data={selected}/></div>;

  return <>
    <div className="toolbar"><SearchBox value={query} onChange={setQuery} placeholder={`Buscar en ${labels[tipo] || "contenido"}...`} /></div>
    <div className="content-list">{filtered.map((x,i)=><button className="content-row" onClick={()=>setSelected(x)} key={i}><strong>{x.titulo || x.title || x.nombre || `Elemento ${i+1}`}</strong><span>{x.descripcion || x.description || "Abrir contenido →"}</span></button>)}</div>
  </>;
}