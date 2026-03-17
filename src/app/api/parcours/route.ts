import { NextRequest } from "next/server";
import { callApiGet } from "@/lib/callApi";
import { callApiPost } from "@/lib/callApi";

export async function GET(request: NextRequest) {
    return callApiGet(request, "/parcours");
}
export async function POST(request: NextRequest) {
   const requiredFields = [
      "nom",
      "idMention",
      "idNiveau"
   ];
   return callApiPost(request, "/parcours", requiredFields);
}