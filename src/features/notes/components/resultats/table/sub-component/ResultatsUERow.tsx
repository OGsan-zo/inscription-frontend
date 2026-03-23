import type { NoteUE } from "../../../../types/notes";

interface Props {
  ue: NoteUE;
}

export default function ResultatsUERow({ ue }: Props) {
  return (
    <tr className="bg-indigo-50 border-b border-indigo-100">
      <td colSpan={5} className="px-6 py-2 font-bold text-indigo-800 text-sm">{ue.nomUE}</td>
      <td className="text-center px-4 py-2 font-bold text-indigo-800">
        {ue.ues20 != null ? ue.ues20 : "—"}
      </td>
      <td className="text-center px-4 py-2">
        {ue.ues20 != null && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${ue.ues20 >= 10 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
            {ue.ues20 >= 10 ? "Validé" : "Non validé"}
          </span>
        )}
      </td>
      <td></td>
    </tr>
  );
}
