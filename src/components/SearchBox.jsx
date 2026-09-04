import { Search } from "lucide-react";

export default function SearchBox({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="search-box">
      <Search size={19}/>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/>
    </div>
  );
}