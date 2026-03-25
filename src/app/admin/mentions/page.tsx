"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInitialData } from "@/context/DataContext";
import type { User, Mention } from "@/lib/db";
import Header from "@/components/static/Header";
import Menu from "@/components/static/Menu";
import MentionsChefTable from "@/features/notes/components/admin/MentionsChefTable";
import { assignerChefMention } from "@/features/notes/services/chefMentionService";
import toast from "react-hot-toast";

export default function MentionsChefPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [chefs, setChefs] = useState<User[]>([]);
  const [mentions, setMentions] = useState<Mention[]>([]);
  const router = useRouter();
  const login = process.env.NEXT_PUBLIC_LOGIN_URL || "/login";
  const { mentions: mentionsCtx } = useInitialData();

  // Auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { window.location.href = login; return; }
        const data = await res.json();
        setUser(data.user);
        if (data.user.role !== "Admin") {
          await fetch("/api/auth/logout", { method: "POST" });
          router.push(login);
        }
      } catch {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push(login);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [login]);

  // Fetch chefs disponibles
  useEffect(() => {
    fetch("/api/utilisateur/professeurChefMention")
      .then((r) => r.json())
      .then((d) => setChefs(d.data || []));
  }, []);

  // Utiliser les mentions du contexte (avec chefMentionId si disponible)
  useEffect(() => {
    setMentions(mentionsCtx);
  }, [mentionsCtx]);

  const handleAssigner = async (mentionId: number, chefId: number) => {
    try {
      await assignerChefMention(mentionId, chefId, router);
      const chef = chefs.find((c) => Number(c.id) === chefId);
      setMentions((prev) =>
        prev.map((m) =>
          m.id === mentionId
            ? { ...m, chefMentionId: chefId, chefMentionNom: chef?.nom, chefMentionPrenom: chef?.prenom }
            : m
        )
      );
      toast.success("Chef de mention assigné avec succès");
      router.refresh();
    } catch {
      // toast déjà affiché par le service
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Chef de Mention</h2>
            <p className="text-sm text-slate-500">Assignez un chef de mention pour chaque filière</p>
          </div>
          <MentionsChefTable
            mentions={mentions}
            chefs={chefs}
            onAssigner={handleAssigner}
          />
        </div>
      </div>
    </main>
  );
}
