import { type NextRequest } from "next/server";
import { callApiGet, callApiPost } from "@/lib/callApi";

export async function GET(request: NextRequest) {
  return callApiGet(request, "/notes/matieres-coeff/professeur");
}

export async function POST(request: NextRequest) {
  const requiredFields = [
    "idMatiereCoefficient", // ID de la matière-coefficient concernée
    "annee",                // Année scolaire (ex: 2026)
    "isNormale",            // true = session normale, false = rattrapage
    "listeEtudiants",       // [{ etudiantId, valeur }]
  ];
  return callApiPost(request, "/notes/matieres-coeff/professeur", requiredFields);
}
