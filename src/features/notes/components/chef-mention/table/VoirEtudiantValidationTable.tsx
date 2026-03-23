'use client';

import { EtudiantNoteValidation } from "../../../types/notes";

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
            {etudiants.map((e) => {
              const isValide = e.dateValidation !== null;
              return (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">{e.nom} {e.prenom}</td>
                  <td className="border border-gray-300 px-3 py-2">{e.valeur}</td>
                  <td className="border border-gray-300 px-3 py-2">{e.typeNoteName}</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <span className={isValide ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                      {isValide ? "Valide" : "Non Valide"}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {!isValide && (
                      <button
                        onClick={() => onValider(e)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded"
                      >
                        Valider
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
