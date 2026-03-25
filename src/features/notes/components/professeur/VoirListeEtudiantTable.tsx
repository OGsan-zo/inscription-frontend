'use client';

import { useState, useEffect, useMemo } from "react";
import { EtudiantNotesProfesseur } from "../../types/notes";
import { sortStudentsAlphabeticallyNote } from "@/lib/utils";

type NoteItem = { etudiantId: number; valeur: number };

interface VoirListeEtudiantTableProps {
  titre?: string;
  etudiants: EtudiantNotesProfesseur[];
  loading?: boolean;
  onValiderNormale: (items: NoteItem[]) => Promise<void>;
  onValiderRattrapage: (items: NoteItem[]) => Promise<void>;
}

export default function VoirListeEtudiantTable({
  titre = "Voir Liste Etudiant",
  etudiants,
  loading = false,
  onValiderNormale,
  onValiderRattrapage,
}: VoirListeEtudiantTableProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [localNotes, setLocalNotes] = useState<Record<number, { normale: string; rattrapage: string }>>({});
  const [savingN, setSavingN] = useState(false);
  const [savingR, setSavingR] = useState(false);

  // --- FONCTION DE TRI INTÉGRÉE ---
const sortedEtudiants = useMemo(() => 
    sortStudentsAlphabeticallyNote(etudiants), 
  [etudiants]);

  useEffect(() => {
    const init: Record<number, { normale: string; rattrapage: string }> = {};
    for (const e of etudiants) {
      const noteNormale = e.notes.find((n) => n.typeNoteId === 1)?.valeur ?? null;
      const noteRattrapage = e.notes.find((n) => n.typeNoteId === 2)?.valeur ?? null;
      init[e.details.etudiantId] = {
        normale: noteNormale !== null ? String(noteNormale) : "",
        rattrapage: noteRattrapage !== null ? String(noteRattrapage) : "",
      };
    }
    setLocalNotes(init);
    setChecked(new Set());
  }, [etudiants]);

  const toggle = (id: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const buildItems = (type: "normale" | "rattrapage"): NoteItem[] =>
    [...checked]
      .map((id) => ({ etudiantId: id, valeur: parseFloat(localNotes[id]?.[type] ?? "") }))
      .filter((item) => !isNaN(item.valeur));

  const handleValiderNormale = async () => {
    const items = buildItems("normale");
    if (items.length === 0) return;
    setSavingN(true);
    try { await onValiderNormale(items); }
    finally { setSavingN(false); }
  };

  const handleValiderRattrapage = async () => {
    const items = buildItems("rattrapage");
    if (items.length === 0) return;
    setSavingR(true);
    try { await onValiderRattrapage(items); }
    finally { setSavingR(false); }
  };

  if (loading) {
    return <p className="text-sm text-gray-500 py-4 text-center">Chargement...</p>;
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-3">{titre}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300 min-w-[500px]">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-300 px-3 py-2 w-10"></th>
              <th className="border border-gray-300 px-3 py-2 text-left">Nom & Prénom</th>
              <th className="border border-gray-300 px-3 py-2 text-center w-36">Note Normale</th>
              <th className="border border-gray-300 px-3 py-2 text-center w-36">Note Rattrapage</th>
            </tr>
          </thead>
          <tbody>
            {sortedEtudiants.length === 0 && (
              <tr>
                <td colSpan={4} className="border border-gray-300 px-3 py-4 text-center text-gray-400 italic">
                  Aucun étudiant trouvé
                </td>
              </tr>
            )}
            {/* On utilise sortedEtudiants ici au lieu de etudiants */}
            {sortedEtudiants.map((e) => {
              const id = e.details.etudiantId;
              return (
                <tr key={id} className={checked.has(id) ? "bg-blue-50" : "hover:bg-gray-50"}>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={checked.has(id)}
                      onChange={() => toggle(id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 font-medium">
                    {e.details.nom} {e.details.prenom}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="number"
                      min={0}
                      max={20}
                      step={0.01} // Mis à jour pour accepter les décimaux précis
                      placeholder="—"
                      value={localNotes[id]?.normale ?? ""}
                      onChange={(ev) =>
                        setLocalNotes((prev) => ({
                          ...prev,
                          [id]: { ...prev[id], normale: ev.target.value },
                        }))
                      }
                      className="w-full h-8 px-2 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="number"
                      min={0}
                      max={20}
                      step={0.01} // Mis à jour pour accepter les décimaux précis
                      placeholder="—"
                      value={localNotes[id]?.rattrapage ?? ""}
                      onChange={(ev) =>
                        setLocalNotes((prev) => ({
                          ...prev,
                          [id]: { ...prev[id], rattrapage: ev.target.value },
                        }))
                      }
                      className="w-full h-8 px-2 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={handleValiderNormale}
          disabled={savingN || checked.size === 0}
          className="bg-blue-900 hover:bg-blue-800 text-white text-sm px-4 py-1.5 rounded disabled:opacity-50 transition-colors"
        >
          {savingN ? "Enregistrement..." : "Valider (Normale)"}
        </button>
        <button
          onClick={handleValiderRattrapage}
          disabled={savingR || checked.size === 0}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-4 py-1.5 rounded disabled:opacity-50 transition-colors"
        >
          {savingR ? "Enregistrement..." : "Valider (Rattrapage)"}
        </button>
      </div>
    </div>
  );
}