import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import { getFavorites } from "../services/storageService";
import JsonPreview from "../components/JsonPreview";

export default function Favoritos() {
  const [items, setItems] = useState([]);
  useEffect(() => setItems(getFavorites()), []);
  if (!items.length) return <EmptyState title="No tienes favoritos" text="Guarda versículos, himnos o contenidos para verlos aquí." />;
  return <div className="content-list">{items.map((x,i)=><div className="favorite-item" key={i}><strong>{x.titulo || x.title || x.nombre || `${x.libro || "Contenido"} ${x.numero || ""}`}</strong><JsonPreview data={x}/></div>)}</div>;
}