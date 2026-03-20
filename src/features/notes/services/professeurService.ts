import type { MatiereCoeff, EtudiantNotesProfesseur } from "../types/notes";

// Type plat retourné par GET /notes/matieres-coeff/professeur
type FlatCoeff = {
  id: number;
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

export async function getProfesseurMatieres(): Promise<MatiereCoeff[]> {
  const res = await fetch("/api/notes/matieres-coeff/professeur");
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data ?? []).map((c: FlatCoeff): MatiereCoeff => ({
    id: c.id,
    nom: c.matiereNom,
    semestre: { id: c.semestreId, name: c.semestreNom },
    niveau: { id: c.niveauId, nom: c.niveauNom },
    mention: { id: c.mentionId, nom: c.mentionNom },
    coefficient: c.coefficient,
  }));
}

// ── Étudiants (notes) pour une matière-coefficient ─────────────────────────

type NoteRecord = {
  id: number;
  etudiantId: number;
  nom: string;
  prenom: string;
  valeur: string;
  typeNoteName: string;
};

export async function getEtudiantsForMatiere(
  idMatiere: number
): Promise<EtudiantNotesProfesseur[]> {
  const annee = new Date().getFullYear();
  const res = await fetch(`/api/notes/matieres-coeff/etudiant/${idMatiere}?annee=${annee}`);
  if (!res.ok) return [];
  const json = await res.json();
  const records: NoteRecord[] = json.data ?? [];

  // Grouper par étudiant pour avoir noteNormale + noteRattrapage sur une ligne
  const map = new Map<number, EtudiantNotesProfesseur>();
  for (const r of records) {
    if (!map.has(r.etudiantId)) {
      map.set(r.etudiantId, {
        id: r.etudiantId,
        nom: `${r.nom} ${r.prenom}`,
        noteNormale: null,
        noteRattrapage: null,
      });
    }
    const entry = map.get(r.etudiantId)!;
    if (r.typeNoteName === "Normal") {
      entry.noteNormale = parseFloat(r.valeur);
    } else {
      entry.noteRattrapage = parseFloat(r.valeur);
    }
  }
  return Array.from(map.values());
}

// ── Soumettre des notes (à implémenter côté backend) ───────────────────────

export async function soumettreNotesNormales(
  _idMatiere: number,
  _notes: { idEtudiant: number; note: number }[]
): Promise<void> {
  // TODO: endpoint backend non encore disponible
  console.log("[professeurService] soumettreNotesNormales", _idMatiere, _notes);
}

export async function soumettreNotesRattrapage(
  _idMatiere: number,
  _notes: { idEtudiant: number; note: number }[]
): Promise<void> {
  // TODO: endpoint backend non encore disponible
  console.log("[professeurService] soumettreNotesRattrapage", _idMatiere, _notes);
}
