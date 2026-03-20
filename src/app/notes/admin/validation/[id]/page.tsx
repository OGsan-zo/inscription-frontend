'use client';

import Link from "next/link";
import { use } from "react";
import AdminValidationDetailView from "@/features/notes/components/admin/validation/AdminValidationDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminValidationDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const idEtudiant = Number(id);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/notes/admin"
            className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            ← Retour
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Validation — Détail Étudiant</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <AdminValidationDetailView idEtudiant={idEtudiant} />
        </div>
      </div>
    </div>
  );
}
