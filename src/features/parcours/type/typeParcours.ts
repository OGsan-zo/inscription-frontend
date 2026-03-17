import { Niveau,Mention } from "@/lib/db";

export interface Parcours {
    id: number;
    nom: string;
    createdAt?: string;
    mention: Mention;
    niveau: Niveau;
}

export interface ParcoursRetour{
    success: boolean;
    error?: string;
    parcours: Parcours[];
}
export interface ParcoursFormData{
    nom: string;
    idMention: number;
    idNiveau: number;
}

export interface AssignationPayload {
  idParcours: number;
  idEtudiants: number[]; // Tableau d'IDs
}

// Type pour les éléments de la réponse "data"
export interface AssignationResultat {
  idNiveauEtudiant: number;
  idEtudiant: number;
}

// Interface de retour spécifique pour l'assignation
export interface AssignationRetour {
  success: boolean;
  error?: string;
  data: AssignationResultat[];
  loading: boolean;
}
