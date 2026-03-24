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
import { handleApiError } from "../utils/handleApiError";

// ── UE ────────────────────────────────────────────────────────────────────

export async function getUEs(): Promise<UE[]> {
  try {
    const res = await fetch("/api/notes/ue");
    if (!res.ok) { await handleApiError("getUEs", res); return []; }
    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    await handleApiError("getUEs", undefined, err);
    return [];
  }
}

export async function createUE(name: string): Promise<void> {
  try {
    const res = await fetch("/api/notes/ue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) await handleApiError("createUE", res);
  } catch (err) {
    await handleApiError("createUE", undefined, err);
  }
}

// ── Semestres ─────────────────────────────────────────────────────────────

export async function getSemestres(): Promise<Semestre[]> {
  try {
    const res = await fetch("/api/notes/semestres");
    if (!res.ok) { await handleApiError("getSemestres", res); return []; }
    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    await handleApiError("getSemestres", undefined, err);
    return [];
  }
}

// ── Matières ──────────────────────────────────────────────────────────────

export async function getMatieres(): Promise<MatiereUE[]> {
  try {
    const res = await fetch("/api/notes/matieres");
    if (!res.ok) { await handleApiError("getMatieres", res); return []; }
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
    await handleApiError("getMatieres", undefined, err);
    return [];
  }
}

export async function createMatiere(
  name: string,
  ueId: number,
  semestreId: number
): Promise<void> {
  try {
    const res = await fetch("/api/notes/matieres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, ueId, semestreId }),
    });
    if (!res.ok) await handleApiError("createMatiere", res);
  } catch (err) {
    await handleApiError("createMatiere", undefined, err);
  }
}

// ── Coefficients ──────────────────────────────────────────────────────────

export async function getMatieresCoeff(): Promise<MatiereCoeffItem[]> {
  try {
    const res = await fetch("/api/notes/matieres-coeff");
    if (!res.ok) { await handleApiError("getMatieresCoeff", res); return []; }
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
    await handleApiError("getMatieresCoeff", undefined, err);
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
    const res = await fetch("/api/notes/matieres-coeff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idMatiere, idMention, idNiveau, idProfesseur, coefficient }),
    });
    if (!res.ok) await handleApiError("createMatiereCoeff", res);
  } catch (err) {
    await handleApiError("createMatiereCoeff", undefined, err);
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
    if (!res.ok) { await handleApiError("rechercherEtudiants", res); return []; }
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
    await handleApiError("rechercherEtudiants", undefined, err);
    return [];
  }
}

export async function getResultatEtudiant(idEtudiant: number, idSemestre: number): Promise<ResultatEtudiant | null> {
  try {
    const res = await fetch(`/api/notes/resultats/${idEtudiant}?idSemestre=${idSemestre}`);
    if (!res.ok) { await handleApiError("getResultatEtudiant", res); return null; }
    const json = await res.json();
    return json.data ?? null;
  } catch (err) {
    await handleApiError("getResultatEtudiant", undefined, err);
    return null;
  }
}
