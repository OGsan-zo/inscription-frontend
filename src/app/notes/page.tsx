import Link from "next/link";
import { BookOpen, Settings, GraduationCap, UserCheck } from "lucide-react";

const ENTRIES = [
  {
    href: "/notes/admin",
    icon: <Settings className="w-6 h-6 text-indigo-600" />,
    bg: "bg-indigo-50 group-hover:bg-indigo-100",
    title: "Administration",
    desc: "Gérer les matières, semestres et coefficients",
  },
  {
    href: "/notes/chef-mention",
    icon: <UserCheck className="w-6 h-6 text-violet-600" />,
    bg: "bg-violet-50 group-hover:bg-violet-100",
    title: "Chef-Mention",
    desc: "Coefficients par mention, validation des notes étudiants",
  },
  {
    href: "/notes/professeur",
    icon: <GraduationCap className="w-6 h-6 text-amber-600" />,
    bg: "bg-amber-50 group-hover:bg-amber-100",
    title: "Professeur",
    desc: "Saisir et soumettre les notes de vos matières",
  },
  {
    href: "/notes/resultats",
    icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
    bg: "bg-emerald-50 group-hover:bg-emerald-100",
    title: "Résultats Étudiants",
    desc: "Consulter les notes et résultats par semestre",
  },
];

export default function NotesHubPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Module Notes</h1>
          <p className="text-slate-500 mt-2">Gestion des matières et des résultats académiques</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ENTRIES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="group flex items-center gap-5 bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-6 transition-all duration-200"
            >
              <div className={`flex-shrink-0 w-12 h-12 ${e.bg} rounded-xl flex items-center justify-center transition-colors`}>
                {e.icon}
              </div>
              <div>
                <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{e.title}</p>
                <p className="text-sm text-slate-500">{e.desc}</p>
              </div>
            </Link>
          ))}
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
