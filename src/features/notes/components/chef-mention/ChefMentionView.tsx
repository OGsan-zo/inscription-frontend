'use client';

import { useState, useEffect } from "react";
import PageTabs from "../shared/PageTabs";
import InsertionCoeffMentionForm from "./form/InsertionCoeffMentionForm";
import ListeMatiereCoeffTable from "./table/ListeMatiereCoeffTable";
import VoirEtudiantValidationTable from "./table/VoirEtudiantValidationTable";
import MatiereSemestreForm from "../admin/form/MatiereSemestreForm";
import MatiereSemestreTable from "../admin/table/MatiereSemestreTable";
import CoeffMentionForm from "../admin/form/CoeffMentionForm";
import CoeffMentionTable from "../admin/table/CoeffMentionTable";
import UEForm from "../admin/form/UEForm";
import UETable from "../admin/table/UETable";
import {
  getMatieresCoeff as getChefMatieresCoeff,
  getMatiereSemestres,
  getEtudiantNotesValidation,
  addMatiereCoeffMention,
  validerNote,
} from "../../services/chefMentionService";
import {
  getMatieresCoeff as getAdminMatieresCoeff,
  createMatiereCoeff,
  getProfesseurs,
} from "../../services/notesService";
import { useUE } from "../../hooks/useUE";
import { useMatiereSemestre } from "../../hooks/useMatiereSemestre";
import type {
  MatiereCoeff,
  MatiereSemestre,
  EtudiantNoteValidation,
  MatiereCoeffItem,
  Professeur,
} from "../../types/notes";
import { Mention } from "@/lib/db";
import { useInitialData } from "@/context/DataContext";

const TABS = [
  { key: "insertion",  label: "Insertion Matière Coefficients" },
  { key: "liste",      label: "Liste Matière Coefficient" },
  { key: "validation", label: "Voir Etudiant Validation" },
  { key: "matieres",   label: "Matières" },
  { key: "coeff",      label: "Coeff & Mention" },
  { key: "ue",         label: "UE" },
];

interface ChefMentionViewProps {
  isAdmin?: boolean;
  mentionFixe?: Mention;
}

export default function ChefMentionView({ isAdmin = false, mentionFixe }: ChefMentionViewProps) {
  const [activeTab, setActiveTab] = useState("insertion");
  const { mentions, niveaux } = useInitialData();

  // ── Hooks métier ───────────────────────────────────────────────────────
  const ue = useUE();
  const mat = useMatiereSemestre();

  // ── État Chef-Mention ──────────────────────────────────────────────────
  const [matieres, setMatieres] = useState<MatiereCoeff[]>([]);
  const [matiereSemestres, setMatiereSemestres] = useState<MatiereSemestre[]>([]);
  const [validations, setValidations] = useState<EtudiantNoteValidation[]>([]);
  const [selectedMatiere, setSelectedMatiere] = useState<MatiereCoeff | null>(null);

  // ── État CoeffMention (admin) ──────────────────────────────────────────
  const [coeffMentions, setCoeffMentions] = useState<MatiereCoeffItem[]>([]);
  const [professeurs, setProfesseurs] = useState<Professeur[]>([]);
  const [cMatiereId, setCMatiereId] = useState("");
  const [cCoeff, setCCoeff] = useState("");
  const [cMentionId, setCMentionId] = useState("");
  const [cNiveauId, setCNiveauId] = useState("");
  const [cProfesseurId, setCProfesseurId] = useState("");
  const [cSaving, setCSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      getChefMatieresCoeff(),
      getMatiereSemestres(),
      getAdminMatieresCoeff(),
      getProfesseurs(),
    ]).then(([m, ms, cm, p]) => {
      setMatieres(m);
      setMatiereSemestres(ms);
      setCoeffMentions(cm);
      setProfesseurs(p);
    });
  }, []);

  // ── Handlers Chef-Mention ──────────────────────────────────────────────
  const handleVoirEtudiant = async (matiere: MatiereCoeff) => {
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

  const handleAddCoeff = async (
    idMatiereSemestre: number,
    coefficient: number,
    idNiveau: number | string,
    idMention: number | string
  ) => {
    await addMatiereCoeffMention(idMatiereSemestre, coefficient, Number(idNiveau), Number(idMention));
    setMatieres(await getChefMatieresCoeff());
    setActiveTab("liste");
  };

  // ── Handler CoeffMention (admin) ───────────────────────────────────────
  const handleCreateCoeffMention = async () => {
    if (!cMatiereId || !cCoeff || !cMentionId || !cNiveauId || !cProfesseurId) return;
    setCSaving(true);
    await createMatiereCoeff(
      Number(cMatiereId),
      Number(cMentionId),
      Number(cNiveauId),
      Number(cProfesseurId),
      Number(cCoeff)
    );
    setCoeffMentions(await getAdminMatieresCoeff());
    setCMatiereId(""); setCCoeff(""); setCMentionId(""); setCNiveauId(""); setCProfesseurId("");
    setCSaving(false);
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
        <div className="space-y-6">
          <CoeffMentionForm
            matieres={mat.matieres}
            mentions={mentions}
            niveaux={niveaux}
            professeurs={professeurs}
            matiereId={cMatiereId}
            coeff={cCoeff}
            mentionId={cMentionId}
            niveauId={cNiveauId}
            professeurId={cProfesseurId}
            saving={cSaving}
            onMatiereChange={setCMatiereId}
            onCoeffChange={setCCoeff}
            onMentionChange={setCMentionId}
            onNiveauChange={setCNiveauId}
            onProfesseurChange={setCProfesseurId}
            onSubmit={handleCreateCoeffMention}
          />
          <CoeffMentionTable coeffMentions={coeffMentions} />
        </div>
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
    </div>
  );
}
