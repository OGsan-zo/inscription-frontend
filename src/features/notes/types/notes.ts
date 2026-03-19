// ── Types du module Notes ──────────────────────────────────────────────────

export interface Matiere {
  id: number;
  nom: string;
}

export interface Semestre {
  id: number;
  nom: string; // "S1", "S2", ...
}

export interface MatiereSemestre {
  id: number;
  matiere: Matiere;
  semestre: Semestre;
}

export interface MentionNote {
  id: number;
  nom: string;
  abr?: string;
}

export interface MatiereCoefficientMention {
  id: number;
  matiereSemestre: MatiereSemestre;
  mention: MentionNote;
  coefficient: number;
}

// ── Résultats étudiant ─────────────────────────────────────────────────────

export interface EtudiantRecherche {
  id: number;
  nom: string;
  prenom: string;
  mention?: string;
  niveau?: string;
}

export interface NoteEC {
  id: number;
  nomEC: string;             // nom de l'Élément Constitutif
  coefficient: number;
  credit: number;
  noteSur20: number | null;  // note brute /20
  ecAvecCoef: number | null; // note * coef
  resultat?: "Validé" | "Non validé" | null;
}

export interface NoteUE {
  id: number;
  nomUE: string;             // nom de l'Unité d'Enseignement
  ues20?: number | null;     // moyenne UE /20
  ecs: NoteEC[];
}

export interface ResultatSession {
  session: "Normale" | "Rattrapage";
  semestre: Semestre;
  ues: NoteUE[];
}

export interface ResultatEtudiant {
  etudiant: EtudiantRecherche;
  resultats: ResultatSession[];
}

// ── Niveau (L1, L2, ..., M2) ───────────────────────────────────────────────

export interface Niveau {
  id: number;
  nom: string; // "L1", "L2", "L3", "M1", "M2"
}

// ── Matière avec coefficient (vue Chef-Mention & Professeur) ───────────────

export interface MatiereCoeff {
  id: number;
  nom: string;
  semestre: Semestre;
  niveau: Niveau;
  mention: MentionNote;
  coefficient: number;
}

// ── Validation notes étudiant (vue Chef-Mention) ───────────────────────────

export type TypeNote = "Normale" | "Rattrapage";
export type StatusValidation = "Valide" | "Non Valide";

export interface EtudiantNoteValidation {
  id: number;
  nom: string;        // "Jean Dupont"
  note: number;
  type: TypeNote;
  status: StatusValidation;
}

// ── Vue Professeur : étudiants d'une matière ──────────────────────────────

export interface EtudiantNotesProfesseur {
  id: number;
  nom: string;
  noteNormale: number | null;
  noteRattrapage: number | null;
}

// ── Admin Validation Detail (vue par niveau) ──────────────────────────────

export interface UC {
  id: number;
  nom: string;        // "UC1 : Probabilité"
  checked?: boolean;
}

export interface UEValidation {
  id: number;
  nom: string;        // "UE : Mathématique Appliquée"
  noteNormale?: string | null;
  noteRattrapage?: string | null;
  ucs: UC[];
}

export interface NiveauValidation {
  niveau: Niveau;
  ues: UEValidation[];
}

export interface EtudiantValidationDetail {
  id: number;
  nom: string;
  prenom: string;
  mention: MentionNote;
  niveaux: NiveauValidation[];
}
