import { EtudiantRecherche } from "@/lib/db";
import { sortStudentsAlphabetically } from "@/lib/utils";

export class AuthError extends Error {
  constructor() { super("Session expirée"); }
}

export async function rechercherEtudiants(nom: string, prenom: string): Promise<EtudiantRecherche[]> {
  const res = await fetch("/api/etudiants/recherche", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, prenom }),
  });
  if (res.status === 401 || res.status === 403) throw new AuthError();
  if (!res.ok) return [];
  const response = await res.json();
  return sortStudentsAlphabetically<EtudiantRecherche>(response.data ?? []);
}
