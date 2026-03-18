import type { Mention, Niveau } from "@/lib/db";

interface Props {
  mentions: Mention[];
  niveaux: Niveau[];
  filterMention: string;
  filterNiveau: string;
  onMentionChange: (v: string) => void;
  onNiveauChange: (v: string) => void;
}

export default function ParcoursFilters({
  mentions,
  niveaux,
  filterMention,
  filterNiveau,
  onMentionChange,
  onNiveauChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mention</label>
        <select
          value={filterMention}
          onChange={(e) => onMentionChange(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Toutes</option>
          {mentions.map((m) => (
            <option key={m.id} value={String(m.id)}>{m.nom}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Niveau</label>
        <select
          value={filterNiveau}
          onChange={(e) => onNiveauChange(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous</option>
          {niveaux.map((n) => (
            <option key={n.id} value={String(n.id)}>{n.nom}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
