// ── Notes Service ─────────────────────────────────────────────────────────
// Toutes les fonctions sont des stubs avec données statiques.
// Remplacer les imports mockData par des appels fetch/axios vers le backend.

import {
  MATIERES,
  SEMESTRES,
  MENTIONS,
  MATIERES_SEMESTRES,
  MATIERES_COEFF_MENTIONS,
  ETUDIANTS,
  RESULTATS,
} from "../data/mockData";

import type {
  Matiere,
  Semestre,
  MentionNote,
  MatiereSemestre,
  MatiereCoefficientMention,
  EtudiantRecherche,
  ResultatEtudiant,
} from "../types/notes";

// ── Matières ──────────────────────────────────────────────────────────────

export async function getMatieres(): Promise<Matiere[]> {
  // TODO: return fetch('/api/notes/matieres').then(r => r.json())
  return MATIERES;
}

export async function getSemestres(): Promise<Semestre[]> {
  // TODO: return fetch('/api/notes/semestres').then(r => r.json())
  return SEMESTRES;
}

export async function getMentions(): Promise<MentionNote[]> {
  // TODO: return fetch('/api/notes/mentions').then(r => r.json())
  return MENTIONS;
}

export async function getMatiereSemestres(): Promise<MatiereSemestre[]> {
  // TODO: return fetch('/api/notes/matiere-semestres').then(r => r.json())
  return MATIERES_SEMESTRES;
}

export async function addMatiereSemestre(
  _idMatiere: number,
  _idSemestre: number
): Promise<void> {
  // TODO: fetch('/api/notes/matiere-semestres', { method: 'POST', body: JSON.stringify({ idMatiere, idSemestre }) })
  console.log("addMatiereSemestre (stub)", { _idMatiere, _idSemestre });
}

// ── Coefficients ──────────────────────────────────────────────────────────

export async function getMatieresCoeffMentions(): Promise<MatiereCoefficientMention[]> {
  // TODO: return fetch('/api/notes/matieres-coeff').then(r => r.json())
  return MATIERES_COEFF_MENTIONS;
}

export async function addMatiereCoefficientMention(
  _idMatiereSemestre: number,
  _idMention: number,
  _coefficient: number
): Promise<void> {
  // TODO: fetch('/api/notes/matieres-coeff', { method: 'POST', ... })
  console.log("addMatiereCoefficientMention (stub)", { _idMatiereSemestre, _idMention, _coefficient });
}

// ── Étudiants / Résultats ─────────────────────────────────────────────────

export async function rechercherEtudiants(
  nom: string,
  prenom: string
): Promise<EtudiantRecherche[]> {
  // TODO: fetch(`/api/notes/etudiants?nom=${nom}&prenom=${prenom}`)
  return ETUDIANTS.filter(
    (e) =>
      e.nom.toLowerCase().includes(nom.toLowerCase()) &&
      (prenom === "" || e.prenom.toLowerCase().includes(prenom.toLowerCase()))
  );
}

export async function getResultatEtudiant(
  idEtudiant: number,
  idSemestre: number
): Promise<ResultatEtudiant | null> {
  // TODO: fetch(`/api/notes/resultats/${idEtudiant}?idSemestre=${idSemestre}`)
  const resultat = RESULTATS.find((r) => r.etudiant.id === idEtudiant);
  if (!resultat) return null;
  return {
    ...resultat,
    resultats: resultat.resultats.filter((r) => r.semestre.id === idSemestre),
  };
}
