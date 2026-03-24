import type { ResultatEtudiant } from "../../../types/notes";
import ResultatsTableHeader from "./sub-component/ResultatsTableHeader";
import ResultatsUEGroup from "./sub-component/ResultatsUEGroup";

interface Props {
  resultat: ResultatEtudiant | null;
}

const SESSION_COLORS: Record<string, string> = {
  Normale:    "bg-blue-900 text-white",
  Rattrapage: "bg-amber-600 text-white",
  Final:      "bg-emerald-700 text-white",
};

export default function ResultatsTable({ resultat }: Props) {
  if (!resultat || resultat.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 px-6 py-12 text-center text-slate-400">
        Aucun résultat disponible pour ce semestre.
      </div>
    );
  }

  const sessionsAvecDonnees = resultat.filter((s) => s.notesListes.length > 0);

  if (sessionsAvecDonnees.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 px-6 py-12 text-center text-slate-400">
        Aucune note enregistrée pour ce semestre.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sessionsAvecDonnees.map((session) => (
        <div key={session.type} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className={`px-6 py-3 flex items-center justify-between ${SESSION_COLORS[session.type] ?? "bg-slate-800 text-white"}`}>
            <h3 className="text-sm font-bold uppercase tracking-wide">Session {session.type}</h3>
            <span className="text-sm font-semibold">Moyenne : {session.moyenne}/20</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <ResultatsTableHeader />
              <tbody>
                {session.notesListes.map((ue) => (
                  <ResultatsUEGroup key={ue.ue} ue={ue} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
