'use client';

import { useState } from "react";
import { EtudiantNotesProfesseur } from "../../types/notes";

interface VoirListeEtudiantTableProps {
  titre?: string;
  etudiants: EtudiantNotesProfesseur[];
  onValiderNormale: (ids: number[]) => Promise<void>;
  onValiderRattrapage: (ids: number[]) => Promise<void>;
}

export default function VoirListeEtudiantTable({
  titre = "Voir Liste Etudiant",
  etudiants,
  onValiderNormale,
  onValiderRattrapage,
}: VoirListeEtudiantTableProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [savingN, setSavingN] = useState(false);
  const [savingR, setSavingR] = useState(false);

  const toggle = (id: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleValiderNormale = async () => {
    setSavingN(true);
    try { await onValiderNormale([...checked]); }
    finally { setSavingN(false); }
  };

  const handleValiderRattrapage = async () => {
    setSavingR(true);
    try { await onValiderRattrapage([...checked]); }
    finally { setSavingR(false); }
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-3">{titre}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-300 px-3 py-2 w-10"></th>
              <th className="border border-gray-300 px-3 py-2 text-left">Nom</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Note Normale</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Note Rattrapage</th>
            </tr>
          </thead>
          <tbody>
            {etudiants.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={checked.has(e.id)}
                    onChange={() => toggle(e.id)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">{e.nom}</td>
                <td className="border border-gray-300 px-3 py-2">
                  {e.noteNormale ?? <span className="text-gray-400">—</span>}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {e.noteRattrapage ?? <span className="text-gray-400">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleValiderNormale}
          disabled={savingN || checked.size === 0}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-4 py-1.5 rounded disabled:opacity-50"
        >
          {savingN ? "Validation..." : "Valider (Normale)"}
        </button>
        <button
          onClick={handleValiderRattrapage}
          disabled={savingR || checked.size === 0}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-4 py-1.5 rounded disabled:opacity-50"
        >
          {savingR ? "Validation..." : "Valider (Rattrapage)"}
        </button>
      </div>
    </div>
  );
}
