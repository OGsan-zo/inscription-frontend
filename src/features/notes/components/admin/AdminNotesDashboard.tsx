"use client";

import { useAdminNotesDashboard } from "../../hooks/useAdminNotesDashboard";

interface Props {
  onTabChange: (tab: string) => void;
}

interface StatCardProps {
  label: string;
  value: number;
  color: "blue" | "indigo" | "violet" | "green";
}

const COLOR_MAP = {
  blue:   { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400"   },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-400" },
  green:  { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-400"  },
};

function StatCard({ label, value, color }: StatCardProps) {
  const c = COLOR_MAP[color];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 px-6 py-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
        <span className={`w-3 h-3 rounded-full ${c.dot} block`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function AdminNotesDashboard({ onTabChange }: Props) {
  const {
    totalUE,
    totalMatieres,
    totalCoeffs,
    matieresNonAssignees,
    mentionsSansChef,
    totalProfesseurs,
    totalChefMentions,
    matieresParMention,
    loading,
  } = useAdminNotesDashboard();

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-400 text-sm">
        Chargement du tableau de bord...
      </div>
    );
  }

  const toutEstOk = matieresNonAssignees.length === 0 && mentionsSansChef === 0;

  return (
    <div className="space-y-6">

      {/* ── Cartes statistiques ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Unités d'Enseignement" value={totalUE}           color="blue"   />
        <StatCard label="Matières enregistrées"  value={totalMatieres}     color="indigo" />
        <StatCard label="Coefficients assignés"  value={totalCoeffs}       color="violet" />
        <StatCard label="Professeurs"            value={totalProfesseurs}  color="green"  />
        <StatCard label="Chefs de Mention"       value={totalChefMentions} color="indigo" />
      </div>

      {/* ── Matières par mention ── */}
      {matieresParMention.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Matières par mention</h3>
            <p className="text-xs text-slate-400 mt-0.5">Nombre de matières assignées (avec coefficient) par mention</p>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-2">
              {matieresParMention.map(({ mentionNom, count }) => {
                const max = matieresParMention[0].count;
                const pct = Math.round((count / max) * 100);
                return (
                  <div key={mentionNom} className="flex items-center gap-3">
                    <span className="text-sm text-slate-700 w-40 shrink-0 truncate">{mentionNom}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Alertes ── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">État de la configuration</h3>
        </div>

        <div className="px-6 py-4 space-y-3">

          {toutEstOk && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <p className="text-sm text-green-700 font-medium">
                Tout est configuré correctement.
              </p>
            </div>
          )}

          {matieresNonAssignees.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl px-4 py-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">
                  {matieresNonAssignees.length} matière{matieresNonAssignees.length > 1 ? "s" : ""} sans coefficient assigné
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  {matieresNonAssignees.map((m) => m.nom).join(", ")}
                </p>
              </div>
              <button
                onClick={() => onTabChange("matieres")}
                className="text-xs font-semibold text-amber-800 underline underline-offset-2 hover:text-amber-900 whitespace-nowrap"
              >
                Voir les matières →
              </button>
            </div>
          )}

          {mentionsSansChef > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-rose-50 border-l-4 border-rose-400 rounded-r-xl px-4 py-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-rose-800">
                  {mentionsSansChef} mention{mentionsSansChef > 1 ? "s" : ""} sans Chef de Mention assigné
                </p>
                <p className="text-xs text-rose-600 mt-0.5">
                  Un Chef de Mention est nécessaire pour valider les coefficients.
                </p>
              </div>
              <button
                onClick={() => onTabChange("matieres")}
                className="text-xs font-semibold text-rose-800 underline underline-offset-2 hover:text-rose-900 whitespace-nowrap"
              >
                Gérer les mentions →
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ── Accès rapide ── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Accès rapide</h3>
        </div>
        <div className="px-6 py-4 flex flex-wrap gap-3">
          <button
            onClick={() => onTabChange("matieres")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Ajouter une matière
          </button>
          <button
            onClick={() => onTabChange("ue")}
            className="bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg border border-slate-200 transition-colors"
          >
            + Ajouter une UE
          </button>
        </div>
      </div>

    </div>
  );
}
