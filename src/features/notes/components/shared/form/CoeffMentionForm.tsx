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

  const selectCls =
    "w-full sm:flex-1 appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer transition-colors";
  const inputCls =
    "w-full sm:flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";
  const labelCls = "sm:w-44 text-sm font-medium text-gray-600 sm:shrink-0";
  const rowCls = "flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3";

  const SelectWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative w-full sm:flex-1">
      {children}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 w-full max-w-lg space-y-4"
    >
      <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-1">
        Insertion Matière — Coefficients par Mention
      </h2>

      <div className={rowCls}>
        <label className={labelCls}>Matière :</label>
        <SelectWrapper>
          <select
            value={matiereId}
            onChange={(e) => setMatiereId(e.target.value)}
            required
            className={selectCls}
          >
            <option value="">Sélectionner une matière</option>
            {matieres.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nom} — {m.semestre.name}
              </option>
            ))}
          </select>
        </SelectWrapper>
      </div>

      <div className={rowCls}>
        <label className={labelCls}>Coefficient :</label>
        <input
          type="number"
          min={1}
          value={coeff}
          onChange={(e) => setCoeff(e.target.value)}
          placeholder="Ex: 2"
          required
          className={inputCls}
        />
      </div>

      <div className={rowCls}>
        <label className={labelCls}>Niveau :</label>
        <SelectWrapper>
          <select
            value={niveauId}
            onChange={(e) => setNiveauId(e.target.value)}
            required
            className={selectCls}
          >
            <option value="">Sélectionner un niveau</option>
            {niveaux.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nom}
              </option>
            ))}
          </select>
        </SelectWrapper>
      </div>

      {overrideMentionId === undefined && (
        <div className={rowCls}>
          <label className={labelCls}>Mention :</label>
          {isAdmin ? (
            <SelectWrapper>
              <select
                value={mentionId}
                onChange={(e) => setMentionId(e.target.value)}
                required
                className={selectCls}
              >
                <option value="">Sélectionner une mention</option>
                {mentions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.abr ?? m.nom}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          ) : (
            <input
              type="text"
              value={mentionFixe?.abr ?? mentionFixe?.nom ?? ""}
              readOnly
              className="w-full sm:flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          )}
        </div>
      )}

      {showProfesseur && (
        <div className={rowCls}>
          <label className={labelCls}>Professeur :</label>
          <SelectWrapper>
            <select
              value={professeurId}
              onChange={(e) => setProfesseurId(e.target.value)}
              required
              className={selectCls}
            >
              <option value="">Sélectionner un professeur</option>
              {professeurs!.map((p) => (
                <option key={p.id} value={p.id ?? ""}>
                  {p.nom} {p.prenom}
                </option>
              ))}
            </select>
          </SelectWrapper>
        </div>
      )}

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium px-6 py-2 rounded-md disabled:opacity-50 transition-colors w-full sm:w-auto"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
