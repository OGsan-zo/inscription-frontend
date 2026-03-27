import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUEs, getMatieres, getMatieresCoeff } from "../services/notesService";
import { useInitialData } from "@/context/DataContext";
import type { UE, MatiereUE, MatiereCoeffItem } from "../types/notes";

export interface AdminNotesDashboardData {
  totalUE: number;
  totalMatieres: number;
  totalCoeffs: number;
  matieresNonAssignees: MatiereUE[];
  mentionsSansChef: number;
  loading: boolean;
}

export function useAdminNotesDashboard(): AdminNotesDashboardData {
  const router = useRouter();
  const { mentions } = useInitialData();
  const [ues, setUEs] = useState<UE[]>([]);
  const [matieres, setMatieres] = useState<MatiereUE[]>([]);
  const [coeffs, setCoeffs] = useState<MatiereCoeffItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getUEs(router),
      getMatieres(router),
      getMatieresCoeff(router),
    ]).then(([uesData, matieresData, coeffsData]) => {
      setUEs(uesData);
      setMatieres(matieresData);
      setCoeffs(coeffsData);
      setLoading(false);
    });
  }, [router]);

  const assignedMatiereIds = new Set(coeffs.map((c) => c.matiere.id));
  const matieresNonAssignees = matieres.filter((m) => !assignedMatiereIds.has(m.id));
  const mentionsSansChef = mentions.filter((m) => !m.chefMentionId).length;

  return {
    totalUE: ues.length,
    totalMatieres: matieres.length,
    totalCoeffs: coeffs.length,
    matieresNonAssignees,
    mentionsSansChef,
    loading,
  };
}
