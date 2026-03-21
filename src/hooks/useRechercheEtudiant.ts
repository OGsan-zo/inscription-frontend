"use client";

import { useState } from "react";
import { toast } from "sonner";
import { EtudiantRecherche } from "@/lib/db";
import { rechercherEtudiants } from "@/services/etudiantService";

export function useRechercheEtudiant() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [resultats, setResultats] = useState<EtudiantRecherche[]>([]);
  const [loading, setLoading] = useState(false);

  const rechercher = async () => {
    if (!nom.trim() && !prenom.trim()) return toast.error("Entrez un critère");
    setLoading(true);
    try {
      const data = await rechercherEtudiants(nom, prenom);
      if (data.length > 0) {
        setResultats(data);
      } else {
        toast.error("Aucun résultat");
        setResultats([]);
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
