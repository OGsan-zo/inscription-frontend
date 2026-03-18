"use client";

import { useState, useEffect } from "react";
import {
  getMatieres,
  getSemestres,
  getMentions,
  getMatiereSemestres,
  getMatieresCoeffMentions,
  addMatiereSemestre,
  addMatiereCoefficientMention,
} from "../services/notesService";
import type {
  Matiere,
  Semestre,
  MentionNote,
  MatiereSemestre,
  MatiereCoefficientMention,
} from "../types/notes";
import MatiereSemestreForm from "./admin/form/MatiereSemestreForm";
import MatiereSemestreTable from "./admin/table/MatiereSemestreTable";
import CoeffMentionForm from "./admin/form/CoeffMentionForm";
import CoeffMentionTable from "./admin/table/CoeffMentionTable";

export default function AdminMatieresView() {
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [semestres, setSemestres] = useState<Semestre[]>([]);
  const [mentions, setMentions] = useState<MentionNote[]>([]);
  const [matiereSemestres, setMatiereSemestres] = useState<MatiereSemestre[]>([]);
  const [coeffMentions, setCoeffMentions] = useState<MatiereCoefficientMention[]>([]);

  // Form 1 — Matière par Semestre
  const [f1Matiere, setF1Matiere] = useState("");
  const [f1Semestre, setF1Semestre] = useState("");
  const [f1Saving, setF1Saving] = useState(false);

  // Form 2 — Coefficient Mention
  const [f2MatSem, setF2MatSem] = useState("");
  const [f2Coeff, setF2Coeff] = useState("");
  const [f2Mention, setF2Mention] = useState("");
  const [f2Saving, setF2Saving] = useState(false);

  useEffect(() => {
    Promise.all([
      getMatieres(),
      getSemestres(),
      getMentions(),
      getMatiereSemestres(),
      getMatieresCoeffMentions(),
    ]).then(([m, s, mn, ms, cm]) => {
      setMatieres(m);
      setSemestres(s);
      setMentions(mn);
      setMatiereSemestres(ms);
      setCoeffMentions(cm);
    });
  }, []);

  const handleAddMatiereSemestre = async () => {
    if (!f1Matiere || !f1Semestre) return;
    setF1Saving(true);
    await addMatiereSemestre(Number(f1Matiere), Number(f1Semestre));
    setMatiereSemestres(await getMatiereSemestres());
    setF1Matiere("");
    setF1Semestre("");
    setF1Saving(false);
  };

  const handleAddCoeffMention = async () => {
    if (!f2MatSem || !f2Coeff || !f2Mention) return;
    setF2Saving(true);
    await addMatiereCoefficientMention(Number(f2MatSem), Number(f2Mention), Number(f2Coeff));
    setCoeffMentions(await getMatieresCoeffMentions());
    setF2MatSem("");
    setF2Coeff("");
    setF2Mention("");
    setF2Saving(false);
  };

  return (
    <div className="space-y-10">
      <MatiereSemestreForm
        matieres={matieres}
        semestres={semestres}
        matiere={f1Matiere}
        semestre={f1Semestre}
        saving={f1Saving}
        onMatiereChange={setF1Matiere}
        onSemestreChange={setF1Semestre}
        onSubmit={handleAddMatiereSemestre}
      />
      <MatiereSemestreTable matiereSemestres={matiereSemestres} />
      <CoeffMentionForm
        matiereSemestres={matiereSemestres}
        mentions={mentions}
        matSem={f2MatSem}
        coeff={f2Coeff}
        mention={f2Mention}
        saving={f2Saving}
        onMatSemChange={setF2MatSem}
        onCoeffChange={setF2Coeff}
        onMentionChange={setF2Mention}
        onSubmit={handleAddCoeffMention}
      />
      <CoeffMentionTable coeffMentions={coeffMentions} />
    </div>
  );
}
