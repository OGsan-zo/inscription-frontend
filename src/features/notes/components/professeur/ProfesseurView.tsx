'use client';

import { useState, useEffect } from "react";
import PageTabs from "../shared/PageTabs";
import ProfesseurListeMatiereTable from "./ProfesseurListeMatiereTable";
import VoirListeEtudiantTable from "./VoirListeEtudiantTable";
import {
  getProfesseurMatieres,
  getEtudiantsForMatiere,
  soumettreNotesNormales,
  soumettreNotesRattrapage,
} from "../../services/professeurService";
import { MatiereCoeff, EtudiantNotesProfesseur } from "../../types/notes";

const TABS = [
  { key: "liste",    label: "Liste Matière" },
  { key: "etudiants", label: "Voir Liste Etudiant" },
];

export default function ProfesseurView() {
  const [activeTab, setActiveTab] = useState("liste");
  const [matieres, setMatieres] = useState<MatiereCoeff[]>([]);
  const [etudiants, setEtudiants] = useState<EtudiantNotesProfesseur[]>([]);
  const [selectedMatiere, setSelectedMatiere] = useState<MatiereCoeff | null>(null);

  useEffect(() => {
    getProfesseurMatieres().then(setMatieres);
  }, []);

  const handleVoirEtudiant = async (matiere: MatiereCoeff) => {
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
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Liste Matière</h2>
          <ProfesseurListeMatiereTable
            matieres={matieres}
            onVoirEtudiant={handleVoirEtudiant}
          />
        </div>
      )}

      {activeTab === "etudiants" && (
        <div>
          {selectedMatiere && (
            <p className="text-xs text-gray-500 mb-3">
              Matière : <span className="font-medium text-gray-700">{selectedMatiere.nom}</span>
              {" — "}{selectedMatiere.semestre.nom} / {selectedMatiere.niveau.nom}
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
