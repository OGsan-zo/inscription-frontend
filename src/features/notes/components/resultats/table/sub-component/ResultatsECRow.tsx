import type { NoteEC } from "../../../../types/notes";

interface Props {
  ec: NoteEC;
}

export default function ResultatsECRow({ ec }: Props) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="px-6 py-3 pl-10 text-slate-700">{ec.nomEC}</td>
      <td className="text-center px-4 py-3 text-slate-600">{ec.coefficient}</td>
      <td className="text-center px-4 py-3 text-slate-600">{ec.credit}</td>
      <td className="text-center px-4 py-3 font-semibold text-slate-900">
        {ec.noteSur20 != null ? ec.noteSur20 : "—"}
      </td>
      <td className="text-center px-4 py-3 text-slate-600">
        {ec.ecAvecCoef != null ? ec.ecAvecCoef : "—"}
      </td>
      <td className="text-center px-4 py-3 text-slate-400">—</td>
      <td className="text-center px-4 py-3">
        {ec.resultat && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${ec.resultat === "Validé" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
            {ec.resultat}
          </span>
        )}
      </td>
    </tr>
  );
}
