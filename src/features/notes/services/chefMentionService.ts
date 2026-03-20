import type {
  MatiereCoeff,
  MatiereSemestre,
  MatiereUE,
  EtudiantNoteValidation,
} from "../types/notes";

// Type plat retourné par GET /notes/matieres-coeff
type FlatCoeff = {
  id: number;
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

function mapFlatToMatiereCoeff(c: FlatCoeff): MatiereCoeff {
  return {
    id: c.id,
    nom: c.matiereNom,
    semestre: { id: c.semestreId, name: c.semestreNom },
    niveau: { id: c.niveauId, nom: c.niveauNom },
    mention: { id: c.mentionId, nom: c.mentionNom },
    coefficient: c.coefficient,
  };
}

// ── Liste des matières-coefficient ─────────────────────────────────────────

export async function getMatieresCoeff(): Promise<MatiereCoeff[]> {
  const res = await fetch("/api/notes/matieres-coeff");
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data ?? []).map(mapFlatToMatiereCoeff);
}

// ── Liste des matières (pour le sélecteur du formulaire) ───────────────────

export async function getMatiereSemestres(): Promise<MatiereSemestre[]> {
  const res = await fetch("/api/notes/matieres");
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data ?? []).map((m: MatiereUE): MatiereSemestre => ({
    id: m.id,
    matiere: { id: m.id, nom: m.nom },
    semestre: m.semestre,
  }));
}

// ── Notes étudiants pour une matière-coefficient ────────────────────────────

export async function getEtudiantNotesValidation(
  idMatiere: number
): Promise<EtudiantNoteValidation[]> {
  const annee = new Date().getFullYear();
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
