import type { UE, Semestre } from "../../../types/notes";

interface Props {
  ues: UE[];
  semestres: Semestre[];
  name: string;
  ueId: string;
  semestreId: string;
  saving: boolean;
  onNameChange: (v: string) => void;
  onUeChange: (v: string) => void;
  onSemestreChange: (v: string) => void;
  onSubmit: () => void;
}

export default function MatiereSemestreForm({
  ues,
  semestres,
  name,
  ueId,
  semestreId,
  saving,
  onNameChange,
  onUeChange,
  onSemestreChange,
  onSubmit,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="text-base font-bold text-slate-900 mb-5">Créer une Matière (EC)</h3>
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:items-end">

        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nom de la matière</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="ex: Algèbre"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">UE</label>
          <select
            value={ueId}
            onChange={(e) => onUeChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:min-w-[200px]"
          >
            <option value="">-- Choisir --</option>
            {ues.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Semestre</label>
          <select
            value={semestreId}
            onChange={(e) => onSemestreChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:min-w-[130px]"
          >
            <option value="">-- Choisir --</option>
            {semestres.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onSubmit}
          disabled={saving || !name.trim() || !ueId || !semestreId}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>

      </div>
    </div>
  );
}
