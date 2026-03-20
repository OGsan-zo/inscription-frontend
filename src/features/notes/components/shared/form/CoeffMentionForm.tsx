'use client';

import { useState } from "react";
import type { User } from "@/lib/db";
import type { MatiereUE, MentionNote, Niveau } from "../../../types/notes";

export interface CoeffMentionSubmitValues {
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
  /** Si true, la mention est sélectionnable (admin) */
  isAdmin?: boolean;
  /** Mention verrouillée en lecture seule */
  mentionFixe?: { id: number | string; nom: string; abr?: string };
  /** Si fourni, le champ mention est masqué et cette valeur est utilisée directement (ex: userId du chef-mention) */
  overrideMentionId?: number | string;
  onSubmit: (values: CoeffMentionSubmitValues) => Promise<void>;
}

export default function CoeffMentionForm({
  matieres,
  mentions,
  niveaux,
  professeurs,
  isAdmin = false,
  mentionFixe,
  overrideMentionId,
  onSubmit,
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
  const effectiveMentionId = overrideMentionId !== undefined ? overrideMentionId : mentionId;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const hasProfesseur = !showProfesseur || !!professeurId;
    if (!matiereId || !coeff || !niveauId || !effectiveMentionId || !hasProfesseur) return;
    setSaving(true);
    try {
      await onSubmit({
        matiereId: Number(matiereId),
        mentionId: Number(effectiveMentionId),
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

      {overrideMentionId === undefined && (
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
      )}

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
  );
}
