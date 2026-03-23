import { type NextRequest } from "next/server";
import { callApiGet, callApiPost } from "@/lib/callApi";

export async function GET(request: NextRequest) {
  return callApiGet(request, "/notes/matieres-coeff");
}

export async function POST(request: NextRequest) {
  const requiredFields = [
    "idMatiere",    // ID de la matière
    "idMention",    // ID de la mention
    "idNiveau",     // ID du niveau
    "idProfesseur", // ID du professeur assigné
    "coefficient",  // Coefficient de la matière dans cette mention
  ];
  return callApiPost(request, "/notes/matieres-coeff", requiredFields);
}
