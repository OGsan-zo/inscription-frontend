"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { genererReleve } from "../../services/genererReleve";
import type { EtudiantRecherche, ResultatEtudiant } from "../../types/notes";

interface Props {
  etudiant: EtudiantRecherche;
  semestreName: string;
  anneeUniversitaire?: string;
  resultat: ResultatEtudiant;
}

export default function ResultatsPDFButton({ etudiant, semestreName, anneeUniversitaire, resultat }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await genererReleve({ etudiant, semestreName, anneeUniversitaire, resultat });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      variant="outline"
      className="flex items-center gap-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
    >
      {loading ? (
        <>
          <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          Génération…
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 8l-3-3m3 3l3-3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>
          Télécharger le relevé PDF
        </>
      )}
    </Button>
  );
}
