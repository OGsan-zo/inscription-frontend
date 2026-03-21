"use client";

import { useState } from "react";
import { toast } from "sonner";
import { EtudiantRecherche } from "@/lib/db";
import { rechercherEtudiants, AuthError } from "@/services/etudiantService";

interface Options {
  onBeforeSearch?: () => void;
  onAuthError?: () => void;
  onSearchSuccess?: (count: number) => void;
}

export function useRechercheEtudiant(options?: Options) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [resultats, setResultats] = useState<EtudiantRecherche[]>([]);
  const [loading, setLoading] = useState(false);

  const rechercher = async () => {
    if (!nom.trim() && !prenom.trim()) return toast.error("Entrez un critère");
    options?.onBeforeSearch?.();
    setLoading(true);
    try {
      const data = await rechercherEtudiants(nom, prenom);
      if (data.length > 0) {
        setResultats(data);
        toast.success(`${data.length} étudiant(s) trouvé(s)`);
        options?.onSearchSuccess?.(data.length);
      } else {
        toast.error("Aucun résultat");
        setResultats([]);
      }
    } catch (e) {
      if (e instanceof AuthError) {
        toast.error("Session expirée. Redirection...");
        options?.onAuthError?.();
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setNom("");
    setPrenom("");
    setResultats([]);
  };

  return { nom, prenom, resultats, loading, setNom, setPrenom, setResultats, rechercher, reset };
}
