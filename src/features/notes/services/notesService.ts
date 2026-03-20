// ── Notes Service ─────────────────────────────────────────────────────────
// Appels réels vers les routes proxy /api/notes/*

import type {
  UE,
  MatiereUE,
  Semestre,
  MatiereCoeffItem,
  Professeur,
  EtudiantRecherche,
  ResultatEtudiant,
} from "../types/notes";

// ── UE ────────────────────────────────────────────────────────────────────

export async function getUEs(): Promise<UE[]> {
  const res = await fetch("/api/notes/ue");
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export async function createUE(name: string): Promise<void> {
  await fetch("/api/notes/ue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
}

// ── Semestres ─────────────────────────────────────────────────────────────

export async function getSemestres(): Promise<Semestre[]> {
  const res = await fetch("/api/notes/semestres");
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

// ── Matières ──────────────────────────────────────────────────────────────

export async function getMatieres(): Promise<MatiereUE[]> {
  const res = await fetch("/api/notes/matieres");
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data ?? []).map((m: {
    id: number;
    name: string;
    ue: { id: number; name: string };
    semestre: { id: number; name: string };
  }): MatiereUE => ({
    id: m.id,
    nom: m.name,
    ue: { id: m.ue.id, name: m.ue.name },
    semestre: { id: m.semestre.id, name: m.semestre.name },
  }));
}

export async function createMatiere(
  name: string,
  ueId: number,
  semestreId: number
): Promise<void> {
  await fetch("/api/notes/matieres", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, ueId, semestreId }),
  });
}

// ── Coefficients ──────────────────────────────────────────────────────────

export async function getMatieresCoeff(): Promise<MatiereCoeffItem[]> {
  const res = await fetch("/api/notes/matieres-coeff");
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data ?? []).map((c: {
    id: number;
    matiere: { id: number; name: string };
    semestre: { id: number; name: string };
    mention: MatiereCoeffItem["mention"];
    coefficient: number;
    niveau: MatiereCoeffItem["niveau"];
    professeur: Professeur;
  }): MatiereCoeffItem => ({
    id: c.id,
    matiere: { id: c.matiere.id, nom: c.matiere.name },
    semestre: { id: c.semestre.id, name: c.semestre.name },
    mention: c.mention,
    coefficient: c.coefficient,
    niveau: c.niveau,
    professeur: c.professeur,
  }));
}

export async function createMatiereCoeff(
  idMatiere: number,
  idMention: number,
  idNiveau: number,
  idProfesseur: number,
  coefficient: number
): Promise<void> {
  await fetch("/api/notes/matieres-coeff", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idMatiere, idMention, idNiveau, idProfesseur, coefficient }),
  });
}

// ── Résultats étudiant ────────────────────────────────────────────────────

export async function rechercherEtudiants(nom: string, prenom: string): Promise<EtudiantRecherche[]> {
  const params = new URLSearchParams({ nom, prenom });
  const res = await fetch(`/api/notes/etudiants?${params}`);
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data ?? []).map((e: {
    id: number;
    nom: string;
    prenom: string;
    mention?: string;
    niveau?: string;
  }): EtudiantRecherche => ({
    id: e.id,
    nom: e.nom,
    prenom: e.prenom,
    mention: e.mention,
    niveau: e.niveau,
  }));
}

export async function getResultatEtudiant(idEtudiant: number, idSemestre: number): Promise<ResultatEtudiant | null> {
  const res = await fetch(`/api/notes/resultats?idEtudiant=${idEtudiant}&idSemestre=${idSemestre}`);
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}

// ── Professeurs ───────────────────────────────────────────────────────────

export async function getProfesseurs(): Promise<Professeur[]> {
  const res = await fetch("/api/users");
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data ?? [])
    .filter((u: { role: string }) => u.role === "Professeur")
    .map((u: { id: number; nom: string; prenom: string }): Professeur => ({
      id: u.id,
      nom: u.nom,
      prenom: u.prenom,
      email: "",
    }));
}
