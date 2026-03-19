'use client';

import { EtudiantNoteValidation } from "../../types";

interface VoirEtudiantValidationTableProps {
  titre?: string;
  etudiants: EtudiantNoteValidation[];
  onValider: (etudiant: EtudiantNoteValidation) => Promise<void>;
}

export default function VoirEtudiantValidationTable({
  titre = "Voir Etudiant Note",
  etudiants,
  onValider,
}: VoirEtudiantValidationTableProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-3">{titre}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-300 px-3 py-2 text-left">Nom</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Note</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Type</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {etudiants.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2">{e.nom}</td>
                <td className="border border-gray-300 px-3 py-2">{e.note}</td>
                <td className="border border-gray-300 px-3 py-2">{e.type}</td>
                <td className="border border-gray-300 px-3 py-2">
                  <span
                    className={
                      e.status === "Valide"
                        ? "text-emerald-600 font-medium"
                        : "text-rose-600 font-medium"
                    }
                  >
                    {e.status}
                  </span>
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {e.status === "Non Valide" && (
                    <button
                      onClick={() => onValider(e)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded"
                    >
                      Valider
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
