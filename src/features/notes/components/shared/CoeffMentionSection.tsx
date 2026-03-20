'use client';

import { useState } from "react";
import type { User } from "@/lib/db";
import type { MatiereUE, MentionNote, Niveau, MatiereCoeffItem } from "../../types/notes";

interface SubmitValues {
  matiereId: number;
  mentionId: number;
  niveauId: number;
  professeurId?: number;
  coefficient: number;
}

interface Props {
  matieres: MatiereUE[];
  mentions: MentionNote[];
  niveaux: Niveau[];
  /** Si fourni, affiche le champ Professeur */
  professeurs?: User[];
  /** Si true, la mention est sélectionnable */
  isAdmin?: boolean;
  /** Mention verrouillée (ChefMention) */
  mentionFixe?: { id: number | string; nom: string; abr?: string };
  coeffMentions: MatiereCoeffItem[];
  onSubmit: (values: SubmitValues) => Promise<void>;
  /** Si fourni, affiche le bouton "Voir Etudiant" dans le tableau */
  onVoirEtudiant?: (item: MatiereCoeffItem) => void;
  /** Si fourni, affiche le bouton "Modifier" dans le tableau */
  onModifier?: (item: MatiereCoeffItem) => void;
}

export default function CoeffMentionSection({
  matieres,
  mentions,
  niveaux,
  professeurs,
  isAdmin = false,
  mentionFixe,
  coeffMentions,
  onSubmit,
  onVoirEtudiant,
  onModifier,
}: Props) {
  const [matiereId, setMatiereId] = useState("");
  const [coeff, setCoeff] = useState("");
  const [niveauId, setNiveauId] = useState("");
  const [mentionId, setMentionId] = useState(
    mentionFixe ? String(mentionFixe.id) : ""
  );
  const [professeurId, setProfesseurId] = useState("");
  const [saving, setSaving] = useState(false);

  const showProfesseur = !!professeurs && professeurs.length > 0;
  const showActions = !!onVoirEtudiant || !!onModifier;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasProfesseur = !showProfesseur || !!professeurId;
    if (!matiereId || !coeff || !niveauId || !mentionId || !hasProfesseur) return;
    setSaving(true);
    try {
      await onSubmit({
        matiereId: Number(matiereId),
        mentionId: Number(mentionId),
        niveauId: Number(niveauId),
        professeurId: professeurId ? Number(professeurId) : undefined,
        coefficient: Number(coeff),
      });
      setMatiereId("");
      setCoeff("");
      setNiveauId("");
      if (isAdmin) setMentionId("");
      setProfesseurId("");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full sm:flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
  const labelCls = "sm:w-44 text-sm text-gray-600 sm:shrink-0";
  const rowCls = "flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3";

  return (
    <div className="space-y-6">
      {/* ── Formulaire ─────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 w-full max-w-lg space-y-4"
      >
        <h2 className="text-base font-semibold text-gray-800 mb-2">
          Insertion Matière — Coefficients par Mention
        </h2>

        <div className={rowCls}>
          <label className={labelCls}>Matière :</label>
          <select
            value={matiereId}
            onChange={(e) => setMatiereId(e.target.value)}
            required
            className={inputCls}
          >
            <option value="">Matière</option>
            {matieres.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nom} — {m.semestre.name}
              </option>
            ))}
          </select>
        </div>

        <div className={rowCls}>
          <label className={labelCls}>Coefficient :</label>
          <input
            type="number"
            min={1}
            value={coeff}
            onChange={(e) => setCoeff(e.target.value)}
            placeholder="Coefficient"
            required
            className={inputCls}
          />
        </div>

        <div className={rowCls}>
          <label className={labelCls}>Niveau :</label>
          <select
            value={niveauId}
            onChange={(e) => setNiveauId(e.target.value)}
            required
            className={inputCls}
          >
            <option value="">Niveau</option>
            {niveaux.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nom}
              </option>
            ))}
          </select>
        </div>

        <div className={rowCls}>
          <label className={labelCls}>Mention :</label>
          {isAdmin ? (
            <select
              value={mentionId}
              onChange={(e) => setMentionId(e.target.value)}
              required
              className={inputCls}
            >
              <option value="">Mention</option>
              {mentions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.abr ?? m.nom}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={mentionFixe?.abr ?? mentionFixe?.nom ?? ""}
              readOnly
              className="w-full sm:flex-1 border border-gray-200 rounded px-3 py-1.5 text-sm bg-gray-50 text-gray-500"
            />
          )}
        </div>

        {showProfesseur && (
          <div className={rowCls}>
            <label className={labelCls}>Professeur :</label>
            <select
              value={professeurId}
              onChange={(e) => setProfesseurId(e.target.value)}
              required
              className={inputCls}
            >
              <option value="">Professeur</option>
              {professeurs!.map((p) => (
                <option key={p.id} value={p.id ?? ""}>
                  {p.nom} {p.prenom}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-5 py-1.5 rounded disabled:opacity-50 w-full sm:w-auto"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>

      {/* ── Tableau ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            Liste Matière — Coefficient — Mention
          </h3>
        </div>

        {coeffMentions.length === 0 ? (
          <p className="text-center py-10 text-slate-400">
            Aucune entrée enregistrée.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Matière</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Semestre</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Mention</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Niveau</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Coef</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Professeur</th>
                  {showActions && (
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {coeffMentions.map((cm) => (
                  <tr key={cm.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">{cm.matiere.nom}</td>
                    <td className="px-6 py-3">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                        {cm.semestre.name}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">
                        {cm.mention.abr || cm.mention.nom}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-semibold">
                        {cm.niveau.nom}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-bold text-slate-700">{cm.coefficient}</td>
                    <td className="px-6 py-3 text-slate-600">
                      {cm.professeur.nom} {cm.professeur.prenom}
                    </td>
                    {showActions && (
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          {onModifier && (
                            <button
                              onClick={() => onModifier(cm)}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded"
                            >
                              Modifier
                            </button>
                          )}
                          {onVoirEtudiant && (
                            <button
                              onClick={() => onVoirEtudiant(cm)}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded"
                            >
                              Voir Etudiant
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
