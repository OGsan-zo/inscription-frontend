// ── Types du module Notes ──────────────────────────────────────────────────

import { Niveau } from "@/lib/db";

export interface Matiere {
  id: number;
  nom: string;
}

export interface UE {
  id: number;
  name: string;
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
}

export interface Semestre {
  id: number;
  name: string;
}

export interface MentionNote {
  id: number;
  nom: string;
  abr?: string;
  chefMentionId?: number;
}


export interface MatiereCoeffItem {
  id: number;
  ue: string;
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

// GET /notes/resultats/{id}?idSemestre=
export interface NoteEC {
  matiere: string;
  coefficient: number;
  note: number;
  noteAvecCoefficient: number;
}

export interface NoteUE {
  ue: string;
  notes: NoteEC[];
  isValid: boolean;
  sommeCoefficients: number;
  sommeNotesAvecCoefficient: number;
  moyenne: number;
}

export interface ResultatSession {
  type: "Normale" | "Rattrapage" | "Final";
  notesListes: NoteUE[];
  moyenne: number;
}

export type ResultatEtudiant = ResultatSession[];

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

// GET /notes/matieres-coeff/etudiant/{id}?annee=
export interface EtudiantNoteValidation {
  id: number;
  valeur: string;
  typeNoteId: number;
  typeNoteName: string;
  matiereMentionCoefficientId: number;
  etudiantId: number;
  nom: string;
  prenom: string;
  annee: number;
  dateValidation: string | null;
  createdAt: string;
}

// GET /notes/matieres-coeff/professeur/{id}?annee=
export interface NoteEtudiant {
  etudiantId: number;
  matiereMentionCoefficientId: number;
  typeNoteId: number;
  valeur: number;
  annee: number;
  dateValidation: string | null;
}

export interface EtudiantNotesProfesseur {
  details: {
    etudiantId: number;
    nom: string;
    prenom: string;
    niveauId: number;
    mentionId: number;
    annee: number;
  };
  notes: NoteEtudiant[];
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

export interface CoeffMentionSubmitValues {
  matiereId: number;
  mentionId: number;
  niveauId: number;
  professeurId?: number; // Optionnel : peut être undefined si aucun prof n'est assigné
  coefficient: number;
}