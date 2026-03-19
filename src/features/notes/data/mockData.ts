import {
  Matiere,
  Semestre,
  MatiereSemestre,
  MentionNote,
  MatiereCoefficientMention,
  EtudiantRecherche,
  ResultatEtudiant,
  Niveau,
  MatiereCoeff,
  EtudiantNoteValidation,
  EtudiantNotesProfesseur,
  EtudiantValidationDetail,
} from "../types";

export const SEMESTRES: Semestre[] = [
  { id: 1, nom: "S1" },
  { id: 2, nom: "S2" },
  { id: 3, nom: "S3" },
  { id: 4, nom: "S4" },
  { id: 5, nom: "S5" },
  { id: 6, nom: "S6" },
];

export const MATIERES: Matiere[] = [
  { id: 1, nom: "Algèbre" },
  { id: 2, nom: "Analyse" },
  { id: 3, nom: "Physique" },
  { id: 4, nom: "Chimie" },
  { id: 5, nom: "Informatique" },
  { id: 6, nom: "Mécanique" },
];

export const MENTIONS: MentionNote[] = [
  { id: 1, nom: "Informatique et Génie Automatique Télécommunications", abr: "IGAT" },
  { id: 2, nom: "Génie Mécanique et Industriel", abr: "GMI" },
  { id: 3, nom: "Bâtiment et Travaux Publics", abr: "BTP" },
];

export const MATIERES_SEMESTRES: MatiereSemestre[] = [
  { id: 1, matiere: MATIERES[0], semestre: SEMESTRES[0] }, // Algèbre - S1
  { id: 2, matiere: MATIERES[1], semestre: SEMESTRES[0] }, // Analyse - S1
  { id: 3, matiere: MATIERES[2], semestre: SEMESTRES[0] }, // Physique - S1
  { id: 4, matiere: MATIERES[4], semestre: SEMESTRES[1] }, // Informatique - S2
  { id: 5, matiere: MATIERES[5], semestre: SEMESTRES[1] }, // Mécanique - S2
];

export const MATIERES_COEFF_MENTIONS: MatiereCoefficientMention[] = [
  { id: 1, matiereSemestre: MATIERES_SEMESTRES[0], mention: MENTIONS[0], coefficient: 2 },
  { id: 2, matiereSemestre: MATIERES_SEMESTRES[1], mention: MENTIONS[0], coefficient: 4 },
  { id: 3, matiereSemestre: MATIERES_SEMESTRES[2], mention: MENTIONS[0], coefficient: 3 },
  { id: 4, matiereSemestre: MATIERES_SEMESTRES[0], mention: MENTIONS[1], coefficient: 3 },
  { id: 5, matiereSemestre: MATIERES_SEMESTRES[3], mention: MENTIONS[0], coefficient: 2 },
];

export const ETUDIANTS: EtudiantRecherche[] = [
  { id: 1, nom: "RANDRIA", prenom: "Dode", mention: "IGAT", niveau: "L1" },
  { id: 2, nom: "RAKOTO", prenom: "Jean", mention: "GMI", niveau: "L2" },
  { id: 3, nom: "RABE", prenom: "Fara", mention: "BTP", niveau: "L1" },
  { id: 4, nom: "ANDRIANINA", prenom: "Lova", mention: "IGAT", niveau: "L3" },
];

// ── Niveaux ────────────────────────────────────────────────────────────────

export const NIVEAUX: Niveau[] = [
  { id: 1, nom: "L1" },
  { id: 2, nom: "L2" },
  { id: 3, nom: "L3" },
  { id: 4, nom: "M1" },
  { id: 5, nom: "M2" },
];

// ── Matières avec coefficient (Chef-Mention & Professeur) ──────────────────

export const MATIERES_COEFF: MatiereCoeff[] = [
  { id: 1, nom: "Algèbre",      semestre: SEMESTRES[0], niveau: NIVEAUX[0], mention: MENTIONS[0], coefficient: 3 },
  { id: 2, nom: "Analyse",      semestre: SEMESTRES[0], niveau: NIVEAUX[0], mention: MENTIONS[0], coefficient: 4 },
  { id: 3, nom: "Physique",     semestre: SEMESTRES[0], niveau: NIVEAUX[0], mention: MENTIONS[1], coefficient: 2 },
  { id: 4, nom: "Informatique", semestre: SEMESTRES[1], niveau: NIVEAUX[1], mention: MENTIONS[0], coefficient: 3 },
  { id: 5, nom: "Mécanique",    semestre: SEMESTRES[1], niveau: NIVEAUX[1], mention: MENTIONS[1], coefficient: 4 },
];

