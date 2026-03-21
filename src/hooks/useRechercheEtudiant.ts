"use client";

import { useState } from "react";
import { toast } from "sonner";
import { EtudiantRecherche } from "@/lib/db";
import { sortStudentsAlphabetically } from "@/lib/utils";

export function useRechercheEtudiant() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [resultats, setResultats] = useState<EtudiantRecherche[]>([]);
  const [loading, setLoading] = useState(false);

  const rechercher = async () => {
    if (!nom.trim() && !prenom.trim()) return toast.error("Entrez un critère");
    setLoading(true);
    try {
      const res = await fetch("/api/etudiants/recherche", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, prenom }),
      });
      const response = await res.json();
      if (res.ok && response.data?.length > 0) {
        setResultats(sortStudentsAlphabetically<EtudiantRecherche>(response.data));
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
