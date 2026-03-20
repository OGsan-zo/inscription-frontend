interface Props {
  name: string;
  saving: boolean;
  onNameChange: (v: string) => void;
  onSubmit: () => void;
}

export default function UEForm({ name, saving, onNameChange, onSubmit }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="text-base font-bold text-slate-900 mb-5">Créer une UE</h3>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Nom de l&apos;UE
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="ex: Mathématique de l'ingénieur"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onSubmit}
          disabled={saving || !name.trim()}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
