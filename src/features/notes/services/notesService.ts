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

export async function getMockResultatEtudiant(_idEtudiant: number, _idSemestre: number): Promise<ResultatEtudiant | null> {
  return [
    {
      type: "Normale",
      moyenne: 10.1,
      notesListes: [
        {
          // Moyenne = (14×3 + 7×1 + 4×1) / 5 = 53/5 = 10.6 → isValid: true
          // Analyse: Validé (>=10), Algèbre: Compensé (5-10 + UE>=10), Chimie: Non validé (<5)
          ue: "UE1 — Mathématiques",
          isValid: true,
          sommeCoefficients: 5,
          sommeNotesAvecCoefficient: 53,
          moyenne: 10.6,
          notes: [
            { matiere: "Analyse",  coefficient: 3, note: 14,  noteAvecCoefficient: 42 },
            { matiere: "Algèbre",  coefficient: 1, note: 7,   noteAvecCoefficient: 7  },
            { matiere: "Chimie",   coefficient: 1, note: 4,   noteAvecCoefficient: 4  },
          ],
        },
        {
          // Moyenne = (8×3 + 10.5×2 + 11.5×1) / 6 = 57.5/6 = 9.58 → isValid: false
          // Algorithmique: Non validé (<10, UE non valide), Programmation: Non validé, BDD: Non validé
          ue: "UE2 — Informatique",
          isValid: false,
          sommeCoefficients: 6,
          sommeNotesAvecCoefficient: 57.5,
          moyenne: 9.58,
          notes: [
            { matiere: "Algorithmique",   coefficient: 3, note: 8,    noteAvecCoefficient: 24   },
            { matiere: "Programmation",   coefficient: 2, note: 10.5, noteAvecCoefficient: 21   },
            { matiere: "Base de données", coefficient: 1, note: 11.5, noteAvecCoefficient: 11.5 },
          ],
        },
      ],
    },
  ];
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
