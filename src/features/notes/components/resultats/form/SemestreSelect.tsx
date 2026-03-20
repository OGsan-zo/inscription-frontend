import type { EtudiantRecherche, Semestre } from "../../../types/notes";

interface Props {
  etudiant: EtudiantRecherche;
  semestres: Semestre[];
  idSemestre: string;
  loading: boolean;
  onSemestreChange: (v: string) => void;
  onValider: () => void;
  onReset: () => void;
}

export default function SemestreSelect({
  etudiant,
  semestres,
  idSemestre,
  loading,
  onSemestreChange,
  onValider,
  onReset,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900">Sélection du Semestre</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Étudiant : <span className="font-semibold text-slate-700">{etudiant.nom} {etudiant.prenom}</span>
          </p>
        </div>
        <button onClick={onReset} className="text-xs text-slate-400 hover:text-slate-600 underline">
          Recommencer
        </button>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Semestre</label>
          <select
            value={idSemestre}
            onChange={(e) => onSemestreChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:min-w-[140px]"
          >
            <option value="">-- Choisir --</option>
            {semestres.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={onValider}
          disabled={loading || !idSemestre}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {loading ? "Chargement..." : "Valider"}
        </button>
      </div>
    </div>
  );
}
