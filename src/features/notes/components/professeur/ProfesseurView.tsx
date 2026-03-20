'use client';

import { useState, useEffect } from "react";
import PageTabs from "../shared/PageTabs";
import CoeffMentionTable from "../shared/table/CoeffMentionTable";
import VoirListeEtudiantTable from "./VoirListeEtudiantTable";
import {
  getProfesseurMatieres,
  getEtudiantsForMatiere,
  soumettreNotesNormales,
  soumettreNotesRattrapage,
} from "../../services/professeurService";
import { MatiereCoeffItem, EtudiantNotesProfesseur } from "../../types/notes";

const TABS = [
  { key: "liste",    label: "Liste Matière" },
  { key: "etudiants", label: "Voir Liste Etudiant" },
];

export default function ProfesseurView() {
  const [activeTab, setActiveTab] = useState("liste");
  const [matieres, setMatieres] = useState<MatiereCoeffItem[]>([]);
  const [etudiants, setEtudiants] = useState<EtudiantNotesProfesseur[]>([]);
  const [selectedMatiere, setSelectedMatiere] = useState<MatiereCoeffItem | null>(null);

  useEffect(() => {
    getProfesseurMatieres().then(setMatieres);
  }, []);

  const handleVoirEtudiant = async (matiere: MatiereCoeffItem) => {
    setSelectedMatiere(matiere);
    const data = await getEtudiantsForMatiere(matiere.id);
    setEtudiants(data);
    setActiveTab("etudiants");
  };

  const handleValiderNormale = async (ids: number[]) => {
    if (!selectedMatiere) return;
    const notes = ids.map((id) => {
      const e = etudiants.find((x) => x.id === id);
      return { idEtudiant: id, note: e?.noteNormale ?? 0 };
    });
    await soumettreNotesNormales(selectedMatiere.id, notes);
  };

  const handleValiderRattrapage = async (ids: number[]) => {
    if (!selectedMatiere) return;
    const notes = ids.map((id) => {
      const e = etudiants.find((x) => x.id === id);
      return { idEtudiant: id, note: e?.noteRattrapage ?? 0 };
    });
    await soumettreNotesRattrapage(selectedMatiere.id, notes);
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
            onValiderNormale={handleValiderNormale}
            onValiderRattrapage={handleValiderRattrapage}
          />
        </div>
      )}
    </div>
  );
}
