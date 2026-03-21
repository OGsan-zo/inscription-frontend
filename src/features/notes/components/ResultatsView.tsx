"use client";

import { useState } from "react";
import { rechercherEtudiants, getResultatEtudiant, getSemestres } from "../services/notesService";
import type { EtudiantRecherche, ResultatEtudiant, Semestre } from "../types/notes";
import RechercheEtudiant from "@/components/shared/RechercheEtudiant";
import SemestreSelect from "./resultats/form/SemestreSelect";
import ResultatsTable from "./resultats/table/ResultatsTable";
import { Card } from "@/components/ui/card";

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
    setResultatsRecherche(await rechercherEtudiants(nom, prenom));
    setSearching(false);
  };

  const handleSelectEtudiant = async (e: EtudiantRecherche) => {
    setEtudiantSelectionne(e);
    setSemestres(await getSemestres());
    setIdSemestre("");
    setStep("semestre");
  };

  const handleValiderSemestre = async () => {
    if (!etudiantSelectionne || !idSemestre) return;
    setLoadingResultat(true);
    setResultat(await getResultatEtudiant(etudiantSelectionne.id, Number(idSemestre)));
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
    <Card className="max-w-4xl mx-auto p-6 shadow-lg border-t-4 border-blue-900 space-y-8">
      <RechercheEtudiant
        nom={nom}
        prenom={prenom}
        loading={searching}
        resultats={resultatsRecherche}
        etudiantSelectionne={etudiantSelectionne}
        onNomChange={setNom}
        onPrenomChange={setPrenom}
        onRecherche={handleRecherche}
        onSelectEtudiant={handleSelectEtudiant}
      />

      {step !== "recherche" && etudiantSelectionne && (
        <SemestreSelect
          etudiant={etudiantSelectionne}
          semestres={semestres}
          idSemestre={idSemestre}
          loading={loadingResultat}
          onSemestreChange={setIdSemestre}
          onValider={handleValiderSemestre}
          onReset={reset}
        />
      )}

      {step === "resultats" && (
        <ResultatsTable resultat={resultat} />
      )}
    </Card>
  );
}
