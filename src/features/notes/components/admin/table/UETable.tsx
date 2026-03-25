'use client';

import { useState } from "react";
import type { UE } from "../../../types/notes";

interface Props {
  ues: UE[];
  onModifier?: (id: number, newName: string) => Promise<void>;
}

export default function UETable({ ues, onModifier }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  const startEdit = (ue: UE) => {
    setEditingId(ue.id);
    setEditName(ue.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = async (id: number) => {
    if (!editName.trim() || !onModifier) return;
    setSaving(true);
    await onModifier(id, editName.trim());
    setEditingId(null);
    setEditName("");
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">Liste des UE</h3>
      </div>
      {ues.length === 0 ? (
        <p className="text-center py-10 text-slate-400">Aucune UE enregistrée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[300px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Nom</th>
                {onModifier && (
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {ues.map((ue) => (
                <tr key={ue.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-900">
                    {editingId === ue.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border border-indigo-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full max-w-xs"
                        autoFocus
                      />
                    ) : (
                      ue.name
                    )}
                  </td>
                  {onModifier && (
                    <td className="px-6 py-3">
                      {editingId === ue.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(ue.id)}
                            disabled={saving}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded disabled:opacity-50"
                          >
                            {saving ? "..." : "Sauvegarder"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={saving}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(ue)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded"
                        >
                          Modifier
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
