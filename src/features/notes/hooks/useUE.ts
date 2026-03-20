import { useState } from "react";
import { getUEs, createUE } from "../services/notesService";
import { useInitialData } from "@/context/DataContext";
import type { UE } from "../types/notes";

export function useUE() {
  const { ues: contextUEs } = useInitialData();
  const [ues, setUEs] = useState<UE[]>(contextUEs);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await createUE(name.trim());
    setUEs(await getUEs());
    setName("");
    setSaving(false);
  };

  return { ues, name, saving, setName, handleCreate };
}
