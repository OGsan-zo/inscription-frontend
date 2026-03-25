import type { NoteUE } from "../../../../types/notes";

export default function ResultatsUEGroup({ ue }: { ue: NoteUE }) {
  return (
    <>
      {/* ── UE Header Row ─────────────────────────────────────────────── */}
      <tr className="bg-indigo-100 border-t-2 border-indigo-200">
        <td
          colSpan={6}
          className="px-4 py-2 font-bold text-indigo-900 text-sm uppercase tracking-wide"
        >
          {ue.ue}
        </td>
      </tr>

      {/* ── EC Rows ───────────────────────────────────────────────────── */}
      {ue.notes.map((ec) => (
        <tr key={ec.matiere} className="border-b border-slate-100 hover:bg-slate-50">
          <td className="px-4 py-2 pl-10 text-slate-700 text-sm">{ec.matiere}</td>
          <td className="text-center px-4 py-2 text-slate-600">{ec.coefficient}</td>
          <td className="text-center px-4 py-2 text-slate-600">{ec.credit}</td>
          <td className="text-center px-4 py-2 font-semibold text-slate-900">{ec.note}</td>
          <td className="text-center px-4 py-2 text-slate-600">{ec.noteAvecCoefficient}</td>
          <td className="text-center px-4 py-2 text-slate-400">—</td>
          <td className="text-center px-4 py-2 text-slate-400">—</td>
        </tr>
      ))}

      {/* ── TOTAL Row ─────────────────────────────────────────────────── */}
      <tr className="bg-slate-100 border-b-2 border-indigo-200 font-semibold">
        <td className="px-4 py-2 pl-10 text-xs text-slate-500 uppercase tracking-widest">Total</td>
        <td className="text-center px-4 py-2 text-slate-700">{ue.sommeCoefficients}</td>
        <td className="text-center px-4 py-2 text-slate-700">{ue.sommeCredit}</td>
        <td className="text-center px-4 py-2 text-slate-700">{ue.sommeNotes}</td>
        <td className="text-center px-4 py-2 text-slate-700">{ue.sommeNotesAvecCoefficient}</td>
        <td className={`text-center px-4 py-2 text-base font-bold ${ue.isValid ? "text-indigo-800" : "text-rose-600"}`}>
          {ue.moyenne}
        </td>
        <td className="text-center px-4 py-2">
          <span
            className={`text-xs font-bold px-2 py-1 rounded ${
              ue.isValid
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {ue.isValid ? "UE validée" : "Non validée"}
          </span>
        </td>
      </tr>
    </>
  );
}
