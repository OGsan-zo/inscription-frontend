'use client';

import { useState, useEffect } from "react";
import PageTabs from "../shared/PageTabs";
import CoeffMentionSection from "../shared/CoeffMentionSection";
import VoirEtudiantValidationTable from "./table/VoirEtudiantValidationTable";
import {
  getEtudiantNotesValidation,
  addMatiereCoeffMention,
  validerNote,
} from "../../services/chefMentionService";
import {
  getMatieres,
  getMatieresCoeff,
} from "../../services/notesService";
import type {
  MatiereUE,
  MatiereCoeffItem,
  EtudiantNoteValidation,
} from "../../types/notes";
import { useInitialData } from "@/context/DataContext";
import { useProfesseursWithSelf } from "../../hooks/useProfesseursWithSelf";

const TABS = [
  { key: "coeff",      label: "Matières & Coefficients" },
  { key: "validation", label: "Voir Etudiant Validation" },
];

interface ChefMentionViewProps {
  userId?: string;
}

export default function ChefMentionView({ userId }: ChefMentionViewProps) {
  const [activeTab, setActiveTab] = useState("coeff");
  const { mentions, niveaux, professeurs: professeursBruts } = useInitialData();
  const professeurs = useProfesseursWithSelf(professeursBruts);

  const currentYear = new Date().getFullYear();

  const [matieres, setMatieres] = useState<MatiereUE[]>([]);
  const [coeffMentions, setCoeffMentions] = useState<MatiereCoeffItem[]>([]);
  const [validations, setValidations] = useState<EtudiantNoteValidation[]>([]);
  const [selectedMatiere, setSelectedMatiere] = useState<MatiereCoeffItem | null>(null);
  const [annee, setAnnee] = useState(currentYear);

  useEffect(() => {
    Promise.all([getMatieres(), getMatieresCoeff()]).then(([ms, cm]) => {
      setMatieres(ms);
      setCoeffMentions(cm);
    });
  }, []);

  const handleVoirEtudiant = async (matiere: MatiereCoeffItem) => {
    setSelectedMatiere(matiere);
    setValidations(await getEtudiantNotesValidation(matiere.id, annee));
    setActiveTab("validation");
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
      <PageTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "coeff" && (
        <CoeffMentionSection
          matieres={matieres}
          mentions={mentions}
          niveaux={niveaux}
          professeurs={professeurs}
          overrideMentionId={userId}
          coeffMentions={coeffMentions}
          onSubmit={async ({ matiereId, mentionId, niveauId, professeurId, coefficient }) => {
            await addMatiereCoeffMention(matiereId, coefficient, niveauId, mentionId, professeurId);
            setCoeffMentions(await getMatieresCoeff());
          }}
          onModifier={(m) => console.log("Modifier", m)}
          onVoirEtudiant={handleVoirEtudiant}
        />
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
                {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((a) => (
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
