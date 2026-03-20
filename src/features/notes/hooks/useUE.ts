import { useState, useEffect } from "react";
import { getUEs, createUE } from "../services/notesService";
import type { UE } from "../types/notes";

export function useUE() {
  const [ues, setUEs] = useState<UE[]>([]);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getUEs().then(setUEs);
  }, []);

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
