import { useFetchAuth } from "@/hooks/useFetchAuth";
import { ParcoursFormData, ParcoursRetour, AssignationRetour, AssignationPayload } from "../type/typeParcours";

const fetchAuth = useFetchAuth();
export const parcoursService = {
  getParcours: async (): Promise<ParcoursRetour> => {
    try {
      const res = await fetch(`/api/parcours`);
      
      // Si la réponse HTTP n'est pas "ok" (ex: 404 ou 500)
      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.error || data.message || "Erreur inconnue",
          parcours: []
        };
      }

      const parcoursData = Array.isArray(data.data) ? data.data : [];

      // Retour en cas de succès
      return {
        success: true,
        parcours: parcoursData,
      };

    } catch (error: any) {
      // Retour en cas d'erreur réseau (ex: API indisponible)
      const message = error.message || error.error|| "Une erreur inattendue est survenue lors de la récupération des parcours.";
      return {
        success: false,
        error: message,
        parcours: [],
      };
    }
  },
  createParcours: async (parcoursData: ParcoursFormData): Promise<ParcoursRetour> => {
    try {
      const res = await fetchAuth(`/api/parcours`, {
        method: 'POST', // Méthode HTTP pour la création
        headers: {
          'Content-Type': 'application/json', // On indique qu'on envoie du JSON
        },
        body: JSON.stringify(parcoursData), // On transforme l'objet en chaîne JSON
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.error || data.message || "Erreur inconnue",
          parcours: [],
        };
      }

    
      // On suppose que votre API renvoie le parcours fraîchement créé dans data.data
      // On le met dans un tableau pour respecter l'interface ParcoursRetour
      const parcoursCree = data.data ? [data.data] : [];

      return {
        success: true,
        parcours: parcoursCree,
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Une erreur inattendue est survenue lors de l'ajout du parcours.",
        parcours: [],
      };
    }
  },
  assignerParcours: async (payload: AssignationPayload): Promise<AssignationRetour> => {
    try {
      const res = await fetchAuth(`/api/parcours/assigner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const jsonResponse = await res.json();

      if (!res.ok || jsonResponse.status !== "success") {
        return {
          success: false,
          error: jsonResponse.message || "Erreur lors de l'assignation du parcours",
          data: [],
          loading: false,
        };
      }

      return {
        success: true,
        data: jsonResponse.data, // Liste des étudiants assignés
        loading: false,
      };

    } catch (error: any) {
      return {
        success: false,
        error: "Erreur réseau : impossible de joindre le serveur d'assignation.",
        data: [],
        loading: false,
      };
    }
  },
};