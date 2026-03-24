import { type NextRequest } from "next/server";
import { callApiPut } from "@/lib/callApi";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Pas de body requis — la validation se fait uniquement par l'id
  return callApiPut(request, `/notes/valider/${id}`);
}
