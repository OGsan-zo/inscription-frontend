"use client";

import { useState, useEffect } from "react";
import { useInitialData } from "@/context/DataContext";
import {
  getUEs,
  createUE,
  getSemestres,
  getMatieres,
  createMatiere,
  getMatieresCoeff,
  createMatiereCoeff,
  getProfesseurs,
} from "../services/notesService";
import type {
  UE,
  Semestre,
  MatiereUE,
  MatiereCoeffItem,
  Professeur,
} from "../types/notes";
import PageTabs from "./shared/PageTabs";
import UEForm from "./admin/form/UEForm";
import UETable from "./admin/table/UETable";
import MatiereSemestreForm from "./admin/form/MatiereSemestreForm";
import MatiereSemestreTable from "./admin/table/MatiereSemestreTable";
import CoeffMentionForm from "./admin/form/CoeffMentionForm";
import CoeffMentionTable from "./admin/table/CoeffMentionTable";

const TABS = [
  { key: "matieres", label: "Matières" },
  { key: "coeff", label: "Coeff & Mention" },
  { key: "ue", label: "UE" },
];

export default function AdminMatieresView() {
  const { mentions, niveaux } = useInitialData();

  const [activeTab, setActiveTab] = useState("matieres");

  const [ues, setUEs] = useState<UE[]>([]);
  const [semestres, setSemestres] = useState<Semestre[]>([]);
  const [matieres, setMatieres] = useState<MatiereUE[]>([]);
  const [coeffMentions, setCoeffMentions] = useState<MatiereCoeffItem[]>([]);
  const [professeurs, setProfesseurs] = useState<Professeur[]>([]);

  // Form UE
  const [ueName, setUEName] = useState("");
  const [ueSaving, setUESaving] = useState(false);

  // Form Matière
  const [matName, setMatName] = useState("");
  const [matUeId, setMatUeId] = useState("");
  const [matSemestreId, setMatSemestreId] = useState("");
  const [matSaving, setMatSaving] = useState(false);

  // Form CoeffMention
  const [cMatiereId, setCMatiereId] = useState("");
  const [cCoeff, setCCoeff] = useState("");
  const [cMentionId, setCMentionId] = useState("");
  const [cNiveauId, setCNiveauId] = useState("");
  const [cProfesseurId, setCProfesseurId] = useState("");
  const [cSaving, setCSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      getUEs(),
      getSemestres(),
      getMatieres(),
      getMatieresCoeff(),
      getProfesseurs(),
    ]).then(([u, s, m, cm, p]) => {
      setUEs(u);
      setSemestres(s);
      setMatieres(m);
      setCoeffMentions(cm);
      setProfesseurs(p);
    });
  }, []);

  const handleCreateUE = async () => {
    if (!ueName.trim()) return;
    setUESaving(true);
    await createUE(ueName.trim());
    setUEs(await getUEs());
    setUEName("");
    setUESaving(false);
  };

  const handleCreateMatiere = async () => {
    if (!matName.trim() || !matUeId || !matSemestreId) return;
    setMatSaving(true);
    await createMatiere(matName.trim(), Number(matUeId), Number(matSemestreId));
    setMatieres(await getMatieres());
    setMatName("");
    setMatUeId("");
    setMatSemestreId("");
    setMatSaving(false);
  };

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
    setCoeffMentions(await getMatieresCoeff());
    setCMatiereId("");
    setCCoeff("");
    setCMentionId("");
    setCNiveauId("");
    setCProfesseurId("");
    setCSaving(false);
  };

  return (
    <div>
      <PageTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "matieres" && (
        <div className="space-y-6">
          <MatiereSemestreForm
            ues={ues}
            semestres={semestres}
            name={matName}
            ueId={matUeId}
            semestreId={matSemestreId}
            saving={matSaving}
            onNameChange={setMatName}
            onUeChange={setMatUeId}
            onSemestreChange={setMatSemestreId}
            onSubmit={handleCreateMatiere}
          />
          <MatiereSemestreTable matieres={matieres} />
        </div>
      )}

      {activeTab === "coeff" && (
        <div className="space-y-6">
          <CoeffMentionForm
            matieres={matieres}
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
            name={ueName}
            saving={ueSaving}
            onNameChange={setUEName}
            onSubmit={handleCreateUE}
          />
          <UETable ues={ues} />
        </div>
      )}
    </div>
  );
}
