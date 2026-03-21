import { EtudiantRecherche } from "@/lib/db";
import { sortStudentsAlphabetically } from "@/lib/utils";

export async function rechercherEtudiants(nom: string, prenom: string): Promise<EtudiantRecherche[]> {
  const res = await fetch("/api/etudiants/recherche", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, prenom }),
  });
  if (!res.ok) return [];
  const response = await res.json();
  return sortStudentsAlphabetically<EtudiantRecherche>(response.data ?? []);
}
