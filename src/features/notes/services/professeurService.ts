/**
 * Service Professeur — stubs prêts pour branchement API
 * Remplacer les imports mockData par des appels fetch/axios vers /api/notes/...
 */

import {
  MATIERES_COEFF,
  ETUDIANT_NOTES_PROF,
  ETUDIANT_VALIDATION_DETAIL,
} from "../data/mockData";
import {
  MatiereCoeff,
  EtudiantNotesProfesseur,
  EtudiantValidationDetail,
} from "../types/notes";

// ── Lire les données ───────────────────────────────────────────────────────

export async function getProfesseurMatieres(): Promise<MatiereCoeff[]> {
  // TODO: return (await axios.get('/api/notes/professeur/matieres')).data
  return MATIERES_COEFF;
}

export async function getEtudiantsForMatiere(
  idMatiere: number
): Promise<EtudiantNotesProfesseur[]> {
  // TODO: return (await axios.get(`/api/notes/matieres/${idMatiere}/etudiants`)).data
  console.log("[professeurService] getEtudiantsForMatiere", idMatiere);
  return ETUDIANT_NOTES_PROF;
}

export async function getEtudiantValidationDetail(
  idEtudiant: number
): Promise<EtudiantValidationDetail> {
  // TODO: return (await axios.get(`/api/notes/admin/validation/${idEtudiant}`)).data
  console.log("[professeurService] getEtudiantValidationDetail", idEtudiant);
  return ETUDIANT_VALIDATION_DETAIL;
}

// ── Mutations ──────────────────────────────────────────────────────────────

export async function soumettreNotesNormales(
  _idMatiere: number,
  _notes: { idEtudiant: number; note: number }[]
): Promise<void> {
  // TODO: await axios.post(`/api/notes/matieres/${_idMatiere}/notes-normales`, _notes)
  console.log("[professeurService] soumettreNotesNormales", _idMatiere, _notes);
}

export async function soumettreNotesRattrapage(
  _idMatiere: number,
  _notes: { idEtudiant: number; note: number }[]
): Promise<void> {
  // TODO: await axios.post(`/api/notes/matieres/${_idMatiere}/notes-rattrapage`, _notes)
  console.log("[professeurService] soumettreNotesRattrapage", _idMatiere, _notes);
}
