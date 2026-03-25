import { useState, useEffect } from "react";
import { getMatieres, createMatiere, updateMatiere } from "../services/notesService";
import { useInitialData } from "@/context/DataContext";
import type { MatiereUE } from "../types/notes";
import { useRouter } from "next/navigation";

export function useMatiereSemestre() {
  const router = useRouter();
  const { semestres, ues } = useInitialData();
  const [matieres, setMatieres] = useState<MatiereUE[]>([]);
  const [name, setName] = useState("");
  const [ueId, setUeId] = useState("");
  const [semestreId, setSemestreId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMatieres(router).then(setMatieres);
  }, [router]);

  const handleCreate = async () => {
    if (!name.trim() || !ueId || !semestreId) return;
    setSaving(true);
    await createMatiere(name.trim(), Number(ueId), Number(semestreId), router);
    setMatieres(await getMatieres(router));
    setName("");
    setUeId("");
    setSemestreId("");
    setSaving(false);
  };

  const handleUpdate = async (id: number, newName: string, newUeId: number, newSemestreId: number) => {
    if (!newName.trim() || !newUeId || !newSemestreId) return;
    setSaving(true);
    await updateMatiere(id, newName.trim(), newUeId, newSemestreId, router);
    setMatieres(await getMatieres(router));
    setSaving(false);
  };

  return {
    matieres, semestres, ues,
    name, ueId, semestreId, saving,
    setName, setUeId, setSemestreId,
    handleCreate, handleUpdate,
  };
}
