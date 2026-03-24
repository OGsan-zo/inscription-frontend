import type { NoteEC } from "../../../../types/notes";
import { getECStatut } from "../../../../utils/calculerMoyenneUE";

interface Props {
  ec: NoteEC;
  isValid: boolean;
}

const STATUT_STYLE: Record<string, string> = {
  "Validé":     "bg-emerald-50 text-emerald-700",
  "Compensé":   "bg-amber-50 text-amber-700",
  "Non validé": "bg-rose-50 text-rose-700",
};

export default function ResultatsECRow({ ec, isValid }: Props) {
  const statut = getECStatut(ec.note, isValid);

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="px-6 py-3 pl-10 text-slate-700">{ec.matiere}</td>
      <td className="text-center px-4 py-3 text-slate-600">{ec.coefficient}</td>
      <td className="text-center px-4 py-3 font-semibold text-slate-900">{ec.note}</td>
      <td className="text-center px-4 py-3 text-slate-600">{ec.noteAvecCoefficient}</td>
      <td className="text-center px-4 py-3 text-slate-400">—</td>
      <td className="text-center px-4 py-3">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${STATUT_STYLE[statut]}`}>
          {statut}
        </span>
      </td>
    </tr>
  );
}
