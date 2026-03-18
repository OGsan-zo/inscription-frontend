import type { MatiereCoefficientMention } from "../../../types/notes";

interface Props {
  coeffMentions: MatiereCoefficientMention[];
}

export default function CoeffMentionTable({ coeffMentions }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">Liste Matière Coefficient Mention</h3>
      </div>
      {coeffMentions.length === 0 ? (
        <p className="text-center py-10 text-slate-400">Aucune entrée enregistrée.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Matière</th>
              <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Semestre</th>
              <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Mention</th>
              <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Coefficient</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {coeffMentions.map((cm) => (
              <tr key={cm.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-3 font-medium text-slate-900">{cm.matiereSemestre.matiere.nom}</td>
                <td className="px-6 py-3">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{cm.matiereSemestre.semestre.nom}</span>
                </td>
                <td className="px-6 py-3">
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">{cm.mention.abr || cm.mention.nom}</span>
                </td>
                <td className="px-6 py-3 font-bold text-slate-700">{cm.coefficient}</td>
                <td className="px-6 py-3 text-right">
                  <button className="px-4 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
