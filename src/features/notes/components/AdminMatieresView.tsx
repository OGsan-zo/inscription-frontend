"use client";

import { useState, useEffect } from "react";
import {
  getMatieres,
  getSemestres,
  getMentions,
  getMatiereSemestres,
  getMatieresCoeffMentions,
  addMatiereSemestre,
  addMatiereCoefficientMention,
} from "../services/notesService";
import type {
  Matiere,
  Semestre,
  MentionNote,
  MatiereSemestre,
  MatiereCoefficientMention,
} from "../types";

export default function AdminMatieresView() {
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [semestres, setSemestres] = useState<Semestre[]>([]);
  const [mentions, setMentions] = useState<MentionNote[]>([]);
  const [matiereSemestres, setMatiereSemestres] = useState<MatiereSemestre[]>([]);
  const [coeffMentions, setCoeffMentions] = useState<MatiereCoefficientMention[]>([]);

  // Form 1 — Matière par Semestre
  const [f1Matiere, setF1Matiere] = useState("");
  const [f1Semestre, setF1Semestre] = useState("");
  const [f1Saving, setF1Saving] = useState(false);

  // Form 2 — Coefficient Mention
  const [f2MatSem, setF2MatSem] = useState("");
  const [f2Coeff, setF2Coeff] = useState("");
  const [f2Mention, setF2Mention] = useState("");
  const [f2Saving, setF2Saving] = useState(false);

  useEffect(() => {
    Promise.all([
      getMatieres(),
      getSemestres(),
      getMentions(),
      getMatiereSemestres(),
      getMatieresCoeffMentions(),
    ]).then(([m, s, mn, ms, cm]) => {
      setMatieres(m);
      setSemestres(s);
      setMentions(mn);
      setMatiereSemestres(ms);
      setCoeffMentions(cm);
    });
  }, []);

  const handleAddMatiereSemestre = async () => {
    if (!f1Matiere || !f1Semestre) return;
    setF1Saving(true);
    await addMatiereSemestre(Number(f1Matiere), Number(f1Semestre));
    const updated = await getMatiereSemestres();
    setMatiereSemestres(updated);
    setF1Matiere("");
    setF1Semestre("");
    setF1Saving(false);
  };

  const handleAddCoeffMention = async () => {
    if (!f2MatSem || !f2Coeff || !f2Mention) return;
    setF2Saving(true);
    await addMatiereCoefficientMention(Number(f2MatSem), Number(f2Mention), Number(f2Coeff));
    const updated = await getMatieresCoeffMentions();
    setCoeffMentions(updated);
    setF2MatSem("");
    setF2Coeff("");
    setF2Mention("");
    setF2Saving(false);
  };

  return (
    <div className="space-y-10">

      {/* ── Section 1 : Insertion Matière par Semestre ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-base font-bold text-slate-900 mb-5">Insertion Matière par Semestre</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Matière</label>
            <select
              value={f1Matiere}
              onChange={(e) => setF1Matiere(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
            >
              <option value="">-- Choisir --</option>
              {matieres.map((m) => (
                <option key={m.id} value={m.id}>{m.nom}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Semestre</label>
            <select
              value={f1Semestre}
              onChange={(e) => setF1Semestre(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
            >
              <option value="">-- Choisir --</option>
              {semestres.map((s) => (
                <option key={s.id} value={s.id}>{s.nom}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddMatiereSemestre}
            disabled={f1Saving || !f1Matiere || !f1Semestre}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {f1Saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>

      {/* ── Section 2 : Liste Matière par Semestre ── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Liste Matière par Semestre</h3>
        </div>
        {matiereSemestres.length === 0 ? (
          <p className="text-center py-10 text-slate-400">Aucune matière enregistrée.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Matière</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Semestre</th>
              </tr>
            </thead>
            <tbody>
              {matiereSemestres.map((ms) => (
                <tr key={ms.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-900">{ms.matiere.nom}</td>
                  <td className="px-6 py-3">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{ms.semestre.nom}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Section 3 : Insertion Matière Coefficient Mention ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-base font-bold text-slate-900 mb-5">Insertion Matière Coefficient Mention</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Matière — Semestre</label>
            <select
              value={f2MatSem}
              onChange={(e) => setF2MatSem(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[220px]"
            >
              <option value="">-- Choisir --</option>
              {matiereSemestres.map((ms) => (
                <option key={ms.id} value={ms.id}>
                  {ms.matiere.nom} — {ms.semestre.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Coefficient</label>
            <input
              type="number"
              min={1}
              value={f2Coeff}
              onChange={(e) => setF2Coeff(e.target.value)}
              placeholder="ex: 3"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mention</label>
            <select
              value={f2Mention}
              onChange={(e) => setF2Mention(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
            >
              <option value="">-- Choisir --</option>
              {mentions.map((m) => (
                <option key={m.id} value={m.id}>{m.abr || m.nom}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddCoeffMention}
            disabled={f2Saving || !f2MatSem || !f2Coeff || !f2Mention}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {f2Saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>

      {/* ── Section 4 : Liste Matière Coefficient Mention ── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Liste Matière Coefficient Mention</h3>
        </div>
        {coeffMentions.length === 0 ? (
          <p className="text-center py-10 text-slate-400">Aucune entrée enregistrée.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Matière</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Semestre</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Mention</th>
                <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Coefficient</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {coeffMentions.map((cm) => (
                <tr key={cm.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-900">{cm.matiereSemestre.matiere.nom}</td>
                  <td className="px-6 py-3">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{cm.matiereSemestre.semestre.nom}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">{cm.mention.abr || cm.mention.nom}</span>
                  </td>
                  <td className="px-6 py-3 font-bold text-slate-700">{cm.coefficient}</td>
                  <td className="px-6 py-3 text-right">
                    <button className="px-4 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
