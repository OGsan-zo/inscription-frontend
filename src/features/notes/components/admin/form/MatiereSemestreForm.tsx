import type { Matiere, Semestre } from "../../../types/notes";

interface Props {
  matieres: Matiere[];
  semestres: Semestre[];
  matiere: string;
  semestre: string;
  saving: boolean;
  onMatiereChange: (v: string) => void;
  onSemestreChange: (v: string) => void;
  onSubmit: () => void;
}

export default function MatiereSemestreForm({
  matieres,
  semestres,
  matiere,
  semestre,
  saving,
  onMatiereChange,
  onSemestreChange,
  onSubmit,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="text-base font-bold text-slate-900 mb-5">Insertion Matière par Semestre</h3>
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:items-end">

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Matière</label>
          <select
            value={matiere}
            onChange={(e) => onMatiereChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:min-w-[180px]"
          >
            <option value="">-- Choisir --</option>
            {matieres.map((m) => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Semestre</label>
          <select
            value={semestre}
            onChange={(e) => onSemestreChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:min-w-[120px]"
          >
            <option value="">-- Choisir --</option>
            {semestres.map((s) => (
              <option key={s.id} value={s.id}>{s.nom}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onSubmit}
          disabled={saving || !matiere || !semestre}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>

      </div>
    </div>
  );
}
