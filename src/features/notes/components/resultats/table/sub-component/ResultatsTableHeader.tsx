export default function ResultatsTableHeader() {
  return (
    <thead>
      <tr className="bg-slate-50 border-b border-slate-200">
        <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/3">UE / EC</th>
        <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Coef</th>
        <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Crédit</th>
        <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">EC /20</th>
        <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">EC×Coef</th>
        <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">UE /20</th>
        <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Résultat</th>
      </tr>
    </thead>
  );
}
