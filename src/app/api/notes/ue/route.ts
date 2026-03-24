import { type NextRequest } from "next/server";
import { callApiGet, callApiPost } from "@/lib/callApi";

export async function GET(request: NextRequest) {
  return callApiGet(request, "/notes/ue");
}

export async function POST(request: NextRequest) {
  const requiredFields = [
    "name", // Nom de l'UE
  ];
  return callApiPost(request, "/notes/ue", requiredFields);
}
