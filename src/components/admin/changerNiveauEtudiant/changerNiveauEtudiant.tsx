"use client"

import { toast } from 'sonner';
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { Formation, Identite } from '@/lib/db'
import { useRouter } from "next/navigation"
import { useInitialData } from '@/context/DataContext';
import ChangerNiveauEtudiantForm from './sousComposant/changerNiveauEtudiantForm'
import { useRechercheEtudiant } from '@/hooks/useRechercheEtudiant';
import RechercheEtudiant from '@/components/shared/RechercheEtudiant';

export function ChangerNiveauEtudiant() {
  const router = useRouter();
  const login = process.env.NEXT_PUBLIC_LOGIN_URL || '/login';

  const [, setLoadingEtudiant] = useState(false);
  const [identite, setIdentite] = useState<Identite | null>(null)
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loadingSauvegarde, setLoadingSauvegarde] = useState(false);

  const { formations, mentions, niveaux } = useInitialData();

  const resetForm = () => {
    setIdentite(null);
    setFormation(null);
  };

  const { nom, prenom, resultats, loading: loadingRecherche, setNom, setPrenom, setResultats, rechercher } = useRechercheEtudiant({
    onBeforeSearch: resetForm,
    onAuthError: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push(login);
    },
    onSearchSuccess: () => {
      new Audio("/sounds/successed-295058.mp3").play();
    },
  });

  const fetchEtudiant = async (idEtudiant: number | string) => {
    setLoadingEtudiant(true);
    try {
      const res = await fetch(`/api/etudiants/all?idEtudiant=${encodeURIComponent(idEtudiant)}`);
      if (res.status === 401 || res.status === 403) {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push(login);
        return;
      }
      const response = await res.json();
      if (!res.ok) throw new Error(response.error || "Erreur");
      setIdentite(response.data.identite);
      setFormation(response.data.formation);
    } catch (err: any) {
      toast.error(err.message);
      new Audio("/sounds/error-011-352286.mp3").play();
    } finally {
      setLoadingEtudiant(false);
    }
  };

  const handleUpdateNiveau = async (data: any) => {
    try {
      setLoadingSauvegarde(true);
      if (data.remarque === "none") data.remarque = null;
      const dataToSend = {
        idEtudiant: Number(data.idEtudiant),
        idNiveau: Number(data.idNiveau),
        idMention: Number(data.idMention),
        idFormation: Number(data.idFormation),
        idStatus: Number(data.idStatusEtudiant),
        nouvelleNiveau: data.nouvelleNiveau === "true",
        remarque: data.remarque,
        annee: Number(data.annee),
        isBoursier: data.isBoursier === "true"
      };
      const response = await fetch("/api/etudiants/changerNiveauEtudiant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      });
      if (response.status === 401 || response.status === 403) {
        toast.error("Session expirée. Redirection...");
        await fetch("/api/auth/logout", { method: "POST" });
        router.push(login);
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        const erreurMessage = errorData.error || errorData.message || "Une erreur inattendue s'est produite.";
        toast.error(erreurMessage);
        new Audio("/sounds/error-011-352286.mp3").play();
        return;
      }
      new Audio("/sounds/success-221935.mp3").play();
      toast.success("Niveau modifié avec succès pour " + identite?.nom + " " + identite?.prenom);
    } catch (error: any) {
      const erreurMessage = error.error || error.message || "Une erreur inattendue s'est produite.";
      toast.error(erreurMessage);
      new Audio("/sounds/error-011-352286.mp3").play();
    } finally {
      setLoadingSauvegarde(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 shadow-lg border-t-4 border-blue-900">
      <RechercheEtudiant
        nom={nom}
        prenom={prenom}
        loading={loadingRecherche}
        resultats={resultats}
        etudiantSelectionne={null}
        onNomChange={setNom}
        onPrenomChange={setPrenom}
        onRecherche={rechercher}
        onSelectEtudiant={(e) => { setResultats([]); fetchEtudiant(e.id); }}
      />

      {identite && formation ? (
        <ChangerNiveauEtudiantForm
          identite={identite}
          formation={formation}
          niveaux={niveaux}
          formations={formations}
          mentions={mentions}
          onSave={handleUpdateNiveau}
          loading={loadingSauvegarde}
        />
      ) : null}
    </Card>
  )
}
