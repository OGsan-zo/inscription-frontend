"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/lib/db";
import Header from "@/components/static/Header";
import Menu from "@/components/static/Menu";
import { Loader2 } from "lucide-react";
import FormulaireEtudiant from "@/components/admin/modification/FormulaireEtudiant";
import { useInitialData } from "@/context/DataContext";
import RechercheEtudiant from "@/components/shared/RechercheEtudiant";
import { Card } from "@/components/ui/card";
import { useRechercheEtudiant } from "@/hooks/useRechercheEtudiant";

function ModificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEtudiantId, setSelectedEtudiantId] = useState<number | string | null>(null);

  const { nationalites } = useInitialData();
  const { nom, prenom, resultats, loading: loadingRecherche, setNom, setPrenom, setResultats, rechercher } = useRechercheEtudiant();

  useEffect(() => {
    const init = async () => {
      try {
        const n = searchParams.get("nom");
        const p = searchParams.get("prenom");
        if (n) setNom(n);
        if (p) setPrenom(p);

        const authRes = await fetch(`/api/auth/me`);
        if (!authRes.ok) { router.push('/login'); return; }

        const data = await authRes.json();
        setUser(data.user);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router, searchParams]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Header user={user} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Menu user={user} activeTab="" setActiveTab={() => { }} />

        {/* BARRE DE RECHERCHE */}
        <Card className="max-w-4xl mx-auto mb-6 p-6 shadow-lg border-t-4 border-blue-900">
          <RechercheEtudiant
            nom={nom}
            prenom={prenom}
            loading={loadingRecherche}
            resultats={resultats}
            etudiantSelectionne={null}
            onNomChange={setNom}
            onPrenomChange={setPrenom}
            onRecherche={rechercher}
            onSelectEtudiant={(e) => { setSelectedEtudiantId(e.id); setResultats([]); }}
          />
        </Card>

        {/* AFFICHAGE CONDITIONNEL DU SOUS-COMPOSANT */}
        {selectedEtudiantId && (
          <FormulaireEtudiant
            idEtudiant={selectedEtudiantId}
            nationalites={nationalites}
            onClose={() => setSelectedEtudiantId(null)}
            onSuccess={() => setSelectedEtudiantId(null)}
          />
        )}
      </div>
    </main>
  );
}

export default function ModificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-slate-300" />
      </div>
    }>
      <ModificationContent />
    </Suspense>
  );
}
