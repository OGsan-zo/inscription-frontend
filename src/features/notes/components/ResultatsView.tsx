"use client";

import { useState, Fragment } from "react";
import { rechercherEtudiants, getResultatEtudiant, getSemestres } from "../services/notesService";
import type { EtudiantRecherche, ResultatEtudiant, Semestre } from "../types/notes";

type Step = "recherche" | "semestre" | "resultats";

export default function ResultatsView() {
  const [step, setStep] = useState<Step>("recherche");

  // Étape 1 — Recherche
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [resultatsRecherche, setResultatsRecherche] = useState<EtudiantRecherche[]>([]);
  const [searching, setSearching] = useState(false);

  // Étape 2 — Semestre
  const [etudiantSelectionne, setEtudiantSelectionne] = useState<EtudiantRecherche | null>(null);
  const [semestres, setSemestres] = useState<Semestre[]>([]);
  const [idSemestre, setIdSemestre] = useState("");

  // Étape 3 — Résultats
  const [resultat, setResultat] = useState<ResultatEtudiant | null>(null);
  const [loadingResultat, setLoadingResultat] = useState(false);

  const handleRecherche = async () => {
    if (!nom.trim()) return;
    setSearching(true);
    const res = await rechercherEtudiants(nom, prenom);
    setResultatsRecherche(res);
    setSearching(false);
  };

  const handleSelectEtudiant = async (e: EtudiantRecherche) => {
    setEtudiantSelectionne(e);
    const sems = await getSemestres();
    setSemestres(sems);
    setIdSemestre("");
    setStep("semestre");
  };

  const handleValiderSemestre = async () => {
    if (!etudiantSelectionne || !idSemestre) return;
    setLoadingResultat(true);
    const res = await getResultatEtudiant(etudiantSelectionne.id, Number(idSemestre));
    setResultat(res);
    setStep("resultats");
    setLoadingResultat(false);
  };

  const reset = () => {
    setStep("recherche");
    setNom("");
    setPrenom("");
    setResultatsRecherche([]);
    setEtudiantSelectionne(null);
    setIdSemestre("");
    setResultat(null);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* ── Étape 1 : Recherche ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-base font-bold text-slate-900 mb-5">Recherche Étudiant</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nom</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRecherche()}
              placeholder="ex: RANDRIA"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Prénom</label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRecherche()}
              placeholder="ex: Dode"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
          </div>
          <button
            onClick={handleRecherche}
            disabled={searching || !nom.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {searching ? "Recherche..." : "Valider"}
          </button>
        </div>

        {/* Résultats de recherche */}
        {resultatsRecherche.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {resultatsRecherche.map((e) => (
              <button
                key={e.id}
                onClick={() => handleSelectEtudiant(e)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors text-left ${
                  etudiantSelectionne?.id === e.id
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                }`}
              >
                <span className="font-semibold text-slate-900">{e.nom} {e.prenom}</span>
                <span className="text-xs text-slate-500">{e.mention} — {e.niveau}</span>
              </button>
            ))}
          </div>
        )}

        {resultatsRecherche.length === 0 && nom && !searching && (
          <p className="mt-4 text-sm text-slate-400">Aucun étudiant trouvé.</p>
        )}
      </div>

      {/* ── Étape 2 : Sélection Semestre ── */}
      {step !== "recherche" && etudiantSelectionne && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Sélection du Semestre</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Étudiant : <span className="font-semibold text-slate-700">{etudiantSelectionne.nom} {etudiantSelectionne.prenom}</span>
              </p>
            </div>
            <button onClick={reset} className="text-xs text-slate-400 hover:text-slate-600 underline">Recommencer</button>
          </div>

          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Semestre</label>
              <select
                value={idSemestre}
                onChange={(e) => setIdSemestre(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
              >
                <option value="">-- Choisir --</option>
                {semestres.map((s) => (
                  <option key={s.id} value={s.id}>{s.nom}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleValiderSemestre}
              disabled={loadingResultat || !idSemestre}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {loadingResultat ? "Chargement..." : "Valider"}
            </button>
          </div>
        </div>
      )}

      {/* ── Étape 3 : Tableau Résultats ── */}
      {step === "resultats" && (
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
                        <tr key={`ue-${ue.id}`} className="bg-indigo-50 border-b border-indigo-100">
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
      )}

    </div>
  );
}
