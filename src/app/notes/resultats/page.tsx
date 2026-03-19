"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ResultatsView from "@/features/notes/components/ResultatsView";

export default function NotesResultatsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/notes"
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>
            <span className="text-slate-300">|</span>
            <h1 className="text-base sm:text-lg font-bold text-slate-900">Résultats Étudiants</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <ResultatsView />
      </main>
    </div>
  );
}
