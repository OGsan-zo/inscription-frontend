import type { MatiereUE } from "../../../types/notes";

interface Props {
  matieres: MatiereUE[];
}

export default function MatiereSemestreTable({ matieres }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">Liste des Matières</h3>
      </div>
      {matieres.length === 0 ? (
        <p className="text-center py-10 text-slate-400">Aucune matière enregistrée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Matière</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">UE</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Semestre</th>
              </tr>
            </thead>
            <tbody>
              {matieres.map((m) => (
                <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-900">{m.nom}</td>
                  <td className="px-6 py-3 text-slate-600">{m.ue.name}</td>
                  <td className="px-6 py-3">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{m.semestre.name}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
