import { useMemo } from "react";
import { SelecteurParcoursProps } from "../type/typeParcours";

export function SelecteurParcours({
  parcours,
  idMention,
  idNiveau,
  value,
  onChange,
}: SelecteurParcoursProps) {
  
  // Filtrage automatique des parcours
  const parcoursFiltres = useMemo(() => {
    // Si la mention ou le niveau n'est pas sélectionné, on retourne un tableau vide
    if (!idMention || !idNiveau) return [];

    return parcours.filter(
      (p) =>
        Number(p.mention.id) === Number(idMention) &&
        Number(p.niveau.id) === Number(idNiveau)
    );
  }, [parcours, idMention, idNiveau]);

  return (
    <div className="flex items-center gap-2">
      <select
        className="w-48 h-10 px-3 rounded-md border border-slate-300 outline-none focus:ring-2 focus:ring-blue-900 disabled:bg-slate-100 disabled:text-slate-400 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
        disabled={parcoursFiltres.length === 0}
      >
        <option value="">
          {!idMention || !idNiveau
            ? "Choisir Mention & Niveau"
            : parcoursFiltres.length === 0
            ? "Aucun parcours"
            : "Sélectionner un parcours"}
        </option>
        
        {parcoursFiltres.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nom}
          </option>
        ))}
      </select>
    </div>
  );
}