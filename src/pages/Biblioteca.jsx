import { Link } from "react-router-dom";
import { Book, Newspaper, FileText, Sparkles } from "lucide-react";

export default function Biblioteca({ data }) {
  const items = [
    {to:"/biblioteca/libros", title:"La Buena Semilla", text:"Lectura diaria y meditación", icon:Book, count:data.libros},
    {to:"/biblioteca/el-senor-esta-cerca", title:"El Señor está Cerca", text:"Lecturas y meditaciones diarias", icon:Sparkles, count:data.elSenorEstaCerca},
    {to:"/biblioteca/revistas", title:"Revistas", text:"Revistas y ediciones", icon:Newspaper, count:data.revistas},
    {to:"/biblioteca/documentos", title:"Documentos", text:"Otros materiales", icon:FileText, count:data.categorias},
  ];
  return (
    <div className="card-grid">
      {items.map(({to,title,text,icon:Icon,count}) => (
        <Link className="feature-card" to={to} key={to}>
          <div className="feature-icon"><Icon/></div>
          <h3>{title}</h3><p>{text}</p>
          <span className="count">{Array.isArray(count) ? count.length : "Disponible"}</span>

        </Link>
      ))}
    </div>
  );


}
