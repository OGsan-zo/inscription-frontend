import { useState, useEffect } from "react";
import { getMatieres, getSemestres, createMatiere } from "../services/notesService";
import type { MatiereUE, Semestre } from "../types/notes";

export function useMatiereSemestre() {
  const [matieres, setMatieres] = useState<MatiereUE[]>([]);
  const [semestres, setSemestres] = useState<Semestre[]>([]);
  const [name, setName] = useState("");
  const [ueId, setUeId] = useState("");
  const [semestreId, setSemestreId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getMatieres(), getSemestres()]).then(([m, s]) => {
      setMatieres(m);
      setSemestres(s);
    });
  }, []);

  const handleCreate = async () => {
    if (!name.trim() || !ueId || !semestreId) return;
    setSaving(true);
    await createMatiere(name.trim(), Number(ueId), Number(semestreId));
    setMatieres(await getMatieres());
    setName("");
    setUeId("");
    setSemestreId("");
    setSaving(false);
  };

  return {
    matieres, semestres,
    name, ueId, semestreId, saving,
    setName, setUeId, setSemestreId,
    handleCreate,
  };
}
