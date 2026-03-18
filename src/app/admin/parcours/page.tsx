"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useInitialData } from "@/context/DataContext";
import { User } from "@/lib/db";
import { Parcours } from "@/features/parcours/type/typeParcours";
import Header from "@/components/static/Header";
import Menu from "@/components/static/Menu";
import ParcoursFilters from "@/features/parcours/components/ParcoursFilters";
import ParcoursTable from "@/features/parcours/components/ParcoursTable";
import ParcoursModal, { FormData } from "@/features/parcours/components/ParcoursModal";
import DeleteConfirmModal from "@/features/parcours/components/DeleteConfirmModal";

const emptyForm: FormData = { nom: "", idMention: "", idNiveau: "" };

export default function ParcoursCrudPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [parcours, setParcours] = useState<Parcours[]>([]);
  const [loadingParcours, setLoadingParcours] = useState(true);

  const [filterMention, setFilterMention] = useState("");
  const [filterNiveau, setFilterNiveau] = useState("");

  // Modal créer / modifier
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Parcours | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Modal suppression
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
        if (data.user.role !== "Admin") {
          await fetch("/api/auth/logout", { method: "POST" })
          router.push(login);
        }
      } catch {
        await fetch("/api/auth/logout", { method: "POST" })
        router.push(login);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [login]);

  // Fetch
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

  // Filtrage
  const filtered = useMemo(() => parcours.filter((p) => {
    const matchMention = !filterMention || String(p.mention?.id) === filterMention;
    const matchNiveau  = !filterNiveau  || String(p.niveau?.id)  === filterNiveau;
    return matchMention && matchNiveau;
  }), [parcours, filterMention, filterNiveau]);

  // Ouvrir modal
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

  // Enregistrer
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

  // Supprimer
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

          <ParcoursFilters
            mentions={mentions}
            niveaux={niveaux}
            filterMention={filterMention}
            filterNiveau={filterNiveau}
            onMentionChange={setFilterMention}
            onNiveauChange={setFilterNiveau}
          />

          <ParcoursTable
            parcours={filtered}
            loading={loadingParcours}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />

        </div>
      </div>

      {modalOpen && (
        <ParcoursModal
          editTarget={editTarget}
          form={form}
          mentions={mentions}
          niveaux={niveaux}
          saving={saving}
          error={formError}
          onFormChange={setForm}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          target={deleteTarget}
          deleting={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </main>
  );
}
