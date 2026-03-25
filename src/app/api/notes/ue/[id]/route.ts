import { type NextRequest } from "next/server";
import { callApiPut } from "@/lib/callApi";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return callApiPut(request, `/notes/ue/${id}`, ["name"]);
}
