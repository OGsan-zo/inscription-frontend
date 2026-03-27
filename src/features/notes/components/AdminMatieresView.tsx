"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageTabs from "./shared/PageTabs";
import UEForm from "./admin/form/UEForm";
import UETable from "./admin/table/UETable";
import MatiereSemestreForm from "./admin/form/MatiereSemestreForm";
import MatiereSemestreTable from "./admin/table/MatiereSemestreTable";
import AdminNotesDashboard from "./admin/AdminNotesDashboard";
import { useUE } from "../hooks/useUE";
import { useMatiereSemestre } from "../hooks/useMatiereSemestre";
import toast from "react-hot-toast";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "matieres", label: "Matières" },
  { key: "ue", label: "UE" },
];

export default function AdminMatieresView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") ?? "dashboard");

  useEffect(() => {
    const tab = searchParams.get("tab") ?? "dashboard";
    setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.replace(`/notes/admin?tab=${tab}`, { scroll: false });
  };

  const ue = useUE();
  const mat = useMatiereSemestre();

  const handleUpdateUE = async (id: number, newName: string) => {
    await ue.handleUpdate(id, newName);
    toast.success("UE mise à jour");
  };

  const handleUpdateMatiere = async (id: number, values: { name: string; ueId: string; semestreId: string }) => {
    await mat.handleUpdate(id, values.name, Number(values.ueId), Number(values.semestreId));
    toast.success("Matière mise à jour");
  };

  return (
    <div>
      <PageTabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

      {activeTab === "dashboard" && (
        <AdminNotesDashboard onTabChange={handleTabChange} />
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
          <MatiereSemestreTable
            matieres={mat.matieres}
            ues={ue.ues}
            semestres={mat.semestres}
            onModifier={handleUpdateMatiere}
          />
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
          <UETable ues={ue.ues} onModifier={handleUpdateUE} />
        </div>
      )}
    </div>
  );
}
