import { type NextRequest } from "next/server";
import { callApiGet } from "@/lib/callApi";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return callApiGet(request, `/notes/resultats/${id}`, ["idSemestre"]);
}
