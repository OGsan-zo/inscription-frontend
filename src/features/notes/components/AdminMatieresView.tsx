"use client";

import { useState, useEffect } from "react";
import { useInitialData } from "@/context/DataContext";
import {
  getMatieresCoeff,
  createMatiereCoeff,
  getProfesseurs,
} from "../services/notesService";
import type { MatiereCoeffItem, Professeur } from "../types/notes";
import { useUE } from "../hooks/useUE";
import { useMatiereSemestre } from "../hooks/useMatiereSemestre";
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

  // Hooks métier
  const ue = useUE();
  const mat = useMatiereSemestre();

  // État CoeffMention (reste local — dépend de plusieurs sources)
  const [coeffMentions, setCoeffMentions] = useState<MatiereCoeffItem[]>([]);
  const [professeurs, setProfesseurs] = useState<Professeur[]>([]);
  const [cMatiereId, setCMatiereId] = useState("");
  const [cCoeff, setCCoeff] = useState("");
  const [cMentionId, setCMentionId] = useState("");
  const [cNiveauId, setCNiveauId] = useState("");
  const [cProfesseurId, setCProfesseurId] = useState("");
  const [cSaving, setCSaving] = useState(false);

  useEffect(() => {
    Promise.all([getMatieresCoeff(), getProfesseurs()]).then(([cm, p]) => {
      setCoeffMentions(cm);
      setProfesseurs(p);
    });
  }, []);

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
    setCMatiereId(""); setCCoeff(""); setCMentionId(""); setCNiveauId(""); setCProfesseurId("");
    setCSaving(false);
  };

  return (
    <div>
      <PageTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

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
