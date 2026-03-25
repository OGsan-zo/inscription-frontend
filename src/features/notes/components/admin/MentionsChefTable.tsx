'use client';

import { useState } from "react";
import type { Mention, User } from "@/lib/db";

interface Props {
  mentions: Mention[];
  chefs: User[];
  onAssigner: (mentionId: number, chefId: number) => Promise<void>;
}

export default function MentionsChefTable({ mentions, chefs, onAssigner }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedChefId, setSelectedChefId] = useState("");
  const [saving, setSaving] = useState(false);

  const startEdit = (mention: Mention) => {
    setEditingId(mention.id);
    setSelectedChefId(mention.chefMentionId ? String(mention.chefMentionId) : "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSelectedChefId("");
  };

  const saveEdit = async (mentionId: number) => {
    if (!selectedChefId) return;
    setSaving(true);
    try {
      await onAssigner(mentionId, Number(selectedChefId));
      setEditingId(null);
      setSelectedChefId("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">
          Liste des Mentions — Chef de Mention
        </h3>
      </div>

      {mentions.length === 0 ? (
        <p className="text-center py-10 text-slate-400">Aucune mention enregistrée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Mention</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Abréviation</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Chef de Mention</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mentions.map((m) => {
                const isEditing = editingId === m.id;
                const chefLabel = m.chefMentionNom
                  ? `${m.chefMentionNom} ${m.chefMentionPrenom ?? ""}`.trim()
                  : m.chefMentionId
                  ? `ID: ${m.chefMentionId}`
                  : null;

                return (
                  <tr
                    key={m.id}
                    className={`border-b border-slate-100 ${isEditing ? "bg-amber-50" : "hover:bg-slate-50"}`}
                  >
                    <td className="px-6 py-3 font-medium text-slate-900">{m.nom}</td>
                    <td className="px-6 py-3">
                      {m.abr && (
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">
                          {m.abr}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      {isEditing ? (
                        <select
                          value={selectedChefId}
                          onChange={(e) => setSelectedChefId(e.target.value)}
                          className="border border-indigo-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          autoFocus
                        >
                          <option value="">-- Choisir un chef --</option>
                          {chefs.map((c) => (
                            <option key={c.id} value={c.id ?? ""}>
                              {c.nom} {c.prenom}
                            </option>
                          ))}
                        </select>
                      ) : chefLabel ? (
                        <span className="text-slate-700 font-medium">{chefLabel}</span>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Non assigné</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(m.id)}
                            disabled={saving || !selectedChefId}
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
                          {m.chefMentionId ? "Modifier" : "Assigner"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
