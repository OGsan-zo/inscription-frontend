// lib/appConfig.ts
import { cache } from 'react';
import { Niveau, Mention, Formation, Nationalite, InitialData } from './db';
import { Parcours } from '@/features/parcours/type/typeParcours';
import type { UE, Semestre } from '@/features/notes/types/notes';
import type { User } from './db';


async function safeParse<T>(res: Response): Promise<T[]> {
  if (!res.ok) {
    console.error(`Erreur HTTP: ${res.status} sur ${res.url}`);
    return [];
  }
  try {
    const text = await res.text();
    if (!text) return [];
    const json = JSON.parse(text);
    return json.data || [];
  } catch (e) {
    console.error("Erreur de parsing JSON", e);
    return [];
  }
}

export const getInitialData = cache(async (): Promise<InitialData> => { 

 const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  try {
    const [resNiveaux, resMentions, resFormations, resNationalites, resParcours, resUEs, resSemestres, resProfesseurs] = await Promise.all([
      fetch(`${baseUrl}/api/etudiants/niveaux`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/etudiants/mentions`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/etudiants/formations`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/nationalites`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/parcours`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/notes/ue`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/notes/semestres`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/users/professeurs`, { cache: 'no-store' }),
    ]);

    const niveaux = await safeParse<Niveau>(resNiveaux);
    const mentions = await safeParse<Mention>(resMentions);
    const formations = await safeParse<Formation>(resFormations);
    const nationalites = await safeParse<Nationalite>(resNationalites);
    const parcours = await safeParse<Parcours>(resParcours);

    const ues = await safeParse<UE>(resUEs);
    const semestres = await safeParse<Semestre>(resSemestres);

    const professeurs = (await safeParse<User>(resProfesseurs));

    return { niveaux, mentions, formations, nationalites, parcours, ues, semestres, professeurs };
  } catch (error) {
    console.error("❌ Erreur getInitialData:", error);
    return { niveaux: [], mentions: [], formations: [], nationalites: [], parcours: [], ues: [], semestres: [], professeurs: [] };
  }
});