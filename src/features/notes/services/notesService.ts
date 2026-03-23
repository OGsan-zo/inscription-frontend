// ── Notes Service ─────────────────────────────────────────────────────────
// Appels réels vers les routes proxy /api/notes/*

import type {
  UE,
  MatiereUE,
  Semestre,
  MatiereCoeffItem,
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

export async function getMockSemestres(): Promise<Semestre[]> {
  return [
    { id: 1, name: "Semestre 1" },
    { id: 2, name: "Semestre 2" },
    { id: 3, name: "Semestre 3" },
    { id: 4, name: "Semestre 4" },
    { id: 5, name: "Semestre 5" },
    { id: 6, name: "Semestre 6" },
  ];
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
    ue:string;
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
  }): MatiereCoeffItem => ({
    id: c.id,
    ue: c.ue,
    matiere: { id: c.matiereId, nom: c.matiereNom },
    semestre: { id: c.semestreId, name: c.semestreNom },
    mention: { id: c.mentionId, nom: c.mentionNom },
    coefficient: c.coefficient,
    niveau: { id: c.niveauId, nom: c.niveauNom },
    professeur: { id: c.professeurId, nom: c.professeurNom, prenom: c.professeurPrenom },
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
  const res = await fetch("/api/etudiants/recherche", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, prenom }),
  });
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

export async function getMockResultatEtudiant(idEtudiant: number, idSemestre: number): Promise<ResultatEtudiant | null> {
  const semestreNom = ["Semestre 1","Semestre 2","Semestre 3","Semestre 4","Semestre 5","Semestre 6"][idSemestre - 1] ?? `Semestre ${idSemestre}`;
  return {
    etudiant: { id: idEtudiant, nom: "—", prenom: "" },
    resultats: [
      {
        session: "Normale",
        semestre: { id: idSemestre, name: semestreNom },
        ues: [
          {
            id: 1,
            nomUE: "UE1 — Mathématiques",
            ues20: 13.5,
            ecs: [
              { id: 1, nomEC: "Analyse", coefficient: 2, credit: 3, noteSur20: 14, ecAvecCoef: 28, resultat: "Validé" },
              { id: 2, nomEC: "Algèbre", coefficient: 2, credit: 3, noteSur20: 13, ecAvecCoef: 26, resultat: "Validé" },
            ],
          },
          {
            id: 2,
            nomUE: "UE2 — Informatique",
            ues20: 9,
            ecs: [
              { id: 3, nomEC: "Algorithmique", coefficient: 3, credit: 4, noteSur20: 8, ecAvecCoef: 24, resultat: "Non validé" },
              { id: 4, nomEC: "Programmation", coefficient: 2, credit: 3, noteSur20: 10.5, ecAvecCoef: 21, resultat: "Validé" },
              { id: 5, nomEC: "Base de données", coefficient: 1, credit: 2, noteSur20: null, ecAvecCoef: null, resultat: null },
            ],
          },
          {
            id: 3,
            nomUE: "UE3 — Sciences",
            ues20: null,
            ecs: [
              { id: 6, nomEC: "Physique", coefficient: 2, credit: 3, noteSur20: null, ecAvecCoef: null, resultat: null },
              { id: 7, nomEC: "Chimie", coefficient: 1, credit: 2, noteSur20: null, ecAvecCoef: null, resultat: null },
            ],
          },
        ],
      },
    ],
  };
}

// ── Professeurs ───────────────────────────────────────────────────────────

// export async function getProfesseurs(): Promise<Professeur[]> {
//   const res = await fetch("/api/users");
//   if (!res.ok) return [];
//   const json = await res.json();
//   return (json.data ?? [])
//     .filter((u: { role: string }) => u.role === "Professeur")
//     .map((u: { id: number; nom: string; prenom: string }): Professeur => ({
//       id: u.id,
//       nom: u.nom,
//       prenom: u.prenom,
//       email: "",
//     }));
// }
