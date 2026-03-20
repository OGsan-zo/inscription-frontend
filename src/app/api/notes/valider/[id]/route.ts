import { type NextRequest, NextResponse } from "next/server";
import { getServerAxios } from "@/lib/getServerAxios";
import axios from "axios";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const api = getServerAxios(request);
    const response = await api.put(`/notes/valider/${id}`);
    return NextResponse.json(response.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const msg = err.response?.data?.message || err.message;
      return NextResponse.json({ error: msg }, { status: err.response?.status || 500 });
    }
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
