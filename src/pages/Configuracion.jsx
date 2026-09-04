import { getDataFiles } from "../services/dataService";

export default function Configuracion({ onRefresh }) {
  const files = getDataFiles();
  return (
    <div className="settings">
      <section className="panel">
        <h2>Archivos JSON</h2>
        <p>Coloca tus archivos dentro de <code>public/data/</code>. No necesitas modificar el lector para empezar.</p>
        {Object.entries(files).map(([key,path]) => <div className="file-row" key={key}><strong>{key}</strong><code>{path}</code></div>)}
        <button className="primary" onClick={onRefresh}>Recargar contenido</button>
      </section>
      <section className="panel">
        <h2>Próximas mejoras</h2>
        <ul className="clean-list">
          <li>Adaptador exacto para la estructura real de tus JSON.</li>
          <li>Notas y resaltado por versículo.</li>
          <li>Descargas y contenido multimedia.</li>
          <li>Presentación automática desde Biblia e himnos.</li>
          <li>Instalación como aplicación Android/PWA.</li>
        </ul>
      </section>
    </div>
  );
}