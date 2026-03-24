import type { MatiereCoeffItem, EtudiantNotesProfesseur } from "../types/notes";
import { handleApiError } from "../utils/handleApiError";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Type plat retourné par GET /notes/matieres-coeff/professeur
type FlatCoeff = {
  id: number;
  ue: string;
  coefficient: number;
  matiereId: number;
  matiereNom: string;
  semestreId: number;
  semestreNom: string;
  mentionId: number;
  mentionNom: string;
  niveauId: number;
  niveauNom: string;
  professeurId: number;
  professeurNom: string;
  professeurPrenom: string;
};

// --- Fonction utilitaire pour gérer la redirection ---
const login = process.env.NEXT_PUBLIC_LOGIN_URL || '/login';

const checkAuthAndRedirect = async (res: Response, router: AppRouterInstance) => {
  if (res.status === 401 || res.status === 403) {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(login);
    return true;
  }
  return false;
};

// ── Matières du professeur connecté ────────────────────────────────────────

export async function getProfesseurMatieres(router: AppRouterInstance): Promise<MatiereCoeffItem[]> {
  try {
    const res = await fetch("/api/notes/matieres-coeff/professeur");
    
    if (!res.ok) {
      if (await checkAuthAndRedirect(res, router)) return []; // Stop si redirection
      await handleApiError("getProfesseurMatieres", res); 
      return []; 
    }
    
    const json = await res.json();
    return (json.data ?? []).map((c: FlatCoeff): MatiereCoeffItem => ({
      id: c.id,
      ue: c.ue,
      matiere: { id: c.matiereId, nom: c.matiereNom },
      semestre: { id: c.semestreId, name: c.semestreNom },
      mention: { id: c.mentionId, nom: c.mentionNom },
      coefficient: c.coefficient,
      niveau: { id: c.niveauId, nom: c.niveauNom },
      professeur: { id: c.professeurId, nom: c.professeurNom, prenom: c.professeurPrenom },
    }));
  } catch (err) {
    await handleApiError("getProfesseurMatieres", undefined, err);
    return [];
  }
}

// ── Étudiants (notes) pour un professeur et une année ──────────────────────

export async function getEtudiantsForMatiere(
  matiereCoeffId: number,
  annee: number,
  router: AppRouterInstance
): Promise<EtudiantNotesProfesseur[]> {
  try {
    const res = await fetch(`/api/notes/matieres-coeff/professeur/${matiereCoeffId}?annee=${annee}`);
    
    if (!res.ok) {
      if (await checkAuthAndRedirect(res, router)) return []; // Stop si redirection
      await handleApiError("getEtudiantsForMatiere", res); 
      return []; 
    }
    
    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    await handleApiError("getEtudiantsForMatiere", undefined, err);
    return [];
  }
}

// ── Soumettre des notes ─────────────────────────────────────────────────────

export async function soumettreNotes(
  idMatiereCoefficient: number,
  annee: number,
  isNormale: boolean,
  listeEtudiants: { etudiantId: number; valeur: number }[],
  router: AppRouterInstance
): Promise<void> {
  try {
    const res = await fetch("/api/notes/matieres-coeff/professeur", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idMatiereCoefficient, annee, isNormale, listeEtudiants }),
    });

    if (!res.ok) {
      if (await checkAuthAndRedirect(res, router)) return; // Stop si redirection
      await handleApiError("soumettreNotes", res);
      throw new Error("Échec de la soumission des notes");
    }
  } catch (err) {
    if (!(err instanceof Error && err.message === "Échec de la soumission des notes")) {
      await handleApiError("soumettreNotes", undefined, err);
    }
    throw err;
  }
}