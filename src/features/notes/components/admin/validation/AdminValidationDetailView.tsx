'use client';

import { useEffect, useState } from "react";
import NiveauValidationTable from "./NiveauValidationTable";
import { getEtudiantValidationDetail } from "../../../services/professeurService";
import { EtudiantValidationDetail } from "../../../types/notes";

interface AdminValidationDetailViewProps {
  idEtudiant: number;
}

export default function AdminValidationDetailView({ idEtudiant }: AdminValidationDetailViewProps) {
  const [detail, setDetail] = useState<EtudiantValidationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEtudiantValidationDetail(idEtudiant)
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [idEtudiant]);

  const handleValiderNormale = async (idNiveau: number, ucIds: number[]) => {
    // TODO: appel API
    console.log("Valider normale", { idNiveau, ucIds });
  };

  const handleValiderRattrapage = async (idNiveau: number, ucIds: number[]) => {
    // TODO: appel API
    console.log("Valider rattrapage", { idNiveau, ucIds });
  };

  if (loading) {
    return <p className="text-sm text-gray-400">Chargement...</p>;
  }

  if (!detail) {
    return <p className="text-sm text-rose-500">Étudiant introuvable.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Info étudiant */}
      <div className="flex flex-wrap gap-4 sm:gap-8 text-sm text-gray-700">
        <span><span className="font-medium">Nom :</span> {detail.nom}</span>
        <span><span className="font-medium">Prénom :</span> {detail.prenom}</span>
        <span><span className="font-medium">Mention :</span> {detail.mention.abr ?? detail.mention.nom}</span>
      </div>

      {/* Tables par niveau */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {detail.niveaux.map((nv) => (
          <NiveauValidationTable
            key={nv.niveau.id}
            niveauValidation={nv}
            onValiderNormale={handleValiderNormale}
            onValiderRattrapage={handleValiderRattrapage}
          />
        ))}
      </div>
    </div>
  );
}
