/**
 * Service Chef-Mention — stubs prêts pour branchement API
 * Remplacer les imports mockData par des appels fetch/axios vers /api/notes/...
 */

import {
  MATIERES_COEFF,
  MATIERES_SEMESTRES,
  MENTIONS,
  NIVEAUX,
  ETUDIANT_NOTES_VALIDATION,
} from "../data/mockData";
import {
  MatiereCoeff,
  MentionNote,
  Niveau,
  MatiereSemestre,
  EtudiantNoteValidation,
} from "../types/notes";

// ── Lire les données ───────────────────────────────────────────────────────

export async function getMatieresCoeff(): Promise<MatiereCoeff[]> {
  // TODO: return (await axios.get('/api/notes/matieres-coeff')).data
  return MATIERES_COEFF;
}

export async function getMentions(): Promise<MentionNote[]> {
  // TODO: return (await axios.get('/api/notes/mentions')).data
  return MENTIONS;
}

export async function getNiveaux(): Promise<Niveau[]> {
  // TODO: return (await axios.get('/api/notes/niveaux')).data
  return NIVEAUX;
}

export async function getMatiereSemestres(): Promise<MatiereSemestre[]> {
  // TODO: return (await axios.get('/api/notes/matiere-semestres')).data
  return MATIERES_SEMESTRES;
}

export async function getEtudiantNotesValidation(
  idMatiere: number
): Promise<EtudiantNoteValidation[]> {
  // TODO: return (await axios.get(`/api/notes/matieres/${idMatiere}/validations`)).data
  console.log("[chefMentionService] getEtudiantNotesValidation", idMatiere);
  return ETUDIANT_NOTES_VALIDATION;
}

// ── Mutations ──────────────────────────────────────────────────────────────

export async function addMatiereCoeffMention(
  _idMatiereSemestre: number,
  _coefficient: number,
  _idNiveau: number,
  _idMention: number
): Promise<void> {
  // TODO: await axios.post('/api/notes/matieres-coeff', { ... })
  console.log("[chefMentionService] addMatiereCoeffMention", {
    _idMatiereSemestre,
    _coefficient,
    _idNiveau,
    _idMention,
  });
}

export async function updateMatiereCoeff(
  _id: number,
  _data: Partial<MatiereCoeff>
): Promise<void> {
  // TODO: await axios.put(`/api/notes/matieres-coeff/${_id}`, _data)
  console.log("[chefMentionService] updateMatiereCoeff", _id, _data);
}

export async function validerNote(
  _idEtudiantNote: number
): Promise<void> {
  // TODO: await axios.post(`/api/notes/validations/${_idEtudiantNote}/valider`)
  console.log("[chefMentionService] validerNote", _idEtudiantNote);
}
