import type { Parcours } from "../type/typeParcours";

interface Props {
  target: Parcours;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ target, deleting, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Confirmer la suppression</h3>
        <p className="text-sm text-slate-600 mb-6">
          Voulez-vous vraiment supprimer le parcours{" "}
          <span className="font-semibold text-slate-900">"{target.nom}"</span> ?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="px-5 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-60"
          >
            {deleting ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
