import Link from "next/link";
import { BookOpen, Settings } from "lucide-react";

export default function NotesHubPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Module Notes</h1>
          <p className="text-slate-500 mt-2">Gestion des matières et des résultats académiques</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Link
            href="/notes/admin"
            className="group flex items-center gap-5 bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-6 transition-all duration-200"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center transition-colors">
              <Settings className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Administration</p>
              <p className="text-sm text-slate-500">Gérer les matières, semestres et coefficients</p>
            </div>
          </Link>

          <Link
            href="/notes/resultats"
            className="group flex items-center gap-5 bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-6 transition-all duration-200"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center transition-colors">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Résultats Étudiants</p>
              <p className="text-sm text-slate-500">Consulter les notes et résultats par semestre</p>
            </div>
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
