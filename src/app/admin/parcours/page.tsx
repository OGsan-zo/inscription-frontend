"use client";

// export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { Mention, Niveau } from "@/lib/db";
import Header from "@/components/static/Header";
import Menu from "@/components/static/Menu";
import { useRouter } from "next/navigation";
import { useInitialData } from "@/context/DataContext";
import { User } from "@/lib/db";
import { Parcours } from "@/features/parcours/type/typeParcours";

type FormData = { nom: string; idMention: string; idNiveau: string };
const emptyForm: FormData = { nom: "", idMention: "", idNiveau: "" };

export default function ParcoursCrudPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [parcours, setParcours] = useState<Parcours[]>([]);
  const [loadingParcours, setLoadingParcours] = useState(true);

  const [filterMention, setFilterMention] = useState("");
  const [filterNiveau, setFilterNiveau] = useState("");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Parcours | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Confirm delete
  const [deleteTarget, setDeleteTarget] = useState<Parcours | null>(null);
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();
  const login = process.env.NEXT_PUBLIC_LOGIN_URL || "/login";
  const { mentions, niveaux } = useInitialData();

  // Auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { window.location.href = login; return; }
        const data = await res.json();
        setUser(data.user);
      } catch {
        window.location.href = login;
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [login]);

  // Fetch parcours
  const fetchParcours = async () => {
    setLoadingParcours(true);
    try {
      const res = await fetch("/api/parcours");
      const data = await res.json();
      setParcours(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingParcours(false);
    }
  };

  useEffect(() => { fetchParcours(); }, []);

  // Filtrage côté frontend
  const filtered = useMemo(() => {
    return parcours.filter((p) => {
      const matchMention = !filterMention || String(p.mention?.id) === filterMention;
      const matchNiveau = !filterNiveau || String(p.niveau?.id) === filterNiveau;
      return matchMention && matchNiveau;
    });
  }, [parcours, filterMention, filterNiveau]);

  // Open modal
  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (p: Parcours) => {
    setEditTarget(p);
    setForm({ nom: p.nom, idMention: String(p.mention?.id), idNiveau: String(p.niveau?.id) });
    setFormError("");
    setModalOpen(true);
  };

  // Save (create or edit)
  const handleSave = async () => {
    if (!form.nom.trim() || !form.idMention || !form.idNiveau) {
      setFormError("Tous les champs sont obligatoires.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const body = { nom: form.nom, idMention: Number(form.idMention), idNiveau: Number(form.idNiveau) };
      const res = editTarget
        ? await fetch(`/api/parcours/${editTarget.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        : await fetch("/api/parcours", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

      if (!res.ok) {
        const err = await res.json();
        setFormError(err.error || "Erreur lors de l'enregistrement.");
        return;
      }
      setModalOpen(false);
      await fetchParcours();
      router.refresh();
    } catch {
      setFormError("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/parcours/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Erreur lors de la suppression.");
        return;
      }
      setDeleteTarget(null);
      await fetchParcours();
      router.refresh();
    } catch {
      alert("Erreur réseau.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600 font-medium">Chargement...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Menu user={user} />

        <div className="mt-8">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Gestion des Parcours</h2>
              <p className="text-sm text-slate-500">Créez, modifiez et supprimez les parcours de formation</p>
            </div>
            <button
              onClick={openCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all duration-200 font-medium flex items-center gap-2"
            >
              <span className="text-lg">+</span> Nouveau Parcours
            </button>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mention</label>
              <select
                value={filterMention}
                onChange={(e) => setFilterMention(e.target.value)}
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
                onChange={(e) => setFilterNiveau(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous</option>
                {niveaux.map((n) => (
                  <option key={n.id} value={String(n.id)}>{n.nom}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Liste */}
          {loadingParcours ? (
            <div className="flex flex-col justify-center items-center py-20 bg-white rounded-2xl border border-slate-200">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-slate-500">Chargement de la liste...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium">Aucun parcours trouvé.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Nom du parcours</th>
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Mention</th>
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Niveau</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={p.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                      <td className="px-6 py-4 font-semibold text-slate-900">{p.nom}</td>
                      <td className="px-6 py-4">
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                          {p.mention?.abr || p.mention?.nom}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-medium">
                          {p.niveau?.nom}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openEdit(p)}
                            className="px-4 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="px-4 py-1.5 text-xs font-semibold text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Create / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              {editTarget ? "Modifier le parcours" : "Nouveau parcours"}
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Nom du parcours</label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="ex: Génie Logiciel"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Mention</label>
                <select
                  value={form.idMention}
                  onChange={(e) => setForm({ ...form, idMention: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choisir une mention --</option>
                  {mentions.map((m) => (
                    <option key={m.id} value={String(m.id)}>{m.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Niveau</label>
                <select
                  value={form.idNiveau}
                  onChange={(e) => setForm({ ...form, idNiveau: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choisir un niveau --</option>
                  {niveaux.map((n) => (
                    <option key={n.id} value={String(n.id)}>{n.nom}</option>
                  ))}
                </select>
              </div>

              {formError && (
                <p className="text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{formError}</p>
              )}
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => setModalOpen(false)}
                disabled={saving}
                className="px-5 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-60"
              >
                {saving ? "Enregistrement..." : editTarget ? "Mettre à jour" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirm Delete */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirmer la suppression</h3>
            <p className="text-sm text-slate-600 mb-6">
              Voulez-vous vraiment supprimer le parcours <span className="font-semibold text-slate-900">"{deleteTarget.nom}"</span> ?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-5 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-60"
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
