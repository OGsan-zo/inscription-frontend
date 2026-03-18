import type { EtudiantRecherche } from "../../types/notes";

interface Props {
  nom: string;
  prenom: string;
  searching: boolean;
  resultats: EtudiantRecherche[];
  etudiantSelectionne: EtudiantRecherche | null;
  onNomChange: (v: string) => void;
  onPrenomChange: (v: string) => void;
  onRecherche: () => void;
  onSelectEtudiant: (e: EtudiantRecherche) => void;
}

export default function RechercheEtudiantForm({
  nom,
  prenom,
  searching,
  resultats,
  etudiantSelectionne,
  onNomChange,
  onPrenomChange,
  onRecherche,
  onSelectEtudiant,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="text-base font-bold text-slate-900 mb-5">Recherche Étudiant</h3>
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nom</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => onNomChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onRecherche()}
            placeholder="ex: RANDRIA"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Prénom</label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => onPrenomChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onRecherche()}
            placeholder="ex: Dode"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
        </div>
        <button
          onClick={onRecherche}
          disabled={searching || !nom.trim()}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {searching ? "Recherche..." : "Valider"}
        </button>
      </div>

      {resultats.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {resultats.map((e) => (
            <button
              key={e.id}
              onClick={() => onSelectEtudiant(e)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors text-left ${
                etudiantSelectionne?.id === e.id
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
              }`}
            >
              <span className="font-semibold text-slate-900">{e.nom} {e.prenom}</span>
              <span className="text-xs text-slate-500">{e.mention} — {e.niveau}</span>
            </button>
          ))}
        </div>
      )}

      {resultats.length === 0 && nom && !searching && (
        <p className="mt-4 text-sm text-slate-400">Aucun étudiant trouvé.</p>
      )}
    </div>
  );
}
