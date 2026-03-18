import type { Parcours } from "../type/typeParcours";

interface Props {
  parcours: Parcours[];
  loading: boolean;
  onEdit: (p: Parcours) => void;
  onDelete: (p: Parcours) => void;
}

export default function ParcoursTable({ parcours, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 bg-white rounded-2xl border border-slate-200">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-500">Chargement de la liste...</p>
      </div>
    );
  }

  if (parcours.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
        <p className="text-slate-500 font-medium">Aucun parcours trouvé.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Nom du parcours</th>
            <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Mention</th>
            <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Niveau</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {parcours.map((p, i) => (
            <tr key={p.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
              <td className="px-6 py-4 font-semibold text-slate-900">{p.nom}</td>
              <td className="px-6 py-4">
                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                  {p.mention?.abr || p.mention?.nom}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-medium">
                  {p.niveau?.nom}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(p)}
                    className="px-4 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    className="px-4 py-1.5 text-xs font-semibold text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
