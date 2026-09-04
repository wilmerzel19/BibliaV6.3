import { Link } from "react-router-dom";
import { Book, Newspaper, FileText } from "lucide-react";

export default function Biblioteca({ data }) {
  const items = [
    {to:"/biblioteca/libros", title:"Libros", text:"Libros y publicaciones", icon:Book, count:data.libros},
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