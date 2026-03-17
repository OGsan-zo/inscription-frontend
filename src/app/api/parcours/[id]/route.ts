import { NextRequest, NextResponse } from "next/server";
import { getServerAxios } from "@/lib/getServerAxios";
import axios from "axios";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const api = getServerAxios(request);
  try {
    const body = await request.json();
    const response = await api.put(`/parcours/${id}`, body, {
      headers: { "Content-Type": "application/json" },
    });
    return NextResponse.json(response.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        { error: err.response?.data?.message || err.message },
        { status: err.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const api = getServerAxios(request);
  try {
    const response = await api.delete(`/parcours/${id}`);
    return NextResponse.json(response.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        { error: err.response?.data?.message || err.message },
        { status: err.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
