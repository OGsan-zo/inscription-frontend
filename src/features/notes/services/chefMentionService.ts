import type { EtudiantNoteValidation } from "../types/notes";

// ── Notes étudiants pour une matière-coefficient ────────────────────────────

export async function getEtudiantNotesValidation(
  idMatiere: number,
  annee: number
): Promise<EtudiantNoteValidation[]> {
  try {
    const res = await fetch(`/api/notes/matieres-coeff/etudiant/${idMatiere}?annee=${annee}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.error("[getEtudiantNotesValidation]", err);
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
    await fetch("/api/notes/matieres-coeff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idMatiere, idMention, idNiveau, idProfesseur, coefficient }),
    });
  } catch (err) {
    console.error("[addMatiereCoeffMention]", err);
  }
}

// ── Valider une note ────────────────────────────────────────────────────────

export async function validerNote(idNote: number): Promise<void> {
  try {
    await fetch(`/api/notes/valider/${idNote}`, { method: "PUT" });
  } catch (err) {
    console.error("[validerNote]", err);
  }
}
