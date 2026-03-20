import type { UE } from "../../../types/notes";

interface Props {
  ues: UE[];
}

export default function UETable({ ues }: Props) {
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
              </tr>
            </thead>
            <tbody>
              {ues.map((ue) => (
                <tr key={ue.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-900">{ue.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
