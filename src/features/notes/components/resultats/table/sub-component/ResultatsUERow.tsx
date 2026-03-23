import type { NoteUE } from "../../../../types/notes";

interface Props {
  ue: NoteUE;
}

export default function ResultatsUERow({ ue }: Props) {
  return (
    <tr className="bg-indigo-50 border-b border-indigo-100">
      <td colSpan={4} className="px-6 py-2 font-bold text-indigo-800 text-sm">{ue.ue}</td>
      <td className={`text-center px-4 py-2 font-bold ${ue.isValid ? "text-indigo-800" : "text-rose-600"}`}>
        {ue.moyenne}
      </td>
      <td className="text-center px-4 py-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${ue.isValid ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
          {ue.isValid ? "Validé" : "Non validé"}
        </span>
      </td>
    </tr>
  );
}
