import type { EtudiantNoteValidation } from "../types/notes";
import { handleApiError } from "../utils/handleApiError";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// --- Utilitaire interne pour la redirection ---
const login = process.env.NEXT_PUBLIC_LOGIN_URL || '/login';

const checkAuth = (res: Response, router: AppRouterInstance) => {
  if (res.status === 401 || res.status === 403) {
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
      if (checkAuth(res, router)) return [];
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
  coefficient: number,
  idNiveau: number,
  idMention: number,
  router: AppRouterInstance, // Ajout du router ici
  idProfesseur?: number
): Promise<void> {
  try {
    const res = await fetch("/api/notes/matieres-coeff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idMatiere, idMention, idNiveau, idProfesseur, coefficient }),
    });

    if (!res.ok) {
      if (checkAuth(res, router)) return;
      await handleApiError("addMatiereCoeffMention", res);
    }
  } catch (err) {
    await handleApiError("addMatiereCoeffMention", undefined, err);
  }
}

// ── Valider une note ────────────────────────────────────────────────────────

export async function validerNote(idNote: number, router: AppRouterInstance): Promise<void> {
  try {
    const res = await fetch(`/api/notes/valider/${idNote}`, { method: "PUT" });
    
    if (!res.ok) {
      if (checkAuth(res, router)) return;
      await handleApiError("validerNote", res);
    }
  } catch (err) {
    await handleApiError("validerNote", undefined, err);
  }
}