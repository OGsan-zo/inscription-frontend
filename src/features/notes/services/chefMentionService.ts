import type { EtudiantNoteValidation, CoeffMentionSubmitValues } from "../types/notes";
import { handleApiError } from "../utils/handleApiError";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// --- Utilitaire interne pour la redirection ---
const login = process.env.NEXT_PUBLIC_LOGIN_URL || '/login';

const checkAuth = async (res: Response, router: AppRouterInstance) => {
  if (res.status === 401 || res.status === 403) {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(login);
    return true;
  }
  return false;
};

// ── Notes étudiants pour une matière-coefficient ────────────────────────────

export async function getEtudiantNotesValidation(
  idMatiere: number,
  annee: number,
  router: AppRouterInstance
): Promise<EtudiantNoteValidation[]> {
  try {
    const res = await fetch(`/api/notes/matieres-coeff/etudiant/${idMatiere}?annee=${annee}`);
    
    if (!res.ok) { 
      if (await checkAuth(res, router)) return [];
      await handleApiError("getEtudiantNotesValidation", res); 
      return []; 
    }
    
    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    await handleApiError("getEtudiantNotesValidation", undefined, err);
    return [];
  }
}

// ── Ajouter un coefficient ──────────────────────────────────────────────────

export async function addMatiereCoeffMention(
  idMatiere: number,
  credit: number,
  coefficient: number,
  idNiveau: number,
  idMention: number,
  router: AppRouterInstance, // Ajout du router ici
  idProfesseur: number
): Promise<void> {
  try {
    const res = await fetch("/api/notes/matieres-coeff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idMatiere, idMention, idNiveau, idProfesseur, coefficient, credit }),
    });

    if (!res.ok) {
      if (await checkAuth(res, router)) return;
      await handleApiError("addMatiereCoeffMention", res);
      throw new Error("Erreur lors de l'ajout du coefficient");
    }
  } catch (err) {
    await handleApiError("addMatiereCoeffMention", undefined, err);
    throw err;
  }
}

// ── Mettre à jour un coefficient matière ───────────────────────────────────

export async function updateMatiereCoeff(
  id: number,
  values: CoeffMentionSubmitValues,
  router: AppRouterInstance
): Promise<void> {
  try {
    const res = await fetch(`/api/notes/matieres-coeff/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idMatiere: values.matiereId,
        idMention: values.mentionId,
        idNiveau: values.niveauId,
        idProfesseur: values.professeurId ?? 0,
        coefficient: values.coefficient,
        credit: values.credit,
      }),
    });
    if (!res.ok) {
      if (await checkAuth(res, router)) return;
      await handleApiError("updateMatiereCoeff", res);
    }
  } catch (err) {
    await handleApiError("updateMatiereCoeff", undefined, err);
    throw err;
  }
}

// ── Assigner un chef de mention ─────────────────────────────────────────────

export async function assignerChefMention(
  mentionId: number,
  chefId: number,
  router: AppRouterInstance
): Promise<void> {
  try {
    const res = await fetch(`/api/etudiants/mentions/${mentionId}/chef`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chefId }),
    });
    if (!res.ok) {
      if (await checkAuth(res, router)) return;
      await handleApiError("assignerChefMention", res);
      throw new Error("Erreur lors de l'assignation du chef de mention");
    }
  } catch (err) {
    await handleApiError("assignerChefMention", undefined, err);
    throw err;
  }
}

// ── Valider une note ────────────────────────────────────────────────────────

export async function validerNote(idNote: number, router: AppRouterInstance): Promise<void> {
  try {
    const res = await fetch(`/api/notes/valider/${idNote}`, { method: "PUT" });
    
    if (!res.ok) {
      if (await checkAuth(res, router)) return;
      await handleApiError("validerNote", res);
    }
  } catch (err) {
    await handleApiError("validerNote", undefined, err);
  }
}