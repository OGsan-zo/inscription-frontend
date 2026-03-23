import { Fragment } from "react";
import type { ResultatEtudiant } from "../../../types/notes";
import ResultatsTableHeader from "./sub-component/ResultatsTableHeader";
import ResultatsUERow from "./sub-component/ResultatsUERow";
import ResultatsECRow from "./sub-component/ResultatsECRow";

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
          <div key={session.semestre.id} className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <ResultatsTableHeader />
              <tbody>
                {session.ues.map((ue) => (
                  <Fragment key={ue.id}>
                  
                    <ResultatsUERow ue={ue} />
                    
                    {ue.ecs.map((ec) => (
                      <ResultatsECRow key={`ec-${ec.id}`} ec={ec} />
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
