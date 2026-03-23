import { type NextRequest } from "next/server";
import { callApiGet, callApiPost } from "@/lib/callApi";

export async function GET(request: NextRequest) {
  return callApiGet(request, "/notes/matieres");
}

export async function POST(request: NextRequest) {
  const requiredFields = [
    "name",       // Nom de la matière
    "semestreId", // ID du semestre
    "ueId",       // ID de l'UE parente
  ];
  return callApiPost(request, "/notes/matieres", requiredFields);
}
