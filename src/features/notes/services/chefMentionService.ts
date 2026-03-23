import type { EtudiantNoteValidation } from "../types/notes";
import { handleApiError } from "../utils/handleApiError";

// ── Notes étudiants pour une matière-coefficient ────────────────────────────

export async function getEtudiantNotesValidation(
  idMatiere: number,
  annee: number
): Promise<EtudiantNoteValidation[]> {
  try {
    const res = await fetch(`/api/notes/matieres-coeff/etudiant/${idMatiere}?annee=${annee}`);
    if (!res.ok) { await handleApiError("getEtudiantNotesValidation", res); return []; }
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
  idProfesseur?: number
): Promise<void> {
  try {
    const res = await fetch("/api/notes/matieres-coeff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idMatiere, idMention, idNiveau, idProfesseur, coefficient }),
    });
    if (!res.ok) await handleApiError("addMatiereCoeffMention", res);
  } catch (err) {
    await handleApiError("addMatiereCoeffMention", undefined, err);
  }
}

// ── Valider une note ────────────────────────────────────────────────────────

export async function validerNote(idNote: number): Promise<void> {
  try {
    const res = await fetch(`/api/notes/valider/${idNote}`, { method: "PUT" });
    if (!res.ok) await handleApiError("validerNote", res);
  } catch (err) {
    await handleApiError("validerNote", undefined, err);
  }
}
