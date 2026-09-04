import { useState } from "react";
import { Maximize, X } from "lucide-react";
import JsonPreview from "../components/JsonPreview";

export default function Presentacion({ data }) {
  const [text, setText] = useState("");
  const [full, setFull] = useState(false);

  const start = () => {
    setFull(true);
    setTimeout(() => document.documentElement.requestFullscreen?.().catch(()=>{}), 50);
  };

  return (
    <div className={full ? "presentation full" : "presentation"}>
      {!full ? <>
        <h2>Modo presentación</h2>
        <p>Escribe el contenido que deseas proyectar. Después podremos conectar directamente versículos, himnos y estudios de tus JSON.</p>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Escribe o pega aquí el contenido..."/>
        <button className="primary" onClick={start}><Maximize size={17}/> Presentar</button>
      </> : <>
        <button className="presentation-close" onClick={()=>{setFull(false); document.exitFullscreen?.().catch(()=>{});}}><X/></button>
        <div className="presentation-content">{text || "Escribe contenido antes de presentar."}</div>
      </>}
    </div>
  );
}