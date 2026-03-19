'use client';

import { useState, useEffect } from "react";
import PageTabs from "../shared/PageTabs";
import InsertionCoeffMentionForm from "./InsertionCoeffMentionForm";
import ListeMatiereCoeffTable from "./ListeMatiereCoeffTable";
import VoirEtudiantValidationTable from "./VoirEtudiantValidationTable";
import {
  getMatieresCoeff,
  getMatiereSemestres,
  getEtudiantNotesValidation,
  addMatiereCoeffMention,
  validerNote,
} from "../../services/chefMentionService";
import {
  MatiereCoeff,
  MatiereSemestre,
  EtudiantNoteValidation,
} from "../../types/notes";
import { Mention } from "@/lib/db";
import { useInitialData } from "@/context/DataContext";

const TABS = [
  { key: "insertion", label: "Insertion Matière Coefficients" },
  { key: "liste",     label: "Liste Matière Coefficient" },
  { key: "validation", label: "Voir Etudiant Validation" },
];

interface ChefMentionViewProps {
  /** Si true, l'utilisateur peut choisir la mention */
  isAdmin?: boolean;
  /** Mention fixe pour le Chef-Mention connecté */
  mentionFixe?: Mention;
}

export default function ChefMentionView({ isAdmin = false, mentionFixe }: ChefMentionViewProps) {
  const [activeTab, setActiveTab] = useState("insertion");

  // mentions et niveaux viennent du DataContext (même source que le reste de l'app)
  const { mentions, niveaux } = useInitialData();

  const [matieres, setMatieres] = useState<MatiereCoeff[]>([]);
  const [matiereSemestres, setMatiereSemestres] = useState<MatiereSemestre[]>([]);
  const [validations, setValidations] = useState<EtudiantNoteValidation[]>([]);
  const [selectedMatiere, setSelectedMatiere] = useState<MatiereCoeff | null>(null);

  useEffect(() => {
    Promise.all([getMatieresCoeff(), getMatiereSemestres()]).then(([m, ms]) => {
      setMatieres(m);
      setMatiereSemestres(ms);
    });
  }, []);

  const handleVoirEtudiant = async (matiere: MatiereCoeff) => {
    setSelectedMatiere(matiere);
    const data = await getEtudiantNotesValidation(matiere.id);
    setValidations(data);
    setActiveTab("validation");
  };

  const handleValider = async (etudiant: EtudiantNoteValidation) => {
    await validerNote(etudiant.id);
    setValidations((prev) =>
      prev.map((e) => (e.id === etudiant.id ? { ...e, status: "Valide" } : e))
    );
  };

  const handleAddCoeff = async (
    idMatiereSemestre: number,
    coefficient: number,
    idNiveau: number | string,
    idMention: number | string
  ) => {
    await addMatiereCoeffMention(idMatiereSemestre, coefficient, Number(idNiveau), Number(idMention));
    const updated = await getMatieresCoeff();
    setMatieres(updated);
    setActiveTab("liste");
  };

  return (
    <div>
      <PageTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "insertion" && (
        <InsertionCoeffMentionForm
          matiereSemestres={matiereSemestres}
          mentions={mentions}
          niveaux={niveaux}
          isAdmin={isAdmin}
          mentionFixe={mentionFixe}
          onSubmit={handleAddCoeff}
        />
      )}

      {activeTab === "liste" && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Liste Matière Coefficient Mention
          </h2>
          <ListeMatiereCoeffTable
            matieres={matieres}
            onModifier={(m) => console.log("Modifier", m)}
            onVoirEtudiant={handleVoirEtudiant}
          />
        </div>
      )}

      {activeTab === "validation" && (
        <div>
          {selectedMatiere && (
            <p className="text-xs text-gray-500 mb-3">
              Matière : <span className="font-medium text-gray-700">{selectedMatiere.nom}</span>
              {" — "}{selectedMatiere.semestre.nom}
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
