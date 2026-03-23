/**
 * Détermine le statut d'un EC en tenant compte de la compensation par l'UE.
 * - note >= 10                      → "Validé"
 * - 5 <= note < 10 ET isValid       → "Compensé"  (UE validée malgré la note < 10)
 * - note < 5 OU (!isValid)          → "Non validé"
 */
export function getECStatut(
  note: number,
  isValid: boolean
): "Validé" | "Compensé" | "Non validé" {
  if (note >= 10) return "Validé";
  if (note >= 5 && isValid) return "Compensé";
  return "Non validé";
}
