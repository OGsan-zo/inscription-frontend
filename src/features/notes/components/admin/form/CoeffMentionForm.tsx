import type { MatiereUE, MentionNote, Niveau, Professeur } from "../../../types/notes";

interface Props {
  matieres: MatiereUE[];
  mentions: MentionNote[];
  niveaux: Niveau[];
  professeurs: Professeur[];
  matiereId: string;
  coeff: string;
  mentionId: string;
  niveauId: string;
  professeurId: string;
  saving: boolean;
  onMatiereChange: (v: string) => void;
  onCoeffChange: (v: string) => void;
  onMentionChange: (v: string) => void;
  onNiveauChange: (v: string) => void;
  onProfesseurChange: (v: string) => void;
  onSubmit: () => void;
}

export default function CoeffMentionForm({
  matieres,
  mentions,
  niveaux,
  professeurs,
  matiereId,
  coeff,
  mentionId,
  niveauId,
  professeurId,
  saving,
  onMatiereChange,
  onCoeffChange,
  onMentionChange,
  onNiveauChange,
  onProfesseurChange,
  onSubmit,
}: Props) {
  const canSubmit = matiereId && coeff && mentionId && niveauId && professeurId;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="text-base font-bold text-slate-900 mb-5">Assigner Coefficient — Mention</h3>
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:items-end">

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Matière</label>
          <select
            value={matiereId}
            onChange={(e) => onMatiereChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:min-w-[200px]"
          >
            <option value="">-- Choisir --</option>
            {matieres.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nom} — {m.semestre.name}
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
            value={mentionId}
            onChange={(e) => onMentionChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:min-w-[180px]"
          >
            <option value="">-- Choisir --</option>
            {mentions.map((m) => (
              <option key={m.id} value={m.id}>{m.abr || m.nom}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Niveau</label>
          <select
            value={niveauId}
            onChange={(e) => onNiveauChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:min-w-[100px]"
          >
            <option value="">-- Choisir --</option>
            {niveaux.map((n) => (
              <option key={n.id} value={n.id}>{n.nom}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Professeur</label>
          <select
            value={professeurId}
            onChange={(e) => onProfesseurChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:min-w-[160px]"
          >
            <option value="">-- Choisir --</option>
            {professeurs.map((p) => (
              <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onSubmit}
          disabled={saving || !canSubmit}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>

      </div>
    </div>
  );
}
