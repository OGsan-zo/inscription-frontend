import { toast } from "sonner";

/**
 * Extrait le message d'erreur d'une réponse HTTP non-ok et affiche un toast.
 * À appeler après un `if (!res.ok)` ou dans un `catch`.
 *
 * @param context  Nom de la fonction appelante — affiché dans la console pour debug
 * @param res      La Response HTTP (optionnel) — pour lire le body JSON
 * @param err      L'erreur capturée (optionnel) — fallback si pas de response
 */
export async function handleApiError(
  context: string,
  res?: Response,
  err?: unknown
): Promise<void> {
  let message = "Erreur inconnue";

  if (res) {
    try {
      const json = await res.json();
      message =
        json.error ||
        json.message ||
        (json.missingFields ? `Champs manquants : ${json.missingFields.join(", ")}` : null) ||
        `Erreur HTTP ${res.status}`;
    } catch {
      message = `Erreur HTTP ${res.status}`;
    }
  } else if (err instanceof Error) {
    message = err.message;
  }

  console.error(`[${context}]`, message, err ?? "");
  toast.error(message, { description: `Source : ${context}` });
}
