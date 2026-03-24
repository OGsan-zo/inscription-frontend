import type { MatiereCoeffItem } from "../../../types/notes";

interface Props {
  coeffMentions: MatiereCoeffItem[];
  onVoirEtudiant?: (item: MatiereCoeffItem) => void;
  onModifier?: (item: MatiereCoeffItem) => void;
}

export default function CoeffMentionTable({ coeffMentions, onVoirEtudiant, onModifier }: Props) {
  const showActions = !!onVoirEtudiant || !!onModifier;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">
          Liste Matière — Coefficient — Mention
        </h3>
      </div>

      {coeffMentions.length === 0 ? (
        <p className="text-center py-10 text-slate-400">Aucune entrée enregistrée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">UE</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Matière</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Semestre</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Mention</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Niveau</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Coef</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Crédit</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Professeur</th>
                {showActions && (
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {coeffMentions.map((cm) => (
                <tr key={cm.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-900">{cm.ue}</td>
                  <td className="px-6 py-3 font-medium text-slate-900">{cm.matiere.nom}</td>
                  <td className="px-6 py-3">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                      {cm.semestre.name}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">
                      {cm.mention.abr || cm.mention.nom}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-semibold">
                      {cm.niveau.nom}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-bold text-slate-700">{cm.coefficient}</td>
                  <td className="px-6 py-3 font-bold text-slate-700">{cm.credit}</td>
                  <td className="px-6 py-3 text-slate-600">
                    {cm.professeur.nom} {cm.professeur.prenom}
                  </td>
                  {showActions && (
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        {onModifier && (
                          <button
                            onClick={() => onModifier(cm)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded"
                          >
                            Modifier
                          </button>
                        )}
                        {onVoirEtudiant && (
                          <button
                            onClick={() => onVoirEtudiant(cm)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded"
                          >
                            Voir Etudiant
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
