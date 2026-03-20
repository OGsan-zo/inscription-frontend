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
import { Mention } from "@/lib/db";
import { useInitialData } from "@/context/DataContext";

const TABS = [
  { key: "coeff",      label: "Matières & Coefficients" },
  { key: "validation", label: "Voir Etudiant Validation" },
];

interface ChefMentionViewProps {
  isAdmin?: boolean;
  mentionFixe?: Mention;
}

export default function ChefMentionView({ isAdmin = false, mentionFixe }: ChefMentionViewProps) {
  const [activeTab, setActiveTab] = useState("coeff");
  const { mentions, niveaux } = useInitialData();

  const [matieres, setMatieres] = useState<MatiereUE[]>([]);
  const [coeffMentions, setCoeffMentions] = useState<MatiereCoeffItem[]>([]);
  const [validations, setValidations] = useState<EtudiantNoteValidation[]>([]);
  const [selectedMatiere, setSelectedMatiere] = useState<MatiereCoeffItem | null>(null);

  useEffect(() => {
    Promise.all([getMatieres(), getMatieresCoeff()]).then(([ms, cm]) => {
      setMatieres(ms);
      setCoeffMentions(cm);
    });
  }, []);

  const handleVoirEtudiant = async (matiere: MatiereCoeffItem) => {
    setSelectedMatiere(matiere);
    setValidations(await getEtudiantNotesValidation(matiere.id));
    setActiveTab("validation");
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
          isAdmin={isAdmin}
          mentionFixe={mentionFixe}
          coeffMentions={coeffMentions}
          onSubmit={async ({ matiereId, mentionId, niveauId, coefficient }) => {
            await addMatiereCoeffMention(matiereId, coefficient, niveauId, mentionId);
            setCoeffMentions(await getMatieresCoeff());
          }}
          onModifier={(m) => console.log("Modifier", m)}
          onVoirEtudiant={handleVoirEtudiant}
        />
      )}

      {activeTab === "validation" && (
        <div>
          {selectedMatiere && (
            <p className="text-xs text-gray-500 mb-3">
              Matière :{" "}
              <span className="font-medium text-gray-700">{selectedMatiere.matiere.nom}</span>
              {" — "}{selectedMatiere.semestre.name}
            </p>
          )}
          <VoirEtudiantValidationTable
            etudiants={validations}
            onValider={handleValider}
          />
        </div>
      )}
    </div>
  );
}
