import { type NextRequest } from "next/server";
import { callApiGet, callApiPost } from "@/lib/callApi";

export async function GET(request: NextRequest) {
  return callApiGet(request, "/notes/matieres-coeff");
}

export async function POST(request: NextRequest) {
  const requiredFields = [
    "idMatiere",    
    "idMention",    
    "idNiveau",     
    "idProfesseur", // ID du professeur assigné
    "coefficient",  // Coefficient de la matière dans cette mention
  ];
  return callApiPost(request, "/notes/matieres-coeff", requiredFields);
}
