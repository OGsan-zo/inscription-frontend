// ── Types du module Notes ──────────────────────────────────────────────────

export interface Matiere {
  id: number;
  nom: string;
}

export interface UE {
  id: number;
  nom: string;
}

export interface MatiereUE {
  id: number;
  nom: string;
  ue: UE;
  semestre: Semestre;
}

export interface Professeur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

export interface Semestre {
  id: number;
  nom: string;
}

export interface MentionNote {
  id: number;
  nom: string;
  abr?: string;
}

export interface Niveau {
  id: number | string;
  nom: string;
}

export interface MatiereCoeffItem {
  id: number;
  matiere: Matiere;
  semestre: Semestre;
  mention: MentionNote;
  coefficient: number;
  niveau: Niveau;
  professeur: Professeur;
}

export interface MatiereSemestre {
  id: number;
  matiere: Matiere;
  semestre: Semestre;
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
  nomEC: string;
  coefficient: number;
  credit: number;
  noteSur20: number | null;
  ecAvecCoef: number | null;
  resultat?: "Validé" | "Non validé" | null;
}

export interface NoteUE {
  id: number;
  nomUE: string;
  ues20?: number | null;
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
  nom: string;
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
  nom: string;
  checked?: boolean;
}

export interface UEValidation {
  id: number;
  nom: string;
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

