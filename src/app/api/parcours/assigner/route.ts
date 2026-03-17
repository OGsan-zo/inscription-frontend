import { NextRequest } from "next/server";
import { callApiPost } from "@/lib/callApi";

export async function POST(request: NextRequest) {
   const requiredFields = [
      "idParcours",
      "idEtudiants",
   ];
   return callApiPost(request, "/parcours/assigner", requiredFields);
}