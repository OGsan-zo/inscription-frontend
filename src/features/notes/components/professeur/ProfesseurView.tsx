'use client';

import { useState, useEffect } from "react";
import { toast } from "sonner";
import PageTabs from "../shared/PageTabs";
import CoeffMentionTable from "../shared/table/CoeffMentionTable";
import VoirListeEtudiantTable from "./VoirListeEtudiantTable";
import {
  getProfesseurMatieres,
  getEtudiantsForMatiere,
  soumettreNotes,
} from "../../services/professeurService";
import { MatiereCoeffItem, EtudiantNotesProfesseur } from "../../types/notes";

const TABS = [
  { key: "liste",     label: "Liste Matière" },
  { key: "etudiants", label: "Voir Liste Etudiant" },
];

const ANNEE = new Date().getFullYear();

export default function ProfesseurView() {
  const [activeTab, setActiveTab] = useState("liste");
  const [matieres, setMatieres] = useState<MatiereCoeffItem[]>([]);
  const [etudiants, setEtudiants] = useState<EtudiantNotesProfesseur[]>([]);
  const [selectedMatiere, setSelectedMatiere] = useState<MatiereCoeffItem | null>(null);
  const [loadingEtudiants, setLoadingEtudiants] = useState(false);

  useEffect(() => {
    getProfesseurMatieres().then(setMatieres);
  }, []);

  const handleVoirEtudiant = async (matiere: MatiereCoeffItem) => {
    setSelectedMatiere(matiere);
    setActiveTab("etudiants");
    setLoadingEtudiants(true);
    try {
      const data = await getEtudiantsForMatiere(matiere.id, ANNEE);
      setEtudiants(data);
    } catch {
      toast.error("Erreur lors du chargement des étudiants");
    } finally {
      setLoadingEtudiants(false);
    }
  };

  const handleValiderNormale = async (items: { etudiantId: number; valeur: number }[]) => {
    if (!selectedMatiere) return;
    await soumettreNotes(selectedMatiere.id, ANNEE, true, items);
    toast.success("Notes normales enregistrées");
    const data = await getEtudiantsForMatiere(selectedMatiere.id, ANNEE);
    setEtudiants(data);
  };

  const handleValiderRattrapage = async (items: { etudiantId: number; valeur: number }[]) => {
    if (!selectedMatiere) return;
    await soumettreNotes(selectedMatiere.id, ANNEE, false, items);
    toast.success("Notes de rattrapage enregistrées");
    const data = await getEtudiantsForMatiere(selectedMatiere.id, ANNEE);
    setEtudiants(data);
  };

  return (
    <div>
      <PageTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "liste" && (
        <CoeffMentionTable
          coeffMentions={matieres}
          onVoirEtudiant={handleVoirEtudiant}
        />
      )}

      {activeTab === "etudiants" && (
        <div>
          {selectedMatiere && (
            <p className="text-xs text-gray-500 mb-3">
              Matière : <span className="font-medium text-gray-700">{selectedMatiere.matiere.nom}</span>
              {" — "}{selectedMatiere.semestre.name} / {selectedMatiere.niveau.nom}
            </p>
          )}
          <VoirListeEtudiantTable
            etudiants={etudiants}
            loading={loadingEtudiants}
            onValiderNormale={handleValiderNormale}
            onValiderRattrapage={handleValiderRattrapage}
          />
        </div>
      )}
    </div>
  );
}
