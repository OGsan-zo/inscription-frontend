import type { MatiereSemestre, MentionNote } from "../../../types/notes";

interface Props {
  matiereSemestres: MatiereSemestre[];
  mentions: MentionNote[];
  matSem: string;
  coeff: string;
  mention: string;
  saving: boolean;
  onMatSemChange: (v: string) => void;
  onCoeffChange: (v: string) => void;
  onMentionChange: (v: string) => void;
  onSubmit: () => void;
}

export default function CoeffMentionForm({
  matiereSemestres,
  mentions,
  matSem,
  coeff,
  mention,
  saving,
  onMatSemChange,
  onCoeffChange,
  onMentionChange,
  onSubmit,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="text-base font-bold text-slate-900 mb-5">Insertion Matière Coefficient Mention</h3>
      <div className="flex flex-wrap gap-4 items-end">

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Matière — Semestre</label>
          <select
            value={matSem}
            onChange={(e) => onMatSemChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[220px]"
          >
            <option value="">-- Choisir --</option>
            {matiereSemestres.map((ms) => (
              <option key={ms.id} value={ms.id}>
                {ms.matiere.nom} — {ms.semestre.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Coefficient</label>
          <input
            type="number"
            min={1}
            value={coeff}
            onChange={(e) => onCoeffChange(e.target.value)}
            placeholder="ex: 3"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mention</label>
          <select
            value={mention}
            onChange={(e) => onMentionChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
          >
            <option value="">-- Choisir --</option>
            {mentions.map((m) => (
              <option key={m.id} value={m.id}>{m.abr || m.nom}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onSubmit}
          disabled={saving || !matSem || !coeff || !mention}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>

      </div>
    </div>
  );
}
