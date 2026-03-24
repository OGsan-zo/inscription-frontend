'use client';

import { useState, useEffect } from "react";
import { toast } from "sonner";
import PageTabs from "../shared/PageTabs";
import CoeffMentionTable from "../shared/table/CoeffMentionTable";
import VoirListeEtudiantTable from "./VoirListeEtudiantTable";
import { useRouter } from 'next/navigation';
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

const CURRENT_YEAR = new Date().getFullYear();

export default function ProfesseurView() {
  const [activeTab, setActiveTab] = useState("liste");
  const [matieres, setMatieres] = useState<MatiereCoeffItem[]>([]);
  const [etudiants, setEtudiants] = useState<EtudiantNotesProfesseur[]>([]);
  const [selectedMatiere, setSelectedMatiere] = useState<MatiereCoeffItem | null>(null);
  const [loadingEtudiants, setLoadingEtudiants] = useState(false);
  const [annee, setAnnee] = useState(CURRENT_YEAR);
  const router = useRouter();
  
  useEffect(() => {
    getProfesseurMatieres(router).then(setMatieres);
  }, [router]);

  const handleVoirEtudiant = async (matiere: MatiereCoeffItem) => {
    setSelectedMatiere(matiere);
    setActiveTab("etudiants");
    setLoadingEtudiants(true);
    try {
      const data = await getEtudiantsForMatiere(matiere.id, annee, router);
      setEtudiants(data);
    } catch {
      toast.error("Erreur lors du chargement des étudiants");
    } finally {
      setLoadingEtudiants(false);
    }
  };

  const handleAnneeChange = async (nouvelleAnnee: number) => {
    setAnnee(nouvelleAnnee);
    if (selectedMatiere) {
      setLoadingEtudiants(true);
      try {
        const data = await getEtudiantsForMatiere(selectedMatiere.id, nouvelleAnnee, router);
        setEtudiants(data);
      } catch {
        toast.error("Erreur lors du chargement des étudiants");
      } finally {
        setLoadingEtudiants(false);
      }
    }
  };

  const handleValiderNormale = async (items: { etudiantId: number; valeur: number }[]) => {
    if (!selectedMatiere) return;
    await soumettreNotes(selectedMatiere.id, annee, true, items, router);
    toast.success("Notes normales enregistrées");
    const data = await getEtudiantsForMatiere(selectedMatiere.id, annee, router);
    setEtudiants(data);
  };

  const handleValiderRattrapage = async (items: { etudiantId: number; valeur: number }[]) => {
    if (!selectedMatiere) return;
    await soumettreNotes(selectedMatiere.id, annee, false, items, router);
    toast.success("Notes de rattrapage enregistrées");
    const data = await getEtudiantsForMatiere(selectedMatiere.id, annee, router);
    setEtudiants(data);
  };

  return (
    <div>
      <PageTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "liste" && (
        <div>
          <div className="flex items-center gap-2 justify-end mb-4">
            <label className="text-xs text-gray-500 shrink-0">Année :</label>
            <select
              value={annee}
              onChange={(e) => setAnnee(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {[CURRENT_YEAR - 2, CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1].map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <CoeffMentionTable
            coeffMentions={matieres}
            onVoirEtudiant={handleVoirEtudiant}
          />
        </div>
      )}

      {activeTab === "etudiants" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            {selectedMatiere && (
              <p className="text-xs text-gray-500">
                Matière : <span className="font-medium text-gray-700">{selectedMatiere.matiere.nom}</span>
                {" — "}{selectedMatiere.semestre.name} / {selectedMatiere.niveau.nom}
              </p>
            )}
            <div className="flex items-center gap-2 sm:ml-auto">
              <label className="text-xs text-gray-500 shrink-0">Année :</label>
              <select
                value={annee}
                onChange={(e) => handleAnneeChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {[CURRENT_YEAR - 2, CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1].map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
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
