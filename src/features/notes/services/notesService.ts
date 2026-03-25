import type {
  UE,
  MatiereUE,
  Semestre,
  MatiereCoeffItem,
  EtudiantRecherche,
  ResultatEtudiant,
} from "../types/notes";
import { handleApiError } from "../utils/handleApiError";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// --- Utilitaire de redirection ---
const login = process.env.NEXT_PUBLIC_LOGIN_URL || '/login';
const checkAuth = async (res: Response, router: AppRouterInstance) => {
  if (res.status === 401 || res.status === 403) {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(login);
    return true;
  }
  return false;
};

// ── UE ────────────────────────────────────────────────────────────────────

export async function getUEs(router: AppRouterInstance): Promise<UE[]> {
  try {
    const res = await fetch("/api/notes/ue");
    if (!res.ok) {
      if (await checkAuth(res, router)) return [];
      await handleApiError("getUEs", res); 
      return []; 
    }
    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    await handleApiError("getUEs", undefined, err);
    return [];
  }
}

export async function createUE(name: string, router: AppRouterInstance): Promise<void> {
  try {
    const res = await fetch("/api/notes/ue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      if (await checkAuth(res, router)) return;
      await handleApiError("createUE", res);
    }
  } catch (err) {
    await handleApiError("createUE", undefined, err);
  }
}

// ── Semestres ─────────────────────────────────────────────────────────────

export async function getSemestres(router: AppRouterInstance): Promise<Semestre[]> {
  try {
    const res = await fetch("/api/notes/semestres");
    if (!res.ok) {
      if (await checkAuth(res, router)) return [];
      await handleApiError("getSemestres", res); 
      return []; 
    }
    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    await handleApiError("getSemestres", undefined, err);
    return [];
  }
}

// ── Matières ──────────────────────────────────────────────────────────────

export async function getMatieres(router: AppRouterInstance): Promise<MatiereUE[]> {
  try {
    const res = await fetch("/api/notes/matieres");
    if (!res.ok) {
      if (await checkAuth(res, router)) return [];
      await handleApiError("getMatieres", res); 
      return []; 
    }
    const json = await res.json();
    return (json.data ?? []).map((m: any): MatiereUE => ({
      id: m.id,
      nom: m.name,
      ue: { id: m.ue.id, name: m.ue.name },
      semestre: { id: m.semestre.id, name: m.semestre.name },
    }));
  } catch (err) {
    await handleApiError("getMatieres", undefined, err);
    return [];
  }
}

export async function createMatiere(
  name: string,
  ueId: number,
  semestreId: number,
  router: AppRouterInstance
): Promise<void> {
  try {
    const res = await fetch("/api/notes/matieres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, ueId, semestreId }),
    });
    if (!res.ok) {
      if (await checkAuth(res, router)) return;
      await handleApiError("createMatiere", res);
    }
  } catch (err) {
    await handleApiError("createMatiere", undefined, err);
  }
}

// ── Coefficients ──────────────────────────────────────────────────────────

export async function getMatieresCoeff(router: AppRouterInstance): Promise<MatiereCoeffItem[]> {
  try {
    const res = await fetch("/api/notes/matieres-coeff");
    if (!res.ok) {
      if (await checkAuth(res, router)) return [];
      await handleApiError("getMatieresCoeff", res); 
      return []; 
    }
    const json = await res.json();

    return (json.data ?? []).map((c: any): MatiereCoeffItem => ({
      id: c.id,
      ue: c.ue,
      matiere: { id: c.matiereId, nom: c.matiereNom },
      semestre: { id: c.semestreId, name: c.semestreNom },
      mention: { id: c.mentionId, nom: c.mentionNom },
      coefficient: c.coefficient,
      credit: c.credit,
      niveau: { id: c.niveauId, nom: c.niveauNom },
      professeur: { id: c.professeurId, nom: c.professeurNom, prenom: c.professeurPrenom },
    }));
  } catch (err) {
    await handleApiError("getMatieresCoeff", undefined, err);
    return [];
  }
}

export async function createMatiereCoeff(
  idMatiere: number,
  idMention: number,
  idNiveau: number,
  idProfesseur: number,
  coefficient: number,
  router: AppRouterInstance
): Promise<void> {
  try {
    const res = await fetch("/api/notes/matieres-coeff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idMatiere, idMention, idNiveau, idProfesseur, coefficient }),
    });
    if (!res.ok) {
      if (await checkAuth(res, router)) return;
      await handleApiError("createMatiereCoeff", res);
    }
  } catch (err) {
    await handleApiError("createMatiereCoeff", undefined, err);
  }
}

export async function updateUE(id: number, name: string, router: AppRouterInstance): Promise<void> {
  try {
    const res = await fetch(`/api/notes/ue/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      if (await checkAuth(res, router)) return;
      await handleApiError("updateUE", res);
    }
  } catch (err) {
    await handleApiError("updateUE", undefined, err);
  }
}

export async function updateMatiere(
  id: number,
  name: string,
  ueId: number,
  semestreId: number,
  router: AppRouterInstance
): Promise<void> {
  try {
    const res = await fetch(`/api/notes/matieres/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, ueId, semestreId }),
    });
    if (!res.ok) {
      if (await checkAuth(res, router)) return;
      await handleApiError("updateMatiere", res);
    }
  } catch (err) {
    await handleApiError("updateMatiere", undefined, err);
  }
}

// ── Résultats étudiant ────────────────────────────────────────────────────

export async function rechercherEtudiants(nom: string, prenom: string, router: AppRouterInstance): Promise<EtudiantRecherche[]> {
  try {
    const res = await fetch("/api/etudiants/recherche", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom }),
    });
    if (!res.ok) {
      if (await checkAuth(res, router)) return [];
      await handleApiError("rechercherEtudiants", res); 
      return []; 
    }
    const json = await res.json();
    return (json.data ?? []).map((e: any): EtudiantRecherche => ({
      id: e.id,
      nom: e.nom,
      prenom: e.prenom,
      mention: e.mention,
      niveau: e.niveau,
    }));
  } catch (err) {
    await handleApiError("rechercherEtudiants", undefined, err);
    return [];
  }
}

export async function getResultatEtudiant(idEtudiant: number, idSemestre: number, router: AppRouterInstance): Promise<ResultatEtudiant | null> {
  try {
    const res = await fetch(`/api/notes/resultats/${idEtudiant}?idSemestre=${idSemestre}`);
    if (!res.ok) {
      if (await checkAuth(res, router)) return null;
      await handleApiError("getResultatEtudiant", res); 
      return null; 
    }
    const json = await res.json();
    return json.data ?? null;
  } catch (err) {
    await handleApiError("getResultatEtudiant", undefined, err);
    return null;
  }
}