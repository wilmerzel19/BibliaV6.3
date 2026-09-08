import { useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  BookOpen, Library, Search, Music2, FileText, Newspaper,
  GraduationCap, Star, Settings, Menu, X, Home, Presentation,
  Moon, Sun, Download, RefreshCw
} from "lucide-react";
import { loadAllData } from "./services/dataService";
import { saveSetting, getSetting } from "./services/storageService";
import Inicio from "./pages/Inicio";
import Biblia from "./pages/Biblia";
import Biblioteca from "./pages/Biblioteca";
import Busqueda from "./pages/Busqueda";
import Himnos from "./pages/Himnos";
import Devocionales from "./pages/Devocionales";
import Estudios from "./pages/Estudios";
import Favoritos from "./pages/Favoritos";
import Presentacion from "./pages/Presentacion";
import Configuracion from "./pages/Configuracion";
import Contenido from "./pages/Contenido";


const menu = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/biblia", label: "Biblia", icon: BookOpen },
  { to: "/biblioteca", label: "Biblioteca", icon: Library },
  { to: "/devocionales", label: "Devocionales", icon: FileText },
  { to: "/estudios", label: "Estudios", icon: GraduationCap },
  { to: "/himnos", label: "Himnos", icon: Music2 },
  { to: "/busqueda", label: "Búsqueda", icon: Search },
  { to: "/favoritos", label: "Favoritos", icon: Star },
  { to: "/presentacion", label: "Presentación", icon: Presentation },
];

export default function App() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => getSetting("dark", false));
  const location = useLocation();

  const refresh = async () => {
    setLoading(true);
    try {
      setData(await loadAllData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    saveSetting("dark", dark);
  }, [dark]);

  const title = useMemo(() => {
    const item = menu.find(x => x.to === location.pathname);
    return item?.label || "Mi Biblioteca";
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-logo"><BookOpen size={24}/></div>
          <div>
            <strong>Mi Biblioteca</strong>
            <span>Bíblica</span>
          </div>
          <button className="icon-btn mobile-close" onClick={() => setMobileOpen(false)}><X/></button>
        </div>

        <nav>
          {menu.map(({to, label, icon: Icon}) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setMobileOpen(false)}
              className={({isActive}) => `nav-item ${isActive ? "active" : ""}`}>
              <Icon size={19}/><span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <NavLink to="/configuracion" className="nav-item" onClick={() => setMobileOpen(false)}>
            <Settings size={19}/><span>Configuración</span>
          </NavLink>
        </div>
      </aside>

      {mobileOpen && <div className="overlay" onClick={() => setMobileOpen(false)} />}

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setMobileOpen(true)}><Menu/></button>
          <div>
            <div className="eyebrow">BIBLIOTECA DIGITAL</div>
            <h1>{title}</h1>
          </div>
          <div className="top-actions">
            <button className="icon-btn" title="Recargar JSON" onClick={refresh}><RefreshCw size={19}/></button>
            <button className="icon-btn" title="Cambiar tema" onClick={() => setDark(v => !v)}>
              {dark ? <Sun size={19}/> : <Moon size={19}/>}
            </button>
          </div>
        </header>

        {loading ? (
          <div className="loading"><div className="spinner"/><p>Cargando biblioteca...</p></div>
        ) : (
          <div className="page">
            <Routes>
              <Route path="/" element={<Inicio data={data} />} />
              <Route path="/biblia" element={<Biblia data={data.biblia} />} />
              <Route path="/biblioteca" element={<Biblioteca data={data} />} />
              <Route path="/biblioteca/:tipo" element={<Contenido data={data} />} />
              <Route path="/estudios" element={<Estudios data={data.estudios} />} />
              <Route path="/himnos" element={<Himnos data={data.himnos} audios={data.audiosHimnos} />} />
              <Route path="/devocionales" element={<Devocionales data={data.devocionales} />} />
              <Route path="/busqueda" element={<Busqueda data={data} />} />
              <Route path="/favoritos" element={<Favoritos />} />
              <Route path="/presentacion" element={<Presentacion data={data} />} />
              <Route path="/configuracion" element={<Configuracion data={data} onRefresh={refresh} />} />
            </Routes>
          </div>
        )}
      </main>
    </div>
  );
}