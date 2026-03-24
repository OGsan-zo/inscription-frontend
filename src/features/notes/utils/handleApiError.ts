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
      
      // On cherche le message le plus précis possible
      const specificError = 
        json.error || 
        json.message || 
        (json.missingFields ? `Champs manquants : ${json.missingFields.join(", ")}` : null);

      // Si on a trouvé un message précis dans le JSON, on l'utilise.
      // Sinon, on affiche l'erreur HTTP par défaut.
      message = specificError || `Erreur HTTP ${res.status}`;
      
    } catch {
      // Si le JSON ne peut pas être lu (ex: erreur 500 brute)
      message = `Erreur HTTP ${res.status}`;
    }
  } else if (err instanceof Error) {
    message = err.message;
  }

  toast.error(message);
}