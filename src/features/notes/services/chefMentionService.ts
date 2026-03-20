import type { EtudiantNoteValidation } from "../types/notes";

// ── Notes étudiants pour une matière-coefficient ────────────────────────────

export async function getEtudiantNotesValidation(
  idMatiere: number,
  annee: number
): Promise<EtudiantNoteValidation[]> {
  const res = await fetch(`/api/notes/matieres-coeff/etudiant/${idMatiere}?annee=${annee}`);
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data ?? []).map((c: {
    id: number;
    nom: string;
    prenom: string;
    valeur: string;
    typeNoteName: string;
    dateValidation: string | null;
  }): EtudiantNoteValidation => ({
    id: c.id,
    nom: `${c.nom} ${c.prenom}`,
    note: parseFloat(c.valeur),
    type: c.typeNoteName === "Normal" ? "Normale" : "Rattrapage",
    status: c.dateValidation ? "Valide" : "Non Valide",
  }));
}

// ── Ajouter un coefficient ──────────────────────────────────────────────────

export async function addMatiereCoeffMention(
  idMatiere: number,
  coefficient: number,
  idNiveau: number,
  idMention: number,
  idProfesseur?: number
): Promise<void> {
  await fetch("/api/notes/matieres-coeff", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idMatiere, idMention, idNiveau, idProfesseur, coefficient }),
  });
}

// ── Valider une note ────────────────────────────────────────────────────────

export async function validerNote(idNote: number): Promise<void> {
  await fetch(`/api/notes/valider/${idNote}`, { method: "PUT" });
}
