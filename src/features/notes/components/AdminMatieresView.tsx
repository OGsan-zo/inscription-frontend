"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useInitialData } from "@/context/DataContext";
import {
  getMatieresCoeff,
  createMatiereCoeff,
} from "../services/notesService";
import type { MatiereCoeffItem } from "../types/notes";
import { useUE } from "../hooks/useUE";
import { useMatiereSemestre } from "../hooks/useMatiereSemestre";
import PageTabs from "./shared/PageTabs";
import UEForm from "./admin/form/UEForm";
import UETable from "./admin/table/UETable";
import MatiereSemestreForm from "./admin/form/MatiereSemestreForm";
import MatiereSemestreTable from "./admin/table/MatiereSemestreTable";
import CoeffMentionSection from "./shared/CoeffMentionSection";

const TABS = [
  { key: "matieres", label: "Matières" },
  { key: "coeff", label: "Coeff & Mention" },
  { key: "ue", label: "UE" },
];

export default function AdminMatieresView() {
  const { mentions, niveaux, professeurs } = useInitialData();
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

  useEffect(() => {
    getMatieresCoeff().then(setCoeffMentions);
  }, []);

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
    </div>
  );
}
