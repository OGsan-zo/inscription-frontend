'use client';

import { useState } from "react";
import { NiveauValidation } from "../../types/notes";

interface NiveauValidationTableProps {
  niveauValidation: NiveauValidation;
  onValiderNormale: (idNiveau: number, ucIds: number[]) => Promise<void>;
  onValiderRattrapage: (idNiveau: number, ucIds: number[]) => Promise<void>;
}

export default function NiveauValidationTable({
  niveauValidation,
  onValiderNormale,
  onValiderRattrapage,
}: NiveauValidationTableProps) {
  const { niveau, ues } = niveauValidation;
  const [checkedUCs, setCheckedUCs] = useState<Set<number>>(new Set());
  const [savingN, setSavingN] = useState(false);
  const [savingR, setSavingR] = useState(false);

  const toggleUC = (id: number) =>
    setCheckedUCs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleValiderNormale = async () => {
    setSavingN(true);
    try { await onValiderNormale(niveau.id, [...checkedUCs]); }
    finally { setSavingN(false); }
  };

  const handleValiderRattrapage = async () => {
    setSavingR(true);
    try { await onValiderRattrapage(niveau.id, [...checkedUCs]); }
    finally { setSavingR(false); }
  };

  return (
    <div className="border border-gray-300 rounded">
      {/* En-tête niveau */}
      <div className="bg-gray-100 px-3 py-2 font-semibold text-sm text-gray-700 border-b border-gray-300">
        {niveau.nom}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-600">
            <th className="border-b border-gray-200 px-3 py-2 w-8"></th>
            <th className="border-b border-gray-200 px-3 py-2 text-left"></th>
            <th className="border-b border-gray-200 px-3 py-2 text-left">Note normale</th>
            <th className="border-b border-gray-200 px-3 py-2 text-left">Note Rattrapage</th>
          </tr>
        </thead>
        <tbody>
          {ues.map((ue) => (
            <>
              {/* Ligne UE */}
              <tr key={`ue-${ue.id}`} className="bg-indigo-50">
                <td className="border-b border-gray-200 px-3 py-2"></td>
                <td className="border-b border-gray-200 px-3 py-2 font-medium text-indigo-800">
                  {ue.nom}
                </td>
                <td className="border-b border-gray-200 px-3 py-2 text-gray-500">
                  {ue.noteNormale ?? ""}
                </td>
                <td className="border-b border-gray-200 px-3 py-2 text-gray-500">
                  {ue.noteRattrapage ?? ""}
                </td>
              </tr>
              {/* Lignes UC */}
              {ue.ucs.map((uc) => (
                <tr key={`uc-${uc.id}`} className="hover:bg-gray-50">
                  <td className="border-b border-gray-100 px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={checkedUCs.has(uc.id)}
                      onChange={() => toggleUC(uc.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="border-b border-gray-100 px-3 py-2 pl-6 text-gray-700">
                    {uc.nom}
                  </td>
                  <td className="border-b border-gray-100 px-3 py-2"></td>
                  <td className="border-b border-gray-100 px-3 py-2"></td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>

      <div className="flex gap-3 px-3 py-3">
        <button
          onClick={handleValiderNormale}
          disabled={savingN}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-4 py-1.5 rounded disabled:opacity-50"
        >
          {savingN ? "..." : "Valider"}
        </button>
        <button
          onClick={handleValiderRattrapage}
          disabled={savingR}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-4 py-1.5 rounded disabled:opacity-50"
        >
          {savingR ? "..." : "Valider"}
        </button>
      </div>
    </div>
  );
}
