'use client';

import { useState } from "react";
import type { MatiereCoeffItem } from "../../../types/notes";
import type { User } from "@/lib/db";

interface SaveEditValues {
  coefficient: number;
  credit: number;
  professeurId: number;
}

interface Props {
  coeffMentions: MatiereCoeffItem[];
  professeurs?: User[];
  onVoirEtudiant?: (item: MatiereCoeffItem) => void;
  onSaveEdit?: (id: number, values: SaveEditValues) => Promise<void>;
}

export default function CoeffMentionTable({ coeffMentions, professeurs = [], onVoirEtudiant, onSaveEdit }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCoeff, setEditCoeff] = useState("");
  const [editCredit, setEditCredit] = useState("");
  const [editProfesseurId, setEditProfesseurId] = useState("");
  const [saving, setSaving] = useState(false);

  const startEdit = (item: MatiereCoeffItem) => {
    setEditingId(item.id);
    setEditCoeff(String(item.coefficient));
    setEditCredit(String(item.credit));
    setEditProfesseurId(String(item.professeur.id));
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (item: MatiereCoeffItem) => {
    if (!editCoeff || !editCredit || !onSaveEdit) return;
    setSaving(true);
    await onSaveEdit(item.id, {
      coefficient: Number(editCoeff),
      credit: Number(editCredit),
      professeurId: Number(editProfesseurId) || item.professeur.id,
    });
    setEditingId(null);
    setSaving(false);
  };

  const showActions = !!onSaveEdit || !!onVoirEtudiant;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">
          Liste Matière — Coefficient — Mention
        </h3>
      </div>

      {coeffMentions.length === 0 ? (
        <p className="text-center py-10 text-slate-400">Aucune entrée enregistrée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">UE</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Matière</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Semestre</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Mention</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Niveau</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Coef</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Crédit</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Professeur</th>
                {showActions && (
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {coeffMentions.map((cm) => {
                const isEditing = editingId === cm.id;
                return (
                  <tr key={cm.id} className={`border-b border-slate-100 ${isEditing ? "bg-amber-50" : "hover:bg-slate-50"}`}>
                    <td className="px-6 py-3 font-medium text-slate-900">{cm.ue}</td>
                    <td className="px-6 py-3 font-medium text-slate-900">{cm.matiere.nom}</td>
                    <td className="px-6 py-3">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                        {cm.semestre.name}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">
                        {cm.mention.abr || cm.mention.nom}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-semibold">
                        {cm.niveau.nom}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-bold text-slate-700">
                      {isEditing ? (
                        <input
                          type="number"
                          min={0.01}
                          step="0.01"
                          value={editCoeff}
                          onChange={(e) => setEditCoeff(e.target.value)}
                          className="border border-indigo-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-20"
                          autoFocus
                        />
                      ) : (
                        cm.coefficient
                      )}
                    </td>
                    <td className="px-6 py-3 font-bold text-slate-700">
                      {isEditing ? (
                        <input
                          type="number"
                          min={1}
                          value={editCredit}
                          onChange={(e) => setEditCredit(e.target.value)}
                          className="border border-indigo-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-16"
                        />
                      ) : (
                        cm.credit
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      {isEditing && professeurs.length > 0 ? (
                        <select
                          value={editProfesseurId}
                          onChange={(e) => setEditProfesseurId(e.target.value)}
                          className="border border-indigo-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                          {professeurs.map((p) => (
                            <option key={p.id} value={p.id ?? ""}>{p.nom} {p.prenom}</option>
                          ))}
                        </select>
                      ) : (
                        `${cm.professeur.nom} ${cm.professeur.prenom}`
                      )}
                    </td>
                    {showActions && (
                      <td className="px-6 py-3">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(cm)}
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
                          <div className="flex gap-2">
                            {onSaveEdit && (
                              <button
                                onClick={() => startEdit(cm)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded"
                              >
                                Modifier
                              </button>
                            )}
                            {onVoirEtudiant && (
                              <button
                                onClick={() => onVoirEtudiant(cm)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded"
                              >
                                Voir Etudiant
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    )}
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
