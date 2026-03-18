import type { Mention, Niveau } from "@/lib/db";
import type { Parcours } from "../type/typeParcours";

export type FormData = { nom: string; idMention: string; idNiveau: string };

interface Props {
  editTarget: Parcours | null;
  form: FormData;
  mentions: Mention[];
  niveaux: Niveau[];
  saving: boolean;
  error: string;
  onFormChange: (f: FormData) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function ParcoursModal({
  editTarget,
  form,
  mentions,
  niveaux,
  saving,
  error,
  onFormChange,
  onSave,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">
          {editTarget ? "Modifier le parcours" : "Nouveau parcours"}
        </h3>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Nom du parcours</label>
            <input
              type="text"
              value={form.nom}
              onChange={(e) => onFormChange({ ...form, nom: e.target.value })}
              placeholder="ex: Génie Logiciel"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Mention</label>
            <select
              value={form.idMention}
              onChange={(e) => onFormChange({ ...form, idMention: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choisir une mention --</option>
              {mentions.map((m) => (
                <option key={m.id} value={String(m.id)}>{m.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Niveau</label>
            <select
              value={form.idNiveau}
              onChange={(e) => onFormChange({ ...form, idNiveau: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choisir un niveau --</option>
              {niveaux.map((n) => (
                <option key={n.id} value={String(n.id)}>{n.nom}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : editTarget ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}
