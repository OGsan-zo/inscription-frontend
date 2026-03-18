import { Fragment } from "react";
import type { ResultatEtudiant } from "../../../types/notes";

interface Props {
  resultat: ResultatEtudiant | null;
}

export default function ResultatsTable({ resultat }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">SESSION NORMALE</h3>
      </div>

      {!resultat || resultat.resultats.length === 0 ? (
        <p className="text-center py-12 text-slate-400">Aucun résultat disponible pour ce semestre.</p>
      ) : (
        resultat.resultats.map((session) => (
          <div key={session.semestre.id}>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/3">UE / EC</th>
                  <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Coef</th>
                  <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Crédit</th>
                  <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">EC /20</th>
                  <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">EC×Coef</th>
                  <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">UE /20</th>
                  <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Résultat</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {session.ues.map((ue) => (
                  <Fragment key={ue.id}>
                    {/* Ligne UE */}
                    <tr className="bg-indigo-50 border-b border-indigo-100">
                      <td colSpan={5} className="px-6 py-2 font-bold text-indigo-800 text-sm">{ue.nomUE}</td>
                      <td className="text-center px-4 py-2 font-bold text-indigo-800">
                        {ue.ues20 != null ? ue.ues20 : "—"}
                      </td>
                      <td className="text-center px-4 py-2">
                        {ue.ues20 != null && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${ue.ues20 >= 10 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                            {ue.ues20 >= 10 ? "Validé" : "Non validé"}
                          </span>
                        )}
                      </td>
                      <td></td>
                    </tr>

                    {/* Lignes EC */}
                    {ue.ecs.map((ec) => (
                      <tr key={`ec-${ec.id}`} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-3 pl-10 text-slate-700">{ec.nomEC}</td>
                        <td className="text-center px-4 py-3 text-slate-600">{ec.coefficient}</td>
                        <td className="text-center px-4 py-3 text-slate-600">{ec.credit}</td>
                        <td className="text-center px-4 py-3 font-semibold text-slate-900">
                          {ec.noteSur20 != null ? ec.noteSur20 : "—"}
                        </td>
                        <td className="text-center px-4 py-3 text-slate-600">
                          {ec.ecAvecCoef != null ? ec.ecAvecCoef : "—"}
                        </td>
                        <td className="text-center px-4 py-3 text-slate-400">—</td>
                        <td className="text-center px-4 py-3">
                          {ec.resultat && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${ec.resultat === "Validé" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                              {ec.resultat}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-xs font-semibold text-blue-500 hover:underline">
                            Modifier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
