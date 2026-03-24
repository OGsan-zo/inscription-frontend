'use client';

import { useEffect, useState } from "react";
import type { User } from "@/lib/db";

/**
 * Retourne la liste des professeurs enrichie avec l'utilisateur connecté
 * si son rôle est Professeur ou ChefMention et qu'il n'est pas déjà dans la liste.
 */
export function useProfesseursWithSelf(professeurs: User[]): User[] {
  const [enriched, setEnriched] = useState<User[]>(professeurs);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(({ user }) => {
        if (!user) return;
        if (user.role !== "Professeur" && user.role !== "ChefMention") return;

        const alreadyIn = professeurs.some((p) => String(p.id) === String(user.id));
        if (alreadyIn) {
          setEnriched(professeurs);
          return;
        }

        // Décompose le name en nom / prenom (ex: "RAKOTO Jean" → nom="RAKOTO" prenom="Jean")
        const parts = (user.name ?? "").trim().split(/\s+/);
        const self: User = {
          id: user.id,
          email: user.email,
          role: user.role,
          nom: parts[0] ?? user.name,
          prenom: parts.slice(1).join(" ") || "",
          name: user.name,
        };

        setEnriched([self, ...professeurs]);
      })
      .catch(() => setEnriched(professeurs));
  }, [professeurs]);

  return enriched;
}
