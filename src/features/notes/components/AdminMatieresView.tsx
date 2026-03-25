"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useInitialData } from "@/context/DataContext";
import {
  getMatieresCoeff,
  createMatiereCoeff,
} from "../services/notesService";
import { getEtudiantNotesValidation, validerNote } from "../services/chefMentionService";
import type { MatiereCoeffItem, EtudiantNoteValidation } from "../types/notes";
import { useUE } from "../hooks/useUE";
import { useMatiereSemestre } from "../hooks/useMatiereSemestre";
import { useProfesseursWithSelf } from "../hooks/useProfesseursWithSelf";
import PageTabs from "./shared/PageTabs";
import UEForm from "./admin/form/UEForm";
import UETable from "./admin/table/UETable";
import MatiereSemestreForm from "./admin/form/MatiereSemestreForm";
import MatiereSemestreTable from "./admin/table/MatiereSemestreTable";
import CoeffMentionSection from "./shared/CoeffMentionSection";
import VoirEtudiantValidationTable from "./chef-mention/table/VoirEtudiantValidationTable";

const TABS = [
  { key: "matieres", label: "Matières" },
  { key: "coeff", label: "Coeff & Mention" },
  { key: "ue", label: "UE" },
  { key: "validation", label: "Voir Etudiant Validation" },
];

export default function AdminMatieresView() {
  const { mentions, niveaux, professeurs: professeursBruts } = useInitialData();
  const professeurs = useProfesseursWithSelf(professeursBruts);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") ?? "matieres");

  useEffect(() => {
    const tab = searchParams.get("tab") ?? "matieres";
    setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.replace(`/notes/admin?tab=${tab}`, { scroll: false });
  };

  const ue = useUE();
  const mat = useMatiereSemestre();

  const [coeffMentions, setCoeffMentions] = useState<MatiereCoeffItem[]>([]);
  const [validations, setValidations] = useState<EtudiantNoteValidation[]>([]);
  const [selectedMatiere, setSelectedMatiere] = useState<MatiereCoeffItem | null>(null);
  const [annee, setAnnee] = useState(new Date().getFullYear());

  useEffect(() => {
    getMatieresCoeff(router).then(setCoeffMentions);
  }, []);

  const handleVoirEtudiant = async (matiere: MatiereCoeffItem) => {
    setSelectedMatiere(matiere);
    setValidations(await getEtudiantNotesValidation(matiere.id, annee, router));
    handleTabChange("validation");
  };

  const handleAnneeChange = async (nouvelleAnnee: number) => {
    setAnnee(nouvelleAnnee);
    if (selectedMatiere) {
      setValidations(await getEtudiantNotesValidation(selectedMatiere.id, nouvelleAnnee));
    }
  };

  const handleValider = async (etudiant: EtudiantNoteValidation) => {
    await validerNote(etudiant.id);
    setValidations((prev) =>
      prev.map((e) => (e.id === etudiant.id ? { ...e, status: "Valide" } : e))
    );
  };

  return (
    <div>
      <PageTabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

      {activeTab === "matieres" && (
        <div className="space-y-6">
          <MatiereSemestreForm
            ues={ue.ues}
            semestres={mat.semestres}
            name={mat.name}
            ueId={mat.ueId}
            semestreId={mat.semestreId}
            saving={mat.saving}
            onNameChange={mat.setName}
            onUeChange={mat.setUeId}
            onSemestreChange={mat.setSemestreId}
            onSubmit={mat.handleCreate}
          />
          <MatiereSemestreTable matieres={mat.matieres} />
        </div>
      )}

      {activeTab === "coeff" && (
        <CoeffMentionSection
          matieres={mat.matieres}
          mentions={mentions}
          niveaux={niveaux}
          professeurs={professeurs}
          isAdmin={true}
          coeffMentions={coeffMentions}
          onSubmit={async ({ matiereId, mentionId, niveauId, professeurId, coefficient }) => {
            await createMatiereCoeff(matiereId, mentionId, niveauId, professeurId!, coefficient);
            setCoeffMentions(await getMatieresCoeff());
          }}
          onVoirEtudiant={handleVoirEtudiant}
        />
      )}

      {activeTab === "ue" && (
        <div className="space-y-6">
          <UEForm
            name={ue.name}
            saving={ue.saving}
            onNameChange={ue.setName}
            onSubmit={ue.handleCreate}
          />
          <UETable ues={ue.ues} />
        </div>
      )}

      {activeTab === "validation" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            {selectedMatiere && (
              <p className="text-xs text-gray-500">
                Matière :{" "}
                <span className="font-medium text-gray-700">{selectedMatiere.matiere.nom}</span>
                {" — "}{selectedMatiere.semestre.name}
              </p>
            )}
            <div className="flex items-center gap-2 sm:ml-auto">
              <label className="text-xs text-gray-500 shrink-0">Année :</label>
              <select
                value={annee}
                onChange={(e) => handleAnneeChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {[annee - 2, annee - 1, annee, annee + 1].map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
          <VoirEtudiantValidationTable
            etudiants={validations}
            onValider={handleValider}
          />
        </div>
      )}
    </div>
  );
}
