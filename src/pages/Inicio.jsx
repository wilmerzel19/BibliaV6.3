import { Link } from "react-router-dom";
import { BookOpen, Library, Music2, GraduationCap, Search, Presentation } from "lucide-react";

export default function Inicio({ data }) {
  const cards = [
    ["Biblia", "Lectura y navegación bíblica", "/biblia", BookOpen, data.biblia],
    ["Biblioteca", "Libros, revistas y documentos", "/biblioteca", Library, data.libros],
    ["Estudios", "Material de estudio", "/estudios", GraduationCap, data.estudios],
    ["Himnos", "Colección de himnos", "/himnos", Music2, data.himnos],
    ["Búsqueda", "Busca en todo tu contenido", "/busqueda", Search, null],
    ["Presentación", "Proyecta contenido en pantalla", "/presentacion", Presentation, null],
  ];

  return (
    <>
      <section className="hero">
        <div>
          <span className="badge">OFFLINE READY</span>
          <h2>Tu biblioteca bíblica,<br/><em>en un solo lugar.</em></h2>
          <p>Una base preparada para la lectura, estudio y meditación de la Palabra de Dios.</p>
        </div>
        <BookOpen className="hero-icon" size={120}/>
      </section>

      <div className="section-head">
        <div><h2>Contenido</h2><p>Accede rápidamente a tus colecciones.</p></div>
      </div>

      <div className="card-grid">
        {cards.map(([name, desc, to, Icon]) => (
          <Link className="feature-card" to={to} key={name}>
            <div className="feature-icon"><Icon size={23}/></div>
            <h3>{name}</h3>
            <p>{desc}</p>
            <span className="arrow">→</span>
          </Link>
        ))}
      </div>
    </>
  );
}