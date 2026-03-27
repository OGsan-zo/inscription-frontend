import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUEs, getMatieres, getMatieresCoeff } from "../services/notesService";
import { useInitialData } from "@/context/DataContext";
import type { UE, MatiereUE, MatiereCoeffItem } from "../types/notes";

export interface MatiereParMention {
  mentionNom: string;
  count: number;
}

export interface AdminNotesDashboardData {
  totalUE: number;
  totalMatieres: number;
  totalCoeffs: number;
  matieresNonAssignees: MatiereUE[];
  mentionsSansChef: number;
  totalProfesseurs: number;
  totalChefMentions: number;
  matieresParMention: MatiereParMention[];
  loading: boolean;
}

export function useAdminNotesDashboard(): AdminNotesDashboardData {
  const router = useRouter();
  const { mentions } = useInitialData();
  const [ues, setUEs] = useState<UE[]>([]);
  const [matieres, setMatieres] = useState<MatiereUE[]>([]);
  const [coeffs, setCoeffs] = useState<MatiereCoeffItem[]>([]);
  const [totalProfesseurs, setTotalProfesseurs] = useState(0);
  const [totalChefMentions, setTotalChefMentions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getUEs(router),
      getMatieres(router),
      getMatieresCoeff(router),
      fetch("/api/users").then((r) => r.json()).catch(() => ({ data: [] })),
    ]).then(([uesData, matieresData, coeffsData, usersJson]) => {
      setUEs(uesData);
      setMatieres(matieresData);
      setCoeffs(coeffsData);
      const users: { role?: string }[] = usersJson?.data ?? usersJson ?? [];
      setTotalProfesseurs(users.filter((u) => u.role === "Professeur").length);
      setTotalChefMentions(users.filter((u) => u.role === "ChefMention").length);
      setLoading(false);
    });
  }, [router]);

  const assignedMatiereIds = new Set(coeffs.map((c) => c.matiere.id));
  const matieresNonAssignees = matieres.filter((m) => !assignedMatiereIds.has(m.id));
  const mentionsSansChef = mentions.filter((m) => !m.chefMentionId).length;

  // Nb matières par mention (depuis les coefficients assignés)
  const mentionCountMap = new Map<string, number>();
  for (const c of coeffs) {
    const nom = c.mention?.nom ?? "Inconnue";
    mentionCountMap.set(nom, (mentionCountMap.get(nom) ?? 0) + 1);
  }
  const matieresParMention: MatiereParMention[] = Array.from(mentionCountMap.entries())
    .map(([mentionNom, count]) => ({ mentionNom, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalUE: ues.length,
    totalMatieres: matieres.length,
    totalCoeffs: coeffs.length,
    matieresNonAssignees,
    mentionsSansChef,
    totalProfesseurs,
    totalChefMentions,
    matieresParMention,
    loading,
  };
}
