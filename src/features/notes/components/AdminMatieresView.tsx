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

const TABS = [
  { key: "matieres", label: "Matières" },
  { key: "ue", label: "UE" },
];

export default function AdminMatieresView() {
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
