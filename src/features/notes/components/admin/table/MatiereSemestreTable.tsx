'use client';

import { useState } from "react";
import type { MatiereUE, UE, Semestre } from "../../../types/notes";

interface EditValues {
  name: string;
  ueId: string;
  semestreId: string;
}

interface Props {
  matieres: MatiereUE[];
  ues?: UE[];
  semestres?: Semestre[];
  onModifier?: (id: number, values: EditValues) => Promise<void>;
}

export default function MatiereSemestreTable({ matieres, ues = [], semestres = [], onModifier }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({ name: "", ueId: "", semestreId: "" });
  const [saving, setSaving] = useState(false);

  const startEdit = (m: MatiereUE) => {
    setEditingId(m.id);
    setEditValues({ name: m.nom, ueId: String(m.ue.id), semestreId: String(m.semestre.id) });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: number) => {
    if (!editValues.name.trim() || !editValues.ueId || !editValues.semestreId || !onModifier) return;
    setSaving(true);
    await onModifier(id, editValues);
    setEditingId(null);
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">Liste des Matières</h3>
      </div>
      {matieres.length === 0 ? (
        <p className="text-center py-10 text-slate-400">Aucune matière enregistrée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Matière</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">UE</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Semestre</th>
                {onModifier && (
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {matieres.map((m) => (
                <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-900">
                    {editingId === m.id ? (
                      <input
                        type="text"
                        value={editValues.name}
                        onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))}
                        className="border border-indigo-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full max-w-[180px]"
                        autoFocus
                      />
                    ) : (
                      m.nom
                    )}
                  </td>
                  <td className="px-6 py-3 text-slate-600">
                    {editingId === m.id ? (
                      <select
                        value={editValues.ueId}
                        onChange={(e) => setEditValues((v) => ({ ...v, ueId: e.target.value }))}
                        className="border border-indigo-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        {ues.map((u) => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    ) : (
                      m.ue.name
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {editingId === m.id ? (
                      <select
                        value={editValues.semestreId}
                        onChange={(e) => setEditValues((v) => ({ ...v, semestreId: e.target.value }))}
                        className="border border-indigo-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        {semestres.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{m.semestre.name}</span>
                    )}
                  </td>
                  {onModifier && (
                    <td className="px-6 py-3">
                      {editingId === m.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(m.id)}
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
                          onClick={() => startEdit(m)}
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