// ── Notes étudiants pour validation (Chef-Mention) ────────────────────────

export const ETUDIANT_NOTES_VALIDATION: EtudiantNoteValidation[] = [
  { id: 1, nom: "Jean Dupont",  note: 10, type: "Normale",    status: "Non Valide" },
  { id: 2, nom: "Rasoa Testa",  note: 11, type: "Rattrapage", status: "Valide"     },
  { id: 3, nom: "Marc Aina",    note: 8,  type: "Normale",    status: "Non Valide" },
  { id: 4, nom: "Liva Ravo",    note: 14, type: "Normale",    status: "Valide"     },
];

// ── Notes étudiants (Professeur) ──────────────────────────────────────────

export const ETUDIANT_NOTES_PROF: EtudiantNotesProfesseur[] = [
  { id: 1, nom: "Jean Dupont",  noteNormale: 6,    noteRattrapage: 10   },
  { id: 2, nom: "Rasoa Testa",  noteNormale: 12,   noteRattrapage: 12   },
  { id: 3, nom: "Marc Aina",    noteNormale: 8,    noteRattrapage: null },
  { id: 4, nom: "Liva Ravo",    noteNormale: 15,   noteRattrapage: null },
];

// ── Detail validation admin (par étudiant) ────────────────────────────────

export const ETUDIANT_VALIDATION_DETAIL: EtudiantValidationDetail = {
  id: 1,
  nom: "JEAN",
  prenom: "Dupont",
  mention: MENTIONS[2], // BTP
  niveaux: [
    {
      niveau: NIVEAUX[0], // L1
      ues: [
        {
          id: 1,
          nom: "UE : Mathématique Appliquée",
          noteNormale: null,
          noteRattrapage: null,
          ucs: [
            { id: 1, nom: "UC1 : Probabilité",    checked: false },
            { id: 2, nom: "UC2 : Problem Solving", checked: false },
            { id: 3, nom: "UC3 : Analyse",         checked: false },
          ],
        },
      ],
    },
    {
      niveau: NIVEAUX[1], // L2
      ues: [
        {
          id: 2,
          nom: "UE",
          noteNormale: null,
          noteRattrapage: null,
          ucs: [
            { id: 4, nom: "UC1 : Probabilité",    checked: false },
            { id: 5, nom: "UC2 : Problem Solving", checked: false },
            { id: 6, nom: "UC3 : Analyse",         checked: false },
          ],
        },
      ],
    },
  ],
};

export const RESULTATS: ResultatEtudiant[] = [
  {
    etudiant: ETUDIANTS[0],
    resultats: [
      {
        session: "Normale",
        semestre: SEMESTRES[0],
        ues: [
          {
            id: 1,
            nomUE: "UE1 : Mathématiques",
            ues20: 11,
            ecs: [
              { id: 1, nomEC: "EC1 : Algèbre", coefficient: 2, credit: 4, noteSur20: 11, ecAvecCoef: 22, resultat: "Validé" },
              { id: 2, nomEC: "EC2 : Analyse", coefficient: 4, credit: 8, noteSur20: 11, ecAvecCoef: 44, resultat: "Validé" },
            ],
          },
          {
            id: 2,
            nomUE: "UE2 : Sciences Physiques",
            ues20: 9,
            ecs: [
              { id: 3, nomEC: "EC1 : Physique", coefficient: 3, credit: 6, noteSur20: 9, ecAvecCoef: 27, resultat: "Non validé" },
            ],
          },
        ],
      },
    ],
  },
  {
    etudiant: ETUDIANTS[1],
    resultats: [
      {
        session: "Normale",
        semestre: SEMESTRES[0],
        ues: [
          {
            id: 1,
            nomUE: "UE1 : Mathématiques",
            ues20: 14,
            ecs: [
              { id: 1, nomEC: "EC1 : Algèbre", coefficient: 3, credit: 6, noteSur20: 14, ecAvecCoef: 42, resultat: "Validé" },
            ],
          },
        ],
      },
    ],
  },
];
