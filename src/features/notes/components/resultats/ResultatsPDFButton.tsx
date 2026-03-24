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
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18M3 6a1 1 0 011-1h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6z" />
          </svg>
          Télécharger le relevé Excel
        </>
      )}
    </Button>
  );
}
