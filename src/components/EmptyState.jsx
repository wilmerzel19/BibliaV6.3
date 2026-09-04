import { FileText } from "lucide-react";

export default function EmptyState({ title = "Sin contenido", text = "Agrega tu JSON en public/data." }) {
  return (
    <div className="empty">
      <FileText size={34}/>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}