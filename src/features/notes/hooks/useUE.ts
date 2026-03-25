import { useState } from "react";
import { getUEs, createUE, updateUE } from "../services/notesService";
import { useInitialData } from "@/context/DataContext";
import type { UE } from "../types/notes";
import { useRouter } from "next/navigation";

export function useUE() {
  const router = useRouter();
  const { ues: contextUEs } = useInitialData();
  const [ues, setUEs] = useState<UE[]>(contextUEs);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await createUE(name.trim(), router);
    setUEs(await getUEs(router));
    setName("");
    setSaving(false);
  };

  const handleUpdate = async (id: number, newName: string) => {
    if (!newName.trim()) return;
    setSaving(true);
    await updateUE(id, newName.trim(), router);
    setUEs(await getUEs(router));
    setSaving(false);
  };

  return { ues, name, saving, setName, handleCreate, handleUpdate };
}
