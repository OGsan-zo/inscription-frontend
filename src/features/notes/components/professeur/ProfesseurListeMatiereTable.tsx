'use client';

import { MatiereCoeff } from "../../types/notes";

interface ProfesseurListeMatiereTableProps {
  matieres: MatiereCoeff[];
  onVoirEtudiant: (matiere: MatiereCoeff) => void;
}

export default function ProfesseurListeMatiereTable({
  matieres,
  onVoirEtudiant,
}: ProfesseurListeMatiereTableProps) {
  if (matieres.length === 0) {
    return <p className="text-sm text-gray-400 italic">Aucune matière.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="border border-gray-300 px-3 py-2 text-left">Nom</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Semestre</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Niveau</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Coefficient</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {matieres.map((m) => (
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-3 py-2">{m.nom}</td>
              <td className="border border-gray-300 px-3 py-2">{m.semestre.nom}</td>
              <td className="border border-gray-300 px-3 py-2">{m.niveau.nom}</td>
              <td className="border border-gray-300 px-3 py-2">{m.coefficient}</td>
              <td className="border border-gray-300 px-3 py-2">
                <button
                  onClick={() => onVoirEtudiant(m)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded"
                >
                  Voir Etudiant
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
