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
