"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, EtudiantRecherche } from "@/lib/db";
import Header from "@/components/static/Header";
import Menu from "@/components/static/Menu";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import FormulaireEtudiant from "@/components/admin/modification/FormulaireEtudiant";
import { sortStudentsAlphabetically } from "@/lib/utils";
import { useInitialData } from "@/context/DataContext";
import RechercheEtudiant from "@/components/shared/RechercheEtudiant";
import { Card } from "@/components/ui/card";

function ModificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Utilisation sécurisée car enveloppée dans Suspense

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [nomSearch, setNomSearch] = useState("");
  const [prenomSearch, setPrenomSearch] = useState("");
  const [etudiantsTrouves, setEtudiantsTrouves] = useState<EtudiantRecherche[]>([]);
  const [loadingRecherche, setLoadingRecherche] = useState(false);

  const { nationalites } = useInitialData();

  const [selectedEtudiantId, setSelectedEtudiantId] = useState<number | string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Récupération des valeurs depuis l'URL
        const n = searchParams.get("nom");
        const p = searchParams.get("prenom");
        if (n) setNomSearch(n);
        if (p) setPrenomSearch(p);

        const authRes = await fetch(`/api/auth/me`);

        if (!authRes.ok) {
          router.push('/login');
          return;
        }

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

  const rechercheEtudiants = async () => {
    if (!nomSearch && !prenomSearch) return toast.error("Entrez un critère");
    setLoadingRecherche(true);
    try {
      const res = await fetch("/api/etudiants/recherche", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: nomSearch, prenom: prenomSearch })
      });
      const response = await res.json();
      if (res.ok && response.data.length > 0) {
        const sortedResults = sortStudentsAlphabetically<EtudiantRecherche>(response.data);
        setEtudiantsTrouves(sortedResults);
      } else {
        toast.error("Aucun résultat");
        setEtudiantsTrouves([]);
      }
    } finally {
      setLoadingRecherche(false);
    }
  };

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
            nom={nomSearch}
            prenom={prenomSearch}
            loading={loadingRecherche}
            resultats={etudiantsTrouves}
            etudiantSelectionne={null}
            onNomChange={setNomSearch}
            onPrenomChange={setPrenomSearch}
            onRecherche={rechercheEtudiants}
            onSelectEtudiant={(e) => { setSelectedEtudiantId(e.id); setEtudiantsTrouves([]); }}
          />
        </Card>

        {/* AFFICHAGE CONDITIONNEL DU SOUS-COMPOSANT */}
        {selectedEtudiantId && (
          <FormulaireEtudiant
            idEtudiant={selectedEtudiantId}
            nationalites={nationalites}
            onClose={() => setSelectedEtudiantId(null)}
            onSuccess={() => {
              setSelectedEtudiantId(null);
            }}
          />
        )}
      </div>
    </main>
  );
}

// 2. Exportez la page principale enveloppée dans un Suspense Boundary
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