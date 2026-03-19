'use client';

import Link from "next/link";
import ProfesseurView from "@/features/notes/components/professeur/ProfesseurView";

export default function ProfesseurPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
          <Link
            href="/notes"
            className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            ← Retour
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Professeur — Gestion des Notes</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <ProfesseurView />
        </div>
      </div>
    </div>
  );
}
