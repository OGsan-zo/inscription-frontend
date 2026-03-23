import type { MatiereCoeffItem, EtudiantNotesProfesseur } from "../types/notes";

// Type plat retourné par GET /notes/matieres-coeff/professeur
type FlatCoeff = {
  id: number;
  ue: string;
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
};

// ── Matières du professeur connecté ────────────────────────────────────────

export async function getProfesseurMatieres(): Promise<MatiereCoeffItem[]> {
  try {
    const res = await fetch("/api/notes/matieres-coeff/professeur");
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []).map((c: FlatCoeff): MatiereCoeffItem => ({
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
    console.error("[getProfesseurMatieres]", err);
    return [];
  }
}

// ── Étudiants (notes) pour un professeur et une année ──────────────────────

export async function getEtudiantsForMatiere(
  matiereCoeffId: number,
  annee: number
): Promise<EtudiantNotesProfesseur[]> {
  try {
    const res = await fetch(`/api/notes/matieres-coeff/professeur/${matiereCoeffId}?annee=${annee}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.error("[getEtudiantsForMatiere]", err);
    return [];
  }
}

// ── Soumettre des notes ─────────────────────────────────────────────────────

export async function soumettreNotes(
  idMatiereCoefficient: number,
  annee: number,
  isNormale: boolean,
  listeEtudiants: { etudiantId: number; valeur: number }[]
): Promise<void> {
  try {
    const res = await fetch("/api/notes/matieres-coeff/professeur", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idMatiereCoefficient, annee, isNormale, listeEtudiants }),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error || "Erreur lors de la soumission des notes");
    }
  } catch (err) {
    console.error("[soumettreNotes]", err);
    throw err;
  }
}
