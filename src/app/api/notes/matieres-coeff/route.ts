import { type NextRequest } from "next/server";
import { callApiGet, callApiPost } from "@/lib/callApi";

export async function GET(request: NextRequest) {
  return callApiGet(request, "/notes/matieres-coeff");
}

export async function POST(request: NextRequest) {
  return callApiPost(request, "/notes/matiere-coeff", [
    "idMatiere",
    "idMention",
    "idNiveau",
    "idProfesseur",
    "coefficient",
  ]);
}
