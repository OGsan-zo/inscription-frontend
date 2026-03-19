'use client';

import { useState, useEffect } from "react";
import { MatiereSemestre } from "../../types";

// Types compatibles avec db.ts (id: number | string)
interface MentionOption { id: number | string; nom: string; abr?: string; }
interface NiveauOption  { id: number | string; nom: string; }

interface InsertionCoeffMentionFormProps {
  matiereSemestres: MatiereSemestre[];
  mentions: MentionOption[];
  niveaux: NiveauOption[];
  /** Si l'utilisateur est un admin, il peut choisir la mention */
  isAdmin?: boolean;
  /** Mention fixe si l'utilisateur est Chef-Mention (pas admin) */
  mentionFixe?: MentionOption;
  onSubmit: (
    idMatiereSemestre: number,
    coefficient: number,
    idNiveau: number | string,
    idMention: number | string
  ) => Promise<void>;
}

export default function InsertionCoeffMentionForm({
  matiereSemestres,
  mentions,
  niveaux,
  isAdmin = false,
  mentionFixe,
  onSubmit,
}: InsertionCoeffMentionFormProps) {
  const [idMatiereSemestre, setIdMatiereSemestre] = useState("");
  const [coefficient, setCoefficient] = useState("");
  const [idNiveau, setIdNiveau] = useState("");
  const [idMention, setIdMention] = useState(
    mentionFixe ? String(mentionFixe.id) : ""
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mentionFixe) setIdMention(String(mentionFixe.id));
  }, [mentionFixe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idMatiereSemestre || !coefficient || !idNiveau || !idMention) return;
    setSaving(true);
    try {
      await onSubmit(
        Number(idMatiereSemestre),
        Number(coefficient),
        Number(idNiveau),
        Number(idMention)
      );
      setIdMatiereSemestre("");
      setCoefficient("");
      setIdNiveau("");
      if (isAdmin) setIdMention("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 max-w-lg space-y-4">
      <h2 className="text-base font-semibold text-gray-800 mb-2">
        Insertion Matière — Coefficients par Mention
      </h2>

      {/* Matière Semestre */}
      <div className="flex items-center gap-3">
        <label className="w-44 text-sm text-gray-600 shrink-0">Matière Semestre :</label>
        <select
          value={idMatiereSemestre}
          onChange={(e) => setIdMatiereSemestre(e.target.value)}
          required
          className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Matière Semestre</option>
          {matiereSemestres.map((ms) => (
            <option key={ms.id} value={ms.id}>
              {ms.matiere.nom} — {ms.semestre.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Coefficient */}
      <div className="flex items-center gap-3">
        <label className="w-44 text-sm text-gray-600 shrink-0">Coefficient :</label>
        <input
          type="number"
          min={1}
          value={coefficient}
          onChange={(e) => setCoefficient(e.target.value)}
          placeholder="Coefficient"
          required
          className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Niveaux */}
      <div className="flex items-center gap-3">
        <label className="w-44 text-sm text-gray-600 shrink-0">Niveaux :</label>
        <select
          value={idNiveau}
          onChange={(e) => setIdNiveau(e.target.value)}
          required
          className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Niveaux</option>
          {niveaux.map((n) => (
            <option key={n.id} value={n.id}>
              {n.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Mention */}
      <div className="flex items-center gap-3">
        <label className="w-44 text-sm text-gray-600 shrink-0">Mention :</label>
        {isAdmin ? (
          <select
            value={idMention}
            onChange={(e) => setIdMention(e.target.value)}
            required
            className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Mention select</option>
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
            className="flex-1 border border-gray-200 rounded px-3 py-1.5 text-sm bg-gray-50 text-gray-500"
          />
        )}
      </div>

      <div className="pt-2 text-right">
        <button
          type="submit"
          disabled={saving}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-5 py-1.5 rounded disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
