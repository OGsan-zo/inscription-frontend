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
  try {
    const res = await fetch("/api/notes/ue");
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.error("[getUEs]", err);
    return [];
  }
}

export async function createUE(name: string): Promise<void> {
  try {
    await fetch("/api/notes/ue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
  } catch (err) {
    console.error("[createUE]", err);
  }
}

// ── Semestres ─────────────────────────────────────────────────────────────

export async function getSemestres(): Promise<Semestre[]> {
  try {
    const res = await fetch("/api/notes/semestres");
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.error("[getSemestres]", err);
    return [];
  }
}

// ── Matières ──────────────────────────────────────────────────────────────

export async function getMatieres(): Promise<MatiereUE[]> {
  try {
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
  } catch (err) {
    console.error("[getMatieres]", err);
    return [];
  }
}

export async function createMatiere(
  name: string,
  ueId: number,
  semestreId: number
): Promise<void> {
  try {
    await fetch("/api/notes/matieres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, ueId, semestreId }),
    });
  } catch (err) {
    console.error("[createMatiere]", err);
  }
}

// ── Coefficients ──────────────────────────────────────────────────────────

export async function getMatieresCoeff(): Promise<MatiereCoeffItem[]> {
  try {
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
  } catch (err) {
    console.error("[getMatieresCoeff]", err);
    return [];
  }
}

export async function createMatiereCoeff(
  idMatiere: number,
  idMention: number,
  idNiveau: number,
  idProfesseur: number,
  coefficient: number
): Promise<void> {
  try {
    await fetch("/api/notes/matieres-coeff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idMatiere, idMention, idNiveau, idProfesseur, coefficient }),
    });
  } catch (err) {
    console.error("[createMatiereCoeff]", err);
  }
}

// ── Résultats étudiant ────────────────────────────────────────────────────

export async function rechercherEtudiants(nom: string, prenom: string): Promise<EtudiantRecherche[]> {
  try {
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
  } catch (err) {
    console.error("[rechercherEtudiants]", err);
    return [];
  }
}

export async function getResultatEtudiant(idEtudiant: number, idSemestre: number): Promise<ResultatEtudiant | null> {
  try {
    const res = await fetch(`/api/notes/resultats/${idEtudiant}?idSemestre=${idSemestre}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch (err) {
    console.error("[getResultatEtudiant]", err);
    return null;
  }
}
